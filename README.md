# NightOwl TO 🦉

Your nocturnal companion for Toronto's best nightlife. Get real-time insights, crowd levels, and vibe checks for the city's hottest spots.

## Features

- 🌃 **Real-time Nightlife Data**: Live wait times, cover charges, and crowd levels
- 🎵 **Personalized Recommendations**: Curated suggestions based on your music taste and preferences
- 📍 **Location-Based Insights**: Discover bars and clubs in your area
- 🎯 **Vibe Matching**: Find venues that match your energy and style
- 🏆 **Loyalty System**: Earn points and unlock exclusive spots
- 📱 **Mobile-First Design**: Optimized for on-the-go nightlife planning

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials to .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
RATE_LIMIT_MAX=10
```

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 📱 Features

- **Waitlist System**: Secure email collection with rate limiting
- **Personalized Recommendations**: AI-powered venue matching
- **Real-time Data**: Live wait times, events, and crowd levels
- **User Preferences**: Music, neighborhood, and age-based filtering
- **Community Reviews**: User-generated content and ratings

## 🔒 Security

- Row Level Security (RLS) policies
- Rate limiting (10 requests/minute)
- Input validation and sanitization
- CORS protection
- Security headers

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NODE_ENV=production
RATE_LIMIT_MAX=10
```

## 📊 Database Schema

### Waitlist Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Required)
- `email` (VARCHAR, Required, Unique)
- `phone` (VARCHAR, Optional)
- `age_group` (VARCHAR, Optional)
- `neighborhood` (VARCHAR, Optional)
- `music_genres` (TEXT[], Optional)
- `created_at` (TIMESTAMPTZ)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Private project - All rights reserved.
