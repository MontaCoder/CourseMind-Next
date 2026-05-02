# CourseMind 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-cyan?style=flat&logo=tailwind)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-5cc1a7?style=flat&logo=prisma)](https://prisma.io)
[![Stripe](https://img.shields.io/badge/Stripe-22.1-green?style=flat&logo=stripe)](https://stripe.com)

**CourseMind** is an all-in-one AI-powered platform for creating, managing, and learning online courses. Built with the latest Next.js 16 (App Router), it features AI content generation, interactive quizzes, progress tracking, PDF certificates, Stripe subscriptions, and a full admin dashboard.

## ✨ Features

- **🤖 AI-Powered Course Creation**: Generate course content, theory, and quizzes using Google Gemini AI
- **📚 Rich Course Structure**: Chapters, topics with text/image/video (YouTube + Unsplash integration)
- **📊 Progress Tracking**: Real-time progress stats, completion certificates (PDF export)
- **🧠 Interactive Learning**: In-course notes, AI chatbot, chapter quizzes/exams
- **💳 Monetization**: Stripe subscriptions (Free/Monthly/Yearly plans)
- **🔗 Social Sharing**: Public/private course sharing with unique tokens
- **👨‍💼 Admin Dashboard**: Manage users, courses, payments, blogs, contacts, policies
- **✍️ Advanced Editor**: Tiptap rich text editor with tables, code blocks, images
- **🌙 Modern UI**: Responsive design, dark/light themes, Tailwind CSS + shadcn/ui
- **🔒 Secure Auth**: NextAuth.js with Google OAuth + email/password
- **📱 Marketing Pages**: Blog, pricing, about, contact, privacy/terms

## 📸 Screenshots

![Dashboard](https://via.placeholder.com/1200x600/0f172a/ffffff?text=CourseMind+Dashboard)
![Course Editor](https://via.placeholder.com/1200x600/0f172a/ffffff?text=AI+Course+Editor)
![Admin Panel](https://via.placeholder.com/1200x600/0f172a/ffffff?text=Admin+Dashboard)

*(Replace with actual screenshots)*

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Accounts: Google OAuth, Stripe, Google Gemini AI, YouTube API, Unsplash

### 1. Clone & Install
```bash
git clone https://github.com/MontaCoder/CourseMind-Next.git
cd CourseMind-Next
npm install
```

### 2. Environment Variables
Create `.env` with required vars:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/coursemind"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key (32+ chars)"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_YEARLY_PRICE_ID="price_..."

# AI & APIs
GEMINI_API_KEY="your-gemini-api-key"
YOUTUBE_API_KEY="your-youtube-api-key"
UNSPLASH_ACCESS_KEY="your-unsplash-access-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Database Setup

#### First-Time Setup (Windows + PostgreSQL)

1. **Install PostgreSQL** (15+ recommended):
   - Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   - Install with default settings (port 5432)
   - **Save the superuser `postgres` password** – you'll need it!

2. **Create Database** `coursemind`:
   
   **Option A: pgAdmin (GUI – Easiest)**
   - Open pgAdmin (installed with PostgreSQL)
   - Connect to server → Enter `postgres` password
   - Right-click **Databases** → **Create** → **Database**
   - Name: `coursemind` → **Save**

   **Option B: Command Line (psql)**
   ```bash
   psql -U postgres -h localhost
   ```
   Then in psql:
   ```sql
   CREATE DATABASE coursemind;
   \q
   ```

3. **Update `.env.local`** (create if it doesn't exist):
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/coursemind?schema=public"
   ```
   *Replace `YOUR_PASSWORD` with your postgres password*

#### Run Prisma Commands
```bash
# Push schema changes to DB (development/fast)
npx prisma db push

# Generate Prisma Client (TypeScript types)
npx prisma generate

# Optional: Create migration for Git/version control
npx prisma migrate dev --name init
```

**Commands Explained:**
| Command | What it does | Use case |
|---------|--------------|----------|
| `db push` | Syncs `schema.prisma` → DB instantly | Local dev iteration |
| `generate` | Builds Prisma Client in `node_modules/.prisma` | Required after schema changes |
| `migrate dev` | Creates migration files + applies | Team collab, production-ready |
| `migrate deploy` | Runs migrations on prod DB | Deployments |

#### Verify
```bash
npx prisma studio
```
✅ Opens database viewer in browser.

**Troubleshooting:**
- `psql not found`: Add `C:\Program Files\PostgreSQL\15\bin` to Windows PATH
- Connection refused: Check password/port/firewall
- Managed DB: Use Neon.tech / Supabase / Railway (update `DATABASE_URL`)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Project Structure

```
CourseMind-Next/
├── app/                    # App Router pages & layouts
│   ├── (auth)/             # Auth pages
│   ├── (dashboard)/        # User dashboard
│   ├── admin/              # Admin dashboard
│   └── (marketing)/        # Public marketing pages
├── components/             # UI components (shadcn/ui + custom)
├── lib/                    # Utilities, DB, auth, AI integrations
├── actions/                # Server Actions (form handling)
├── prisma/                 # Database schema
├── public/                 # Static assets
└── types/                  # TypeScript definitions
```

## 🔧 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS, shadcn/ui, next-themes |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | NextAuth.js v5 (Google OAuth) |
| **Payments** | Stripe (Subscriptions) |
| **AI/ML** | Google Gemini (content generation) |
| **Editor** | Tiptap (Rich text) |
| **Media** | YouTube API, Unsplash API |
| **Other** | Zod (validation), React Hook Form, Sonner (toasts), jsPDF (certificates) |

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add env vars in Vercel dashboard
4. Deploy! ✅

**Pro tip**: Set `NEXT_PUBLIC_APP_URL` to your production domain.

### Other Platforms
- Railway, Render, Fly.io (with PostgreSQL add-on)
- Self-host: Dockerize + Nginx

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open PR!

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is [MIT](LICENSE) licensed.

---

⭐ **Star on GitHub** if you find it useful!  
💬 **Questions?** Open an issue or join the discussion.

**Built with ❤️ by [MontaCoder](https://github.com/MontaCoder)**
