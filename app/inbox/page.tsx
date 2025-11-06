'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Thread {
  id: string;
  listing: {
    id: string;
    title: string;
    images: string[];
  };
  buyer: { id: string; name: string | null };
  seller: { id: string; name: string | null };
  messages: Array<{
    text: string;
    createdAt: string;
  }>;
  updatedAt: string;
}

export default function InboxIndexPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/threads');
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Inbox</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {threads.map((thread) => (
              <Link key={thread.id} href={`/inbox/${thread.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex gap-4">
                    {thread.listing.images[0] && (
                      <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={thread.listing.images[0]}
                          alt={thread.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{thread.listing.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {thread.buyer.name || 'Buyer'} & {thread.seller.name || 'Seller'}
                      </p>
                      {thread.messages[0] && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {thread.messages[0].text}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

