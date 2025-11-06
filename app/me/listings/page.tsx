'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  createdAt: string;
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('/api/listings?status=ACTIVE');
      const data = await res.json();
      // Filter to only user's listings (would need auth check on backend)
      setListings(data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSold = async (id: string) => {
    try {
      await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SOLD' }),
      });
      fetchMyListings();
    } catch (error) {
      console.error('Error marking as sold:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Listings</h1>
          <Link href="/sell">
            <Button>Create New Listing</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any listings yet</p>
            <Link href="/sell">
              <Button>Create Your First Listing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <div className="relative h-48 w-full">
                  {listing.images[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    ${listing.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/listings/${listing.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View</Button>
                    </Link>
                    {listing.status === 'ACTIVE' && (
                      <Button
                        variant="secondary"
                        onClick={() => markAsSold(listing.id)}
                      >
                        Mark Sold
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

