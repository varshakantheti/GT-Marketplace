'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface Thread {
  id: string;
  listing: {
    id: string;
    title: string;
    images: string[];
  };
  buyer: { id: string; name: string | null };
  seller: { id: string; name: string | null };
}

export default function InboxPage() {
  const params = useParams();
  const threadId = params?.threadId as string | undefined;
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (threadId) {
      fetchMessages(threadId);
    }
  }, [threadId]);

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/threads');
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await fetch(`/api/threads/${id}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
      setCurrentThread(data.thread);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!threadId || !messageText.trim()) return;

    try {
      const res = await fetch(`/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText }),
      });
      const data = await res.json();
      setMessages([...messages, data]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Inbox</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-4 border-b cursor-pointer hover:bg-accent ${
                      thread.id === threadId ? 'bg-accent' : ''
                    }`}
                    onClick={() => {
                      window.location.href = `/inbox/${thread.id}`;
                    }}
                  >
                    <p className="font-semibold">{thread.listing.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {thread.buyer.name || 'Buyer'} & {thread.seller.name || 'Seller'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {threadId && currentThread ? (
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 pb-4 border-b">
                    <h2 className="text-xl font-semibold">{currentThread.listing.title}</h2>
                  </div>
                  <div className="space-y-4 mb-4 h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {message.sender.name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                    />
                    <Button onClick={sendMessage}>Send</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

