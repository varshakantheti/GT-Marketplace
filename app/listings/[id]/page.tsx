'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: string[];
  createdAt: string;
  seller: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    major: string | null;
    gradYear: number | null;
  };
  _count: {
    favorites: number;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setListing(data);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!listing) return;
    // Create thread and redirect to inbox
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          sellerId: listing.seller.id,
        }),
      });
      const data = await res.json();
      router.push(`/inbox/${data.thread.id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center">Listing not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
              {listing.images[0] ? (
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1).map((img, idx) => (
                  <div key={idx} className="relative h-20 w-full rounded overflow-hidden">
                    <Image src={img} alt={`${listing.title} ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
              <p className="text-3xl font-bold text-primary mb-4">${listing.price.toFixed(2)}</p>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-secondary rounded text-sm">
                  {listing.condition.replace('_', ' ')}
                </span>
                <span className="px-2 py-1 bg-secondary rounded text-sm">
                  {listing.location.replace('_', ' ')}
                </span>
                <span className="px-2 py-1 bg-secondary rounded text-sm">
                  {listing.category}
                </span>
              </div>
              <p className="text-muted-foreground">
                Listed {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{listing.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {listing.seller.image && (
                    <Image
                      src={listing.seller.image}
                      alt={listing.seller.name || 'Seller'}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{listing.seller.name || 'Anonymous'}</p>
                    {listing.seller.major && (
                      <p className="text-sm text-muted-foreground">{listing.seller.major}</p>
                    )}
                    {listing.seller.gradYear && (
                      <p className="text-sm text-muted-foreground">Graduating {listing.seller.gradYear}</p>
                    )}
                  </div>
                </div>
                <Button onClick={handleMessageSeller} className="w-full">
                  Message Seller
                </Button>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground space-y-2">
              <p>⚠️ Safety Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Meet in a public place</li>
                <li>Bring a friend if possible</li>
                <li>Inspect the item before purchasing</li>
                <li>Trust your instincts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

