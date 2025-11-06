import { z } from 'zod';

export const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.number().positive('Price must be positive').max(100000),
  category: z.string().min(1, 'Category is required'),
  condition: z.enum(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  location: z.enum(['ON_CAMPUS', 'OFF_CAMPUS']),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(6, 'Maximum 6 images allowed'),
});

export const updateListingSchema = listingSchema.partial().extend({
  status: z.enum(['ACTIVE', 'SOLD', 'DELETED']).optional(),
});

export const reportSchema = z.object({
  targetType: z.enum(['LISTING', 'USER']),
  targetId: z.string(),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
});

export const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(1000),
});

export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  major: z.string().max(100).optional(),
  gradYear: z.number().int().min(1900).max(2100).optional(),
});

