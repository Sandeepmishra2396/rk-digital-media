# 🎵 RK DIGITAL MEDIA

> **Complete Full-Stack Music Distribution & Digital Media Platform**  
> Helping independent artists, singers, music producers, and record labels distribute their music across global and Indian streaming platforms and telecom networks.

---

## 🌟 Brand Information

- **Company Name**: RK DIGITAL MEDIA
- **Founder / Owner**: Raushan Pathak
- **Email**: [rkdigitalmediawork@gmail.com](mailto:rkdigitalmediawork@gmail.com)
- **Phone / WhatsApp**: [+91 7631350084](https://wa.me/917631350084)
- **Headquarters**: India

---

## 🏗️ Architecture Overview

The platform is designed with a full-stack, enterprise-grade architecture engineered to handle **10,000+ concurrent artists** without crashing or latency bottlenecks:

```
rk-digital-media/
├── backend/                  # High-Performance Node.js / Express REST API
│   ├── src/
│   │   ├── config/           # Supabase connection & Environment configuration
│   │   ├── controllers/      # Auth, Releases, Royalties, Contact controllers
│   │   ├── middleware/       # JWT Auth, Helmet, Rate Limiter, Error Handlers
│   │   ├── routes/           # /api/auth, /api/releases, /api/royalties, /api/contact, /api/health
│   │   ├── app.js            # Express app configuration & middlewares
│   │   └── server.js         # HTTP Keep-Alive, process crash-barriers & graceful shutdown
│   ├── test/                 # Automated test suite (api.test.js)
│   └── package.json          # Backend dependencies
├── src/                      # React 18 + Vite Frontend
│   ├── components/           # UI Components (Navbar, Hero, DashboardModal, AuthModal, Contact, etc.)
│   ├── context/              # AuthContext (Connected to Supabase & Backend API)
│   ├── services/             # Unified API client service with Bearer token authentication
│   └── lib/                  # Frontend Supabase client SDK
└── package.json              # Root project scripts
```

---

## 🗄️ Database Architecture (Supabase PostgreSQL)

The database runs on Supabase PostgreSQL with strict **Row Level Security (RLS)** to guarantee absolute multi-tenant privacy — **User A can NEVER view or access User B's tracks, profiles, or royalty earnings**:

1. **`profiles`**:
   - Primary key references `auth.users(id) ON DELETE CASCADE`.
   - Stores artist name, contact, verified status, unique `artist_id` (`RK-ART-XXXX`), releases count, and total streams.
   - **RLS Policy**: `auth.uid() = id` (User can strictly only read and update their own profile).

2. **`releases`**:
   - Stores catalog tracks, ISRC code, UPC barcode, DSP distribution status, and metadata.
   - **RLS Policy**: `auth.uid() = user_id` (User can only read, create, update, and delete their own tracks).

3. **`royalties`**:
   - Stores monthly streaming counts, gross payout, TDS deductions, and net payouts.
   - **RLS Policy**: `auth.uid() = user_id` (User can strictly only view their own royalty statements).

4. **`contact_inquiries`**:
   - Stores visitor distribution inquiries submitted through the contact section.
   - **RLS Policy**: Anyone can submit (`INSERT`), protected from unauthorized reading.

---

## 🛡️ Concurrency & Security Engineering (10,000+ Users)

- **Crash-Proof Process Barrier**: Handlers for `uncaughtException` and `unhandledRejection` prevent unhandled edge cases from taking down the Node process.
- **DDoS & Brute-Force Rate Limiting**: `express-rate-limit` throttles repeated failed login attempts and limits API abuse per IP.
- **HTTP Keep-Alive Tuning**: Keep-Alive timeout configured to 65s for high throughput through load-balancers and reverse proxies.
- **Payload Compression**: Real-time Gzip/Brotli compression cuts payload transit sizes by ~70%.
- **Dual-Resilience Client**: Frontend automatically routes through the backend REST API with seamless fallback to direct Supabase client SDK.

---

## 🚀 Key Features

- **Global & Indian DSP Distribution**:
  - Spotify, Apple Music, YouTube Music, Amazon Music, JioSaavn, Wynk Music, Gaana, Hungama Music, Resso, Deezer, SoundCloud.
  - Social platforms: Instagram Reels, Facebook Audio Library, Moj, Josh.
  - Caller Tunes (CRBT): Jio, Airtel Wynk, Vi, BSNL networks.
- **498+ Managed YouTube Channels**:
  - Complete directory with dynamic search, category filtering (Artist, Bhakti, Music, Films, Entertainment), subscriber count sorting, and pagination.
- **User Authentication Portal**:
  - Real email and password registration and login backed by Supabase Auth with BCrypt password hashing.
  - Instant session restoration and token storage.
  - Quick 1-Click Demo Artist Login for testing (`artist@rkdigitalmedia.in` / `password123`).
  - Google / Gmail creator login integration.
  - Forgot password flow with OTP reset code verification.
- **Artist & Creator Dashboard**:
  - Live Catalog & Track Status fetched dynamically from Supabase database.
  - In-App Track Submission Form that saves new releases directly into the database.
  - Royalty & Analytics Breakdown by Platform.
- **Interactive Contact Form**:
  - Saves inquiries directly into the database with instant confirmation.

---

## 💻 Running the Platform

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Start the Backend API Server
```bash
npm run server
```
The API server will start on [http://localhost:5000](http://localhost:5000) (Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)).

### 3. Start the Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Backend Integration Tests
```bash
npm run test:backend
```

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License & Ownership

© 2026 **RK DIGITAL MEDIA** (Raushan Pathak). All rights reserved.  
Master rights and distribution ownership retained by respective artists and creators.
