'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Favorite {
  id: string;
  listing: {
    id: string;
    title: string;
    price: number;
    images: string[];
    createdAt: string;
  };
}

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId: string) => {
    try {
      await fetch(`/api/favorites/${listingId}`, {
        method: 'DELETE',
      });
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">My Favorites</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You haven't favorited any listings yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id}>
                <div className="relative h-48 w-full">
                  {favorite.listing.images[0] ? (
                    <Image
                      src={favorite.listing.images[0]}
                      alt={favorite.listing.title}
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
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {favorite.listing.title}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    ${favorite.listing.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {formatDistanceToNow(new Date(favorite.listing.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/listings/${favorite.listing.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View</Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => removeFavorite(favorite.listing.id)}
                    >
                      Remove
                    </Button>
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

