# BuzzMarket - Campus Marketplace

A production-ready MVP for a campus marketplace app for Georgia Tech students, similar to Facebook Marketplace.

## Features

- ✅ User authentication (Email magic links + Google OAuth)
- ✅ Create, browse, search, and filter listings
- ✅ Real-time messaging between buyers and sellers
- ✅ Favorite/save listings
- ✅ Manage your listings (edit, mark sold, delete)
- ✅ Report listings or users
- ✅ Admin panel for moderation
- ✅ Banned word filtering
- ✅ Image uploads (Uploadthing)

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth v5 (email magic links + Google OAuth)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Data Fetching:** TanStack Query
- **Validation:** Zod
- **Image Uploads:** Uploadthing
- **Real-time:** Socket.io (ready for implementation)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or hosted on Neon/Supabase)
- Google OAuth credentials (for Google sign-in)
- Email service credentials (for magic link emails)
- Uploadthing account (optional, for image uploads)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GT-Marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Random secret for NextAuth (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
   - `EMAIL_SERVER_HOST` - SMTP server host
   - `EMAIL_SERVER_PORT` - SMTP server port
   - `EMAIL_SERVER_USER` - SMTP username
   - `EMAIL_SERVER_PASSWORD` - SMTP password
   - `EMAIL_FROM` - From email address
   - `UPLOADTHING_SECRET` - Uploadthing secret (optional)
   - `UPLOADTHING_APP_ID` - Uploadthing app ID (optional)

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with demo data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── listings/          # Listing detail pages
│   ├── sell/              # Create listing page
│   └── ...
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── validations.ts    # Zod schemas
│   └── filters.ts        # Banned word filter
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── types/                 # TypeScript type definitions
```

## API Routes

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `POST /api/listings` - Create a listing (auth required)
- `GET /api/listings/[id]` - Get listing by ID
- `PATCH /api/listings/[id]` - Update listing (auth required)
- `DELETE /api/listings/[id]` - Delete listing (auth required)

### Favorites
- `POST /api/favorites` - Add favorite (auth required)
- `GET /api/favorites/me` - Get user's favorites (auth required)
- `DELETE /api/favorites/[listingId]` - Remove favorite (auth required)

### Messages
- `POST /api/threads` - Create or get thread (auth required)
- `GET /api/threads` - Get user's threads (auth required)
- `GET /api/threads/[id]/messages` - Get messages in thread (auth required)
- `POST /api/threads/[id]/messages` - Send message (auth required)

### Reports
- `POST /api/reports` - Create report (auth required)
- `GET /api/admin/reports` - Get all reports (admin only)
- `PATCH /api/admin/reports/[id]/resolve` - Resolve report (admin only)

### Admin
- `PATCH /api/admin/users/[id]/ban` - Ban user (admin only)

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Setup (Neon/Supabase)

1. Create a PostgreSQL database on Neon or Supabase
2. Copy the connection string to `DATABASE_URL`
3. Run migrations: `npm run db:push`

## Roadmap

- [ ] Campus email verification
- [ ] Stripe payments / escrow
- [ ] Ratings and reviews
- [ ] Map view for meetups
- [ ] Real-time notifications
- [ ] Advanced search with filters
- [ ] Image optimization
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

