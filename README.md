# 🤖 PolyCaster - AI-Powered Polymarket Analytics Platform

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-orange)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**Real-time Polymarket analytics with AI-powered insights and seamless Web3 integration**

🎉 **Currently Running:** Backend (Port 8000) ✅ | Frontend (Port 3000) ✅

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Architecture](#-architecture)

</div>

---

## 🎯 **What is PolyCaster?**

PolyCaster is a modern web application that provides real-time analytics and AI-powered insights for Polymarket prediction markets. Built with Next.js and TypeScript, it offers a seamless experience for discovering, analyzing, and trading prediction markets.

### **Core Features** 🚀

- 🔍 **Real-Time Search**: Instant market search powered by Polymarket API
- 📊 **Category Filtering**: Browse markets by Sports, Crypto, Politics, Tech, Science, and Culture
- 🤖 **AI Analysis**: Get AI-powered market insights and trading recommendations
- 💼 **Web3 Integration**: Seamless wallet connection via Thirdweb
- 📈 **Visual Analytics**: Interactive probability bars and market statistics
- ⚡ **Live Updates**: Recently active markets with real-time data

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    POLYCASTER PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Next.js    │ ◄────►│  TypeScript  │ ◄────►│ Supabase│ │
│  │   Frontend   │      │    Backend   │      │ Database│ │
│  └──────┬───────┘      └──────┬───────┘      └──────────┘ │
│         │                     │                             │
│         │                     │                             │
│         ▼                     ▼                             │
│  ┌────────────────────────────────────────┐               │
│  │         SERVICE LAYER                   │               │
│  │                                          │               │
│  │  • Polymarket Service (live markets)    │               │
│  │  • AI Engine (market analysis)          │               │
│  │  • Search Service (keyword matching)    │               │
│  │  • Category Filtering (keyword-based)   │               │
│  │  • Wallet Service (Thirdweb Web3)       │               │
│  └─────────────────────────────────────────┘               │
│                                                             │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐  │
│  │ Polymarket │      │  Thirdweb  │      │  Payment   │  │
│  │  Gamma API │      │   Wallet   │      │  Gateway   │  │
│  └────────────┘      └────────────┘      └────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Current Status**

### **Services Running** ✅

| Service | Status | Port | URL |
|---------|--------|------|-----|
| **Backend API** | 🟢 Running | 8000 | http://localhost:8000 |
| **Frontend** | 🟢 Running | 3000 | http://localhost:3000 |
| **Supabase** | 🟢 Connected | - | Database Active |
| **Polymarket API** | 🟢 Connected | - | Markets Fetching |
| **AI Engine** | 🟢 Healthy | - | Ollama Ready |
| **Facilitator** | 🟢 Healthy | - | Thirdweb Active |

### **Quick Health Check**

```bash
# Verify all services
curl http://localhost:8000/health

# Expected output:
{
  "status": "healthy",
  "services": {
    "api": "running",
    "polymarket": "healthy",
    "ai_engine": "healthy",
    "facilitator": "healthy",
    "database": "healthy"
  },
  "timestamp": "2025-11-01T12:44:18.291Z"
}
```

### **Known Warnings** ⚠️

The following warnings are **safe to ignore**:
- ⚠️ `pino-pretty` module not found - Optional logging dependency
- ⚠️ Next.js workspace root detection - Multiple lockfiles detected
- ⚠️ Unsupported metadata viewport - Next.js config recommendation

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 16.0.1** - React framework with App Router
- **TypeScript 5.3** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Lucide Icons** - Icon library
- **Thirdweb 5.110+** - Web3 wallet integration & payment facilitator
- **React 19** - Latest React features

### **Backend**
- **Express.js 4.18** - Node.js web framework
- **TypeScript 5.3** - Type-safe server code
- **Axios 1.6** - HTTP client for API calls
- **tsx 4.6** - TypeScript execution with watch mode
- **Ollama 0.5** - Local AI inference

### **Database**
- **Supabase** - PostgreSQL database
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live updates

### **Blockchain**
- **Thirdweb SDK** - Wallet connection
- **WalletConnect** - Multi-wallet support
- **MetaMask** - Browser wallet integration
- **Web3 Payments** - USDC transactions

### **External APIs**
- **Polymarket Gamma API** - Real-time market data
- **Market Search** - Keyword-based filtering
- **Category Endpoints** - Structured market data

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm
- Supabase account
- Thirdweb API key

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/PolyCaster.git
cd PolyCaster

# Install frontend dependencies
cd polycasterz
npm install

# Install backend dependencies
cd ../backend-ts
npm install
```

### **Environment Variables**

**Frontend (`polycasterz/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

**Backend (`backend-ts/.env`):**
```env
# Supabase
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Polymarket
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets

# Server
PORT=8000
NODE_ENV=development
```

### **Run the Application**

**Terminal 1 - Backend:**
```bash
cd backend-ts
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd polycasterz
npm run dev
```

Visit `http://localhost:3000` to see the app! 🎉

### **Verify Services**

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

Expected backend response:
```json
{
  "status": "healthy",
  "services": {
    "api": "running",
    "polymarket": "healthy",
    "ai_engine": "healthy",
    "facilitator": "healthy",
    "database": "healthy"
  }
}
```

---

## 🔧 **Troubleshooting**

### **Port Already in Use**

If you see `Error: listen EADDRINUSE: address already in use :::8000`:

```bash
# Kill processes on port 8000
lsof -ti:8000 | xargs kill -9

# Kill processes on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Then restart the servers
```

### **Missing Dependencies**

```bash
# If you see "pino-pretty" warnings (safe to ignore)
# Or install it explicitly:
cd polycasterz
npm install --save-dev pino-pretty

# Reinstall all dependencies
npm install
```

### **Environment Variables Not Loading**

Make sure your `.env` files are in the correct locations:
- Backend: `/backend-ts/.env`
- Frontend: `/polycasterz/.env.local`

```bash
# Verify environment files exist
ls -la backend-ts/.env
ls -la polycasterz/.env.local
```

### **Database Connection Issues**

Verify your Supabase credentials:
```bash
# Test Supabase connection
curl -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  https://YOUR_PROJECT.supabase.co/rest/v1/
```

### **Frontend Not Loading Markets**

Check that backend is running and API_URL is correct:
```bash
# Verify backend is responding
curl http://localhost:8000/markets?limit=5

# Check .env.local in polycasterz
cat polycasterz/.env.local | grep API_URL
```

---

## ✨ **Features**

### **1. Real-Time Market Search** 🔍
- Search markets by keywords (e.g., "Bitcoin", "Trump", "Sports")
- Debounced API calls (500ms) for optimal performance
- Searches both questions and descriptions
- Returns only active, open markets

### **2. Smart Category Filtering** 📂
- **All** - Recently active markets across all categories
- **Sports** - Sports betting and predictions
- **Crypto** - Cryptocurrency and DeFi markets
- **Politics** - Political events and elections
- **Tech** - Technology and AI markets
- **Science** - Scientific breakthroughs and research
- **Culture** - Entertainment, media, and culture

### **3. Enhanced Market Cards** 📊
- **Visual Probability Bars** - Green (YES) vs Red (NO) split
- **Separate YES/NO Pricing** - Clear odds display
- **Analytics Grid** - Volume, Liquidity, Last Update, Market Age
- **24h Price Change** - Trending indicators
- **Time Remaining** - Countdown to market close
- **Active Status** - Live market badges

### **4. AI-Powered Analysis** 🤖
- Click "Get AI Analysis" on any market
- Receive AI-generated insights
- Get recommendations (BUY/SELL/HOLD)
- View confidence scores and risk levels
- Access price targets and reasoning

### **5. Web3 Wallet Integration** 💼
- Connect with MetaMask, WalletConnect, or Coinbase Wallet
- Seamless Thirdweb integration
- Pay for AI analysis with crypto
- View wallet balance and transactions

### **6. Responsive Design** 📱
- Mobile-friendly interface
- Dark mode support
- Smooth animations
- Loading states and error handling

---

## 📊 **API Endpoints**

### **Health & Status**
```bash
# Health check (returns all service statuses)
GET http://localhost:8000/health
```

### **Markets**
```bash
# Get all markets (default 20)
GET http://localhost:8000/markets?limit=50

# Get markets by category
GET http://localhost:8000/markets/category/:category?limit=100&fromDays=180

# Search markets by keyword
GET http://localhost:8000/markets/search?q=bitcoin&limit=20

# Get market by ID
GET http://localhost:8000/markets/:id

# Get active markets
GET http://localhost:8000/markets/active?limit=20

# Get recent markets
GET http://localhost:8000/markets/recent?limit=20

# Get trending markets (high volume)
GET http://localhost:8000/markets/trending?limit=20

# Get market overview (active + recent + trending)
GET http://localhost:8000/markets/overview?limit=10

# Get available categories
GET http://localhost:8000/markets/categories

# Get category analytics
GET http://localhost:8000/markets/category/:category/analytics?limit=20
```

**Supported Categories:**
- `all` - All markets
- `crypto` - Cryptocurrency markets
- `politics` - Political events
- `sports` - Sports betting
- `tech` - Technology & AI
- `science` - Scientific research
- `culture` - Entertainment & culture
- `economics` - Economic indicators

### **AI Analysis**
```bash
# Analyze a market (requires payment verification)
POST http://localhost:8000/ai/analyze/:marketId
Body: {
  "payment_verified": true,
  "user_wallet": "0x..."
}

# Response:
{
  "success": true,
  "signal": {
    "id": "...",
    "recommendation": "BUY|SELL|HOLD",
    "confidence_score": 85,
    "risk_level": "medium",
    "price_target": 0.75,
    "reasoning": "..."
  }
}
```

### **Users**
```bash
# Create user
POST http://localhost:8000/users
Body: { "wallet_address": "0x..." }

# Get user by wallet
GET http://localhost:8000/users/:walletAddress

# Get user stats
GET http://localhost:8000/users/:walletAddress/stats

# Get user signals history
GET http://localhost:8000/users/:walletAddress/signals?limit=10
```

### **Payment & Facilitator**
```bash
# Settle payment via Thirdweb facilitator
POST http://localhost:8000/api/payment/settle
Body: {
  "resourceUrl": "...",
  "paymentData": {...},
  "price": "$0.50"
}

# Get supported payment methods
GET http://localhost:8000/api/payment/methods?chainId=8453
```

---

## 🎨 **UI Components**

### **Market Header**
- Logo and branding
- Search bar with real-time filtering
- Category navigation
- Wallet connection button
- Market statistics display

### **Market Card (Full)**
- Market question and description
- Visual probability bar (YES/NO split)
- Separate YES/NO price cards
- 2x2 Analytics grid:
  - Volume 24h
  - Liquidity
  - Last Update (time ago)
  - Market Age (time ago)
- Time remaining indicator
- Active status badge
- Get AI Analysis button

### **Market Card (Compact)**
- Question and price change
- Visual probability bar
- Volume and liquidity
- Quick analyze button

### **AI Facilitator Modal**
- Wallet connection prompt
- Market analysis display
- Payment processing
- Results visualization

---

## 🔧 **Development**

### **Project Structure**

```
PolyCaster/
├── polycasterz/          # Next.js frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   │   ├── market/   # Market-related components
│   │   │   ├── wallet/   # Wallet components
│   │   │   └── ai/       # AI analysis components
│   │   ├── lib/          # Utilities and helpers
│   │   │   ├── categories/ # Category definitions
│   │   │   ├── api.ts    # API client
│   │   │   ├── utils.ts  # Helper functions
│   │   │   └── thirdweb.ts # Web3 config
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
│
└── backend-ts/           # Express.js backend
    ├── src/
    │   ├── index.ts      # Main server file
    │   ├── services/     # Business logic
    │   │   └── polymarket.ts # Polymarket API service
    │   └── types/        # TypeScript types
    └── package.json
```

### **Key Functions**

**Backend (`backend-ts/src/services/polymarket.ts`):**
- `getMarketsByCategory(category, limit)` - Fetch markets by category
- `searchMarkets(searchTerm, limit)` - Search markets by keyword
- `transformMarket(market)` - Transform Polymarket data
- `getTrendingMarkets()` - Get high-volume markets

**Frontend (`polycasterz/src/lib/utils.ts`):**
- `formatPrice(price)` - Format price in cents
- `formatVolume(volume)` - Format with K/M suffixes
- `formatTimeAgo(date)` - Convert to "X hours ago"
- `formatTimeRemaining(date)` - Convert to "Xd Yh"

---

## 🚀 **Deployment**

### **Frontend Deployment (Vercel)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd polycasterz
vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
# NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
```

### **Backend Deployment (Railway/Render)**

```bash
# Deploy backend to Railway/Render
# Set environment variables:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - PORT=8000
# - NODE_ENV=production

# Build command:
npm run build

# Start command:
npm start
```

### **Environment Variables Checklist**

**Frontend (Production):**
- ✅ `NEXT_PUBLIC_API_URL` - Backend API URL
- ✅ `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` - Thirdweb client ID

**Backend (Production):**
- ✅ `SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Public anon key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)
- ✅ `PORT` - Server port (default 8000)
- ✅ `NODE_ENV=production` - Production mode

### **Production Checklist**

- [ ] Update CORS origins in backend to match frontend domain
- [ ] Set up SSL/HTTPS for both frontend and backend
- [ ] Configure rate limiting for API endpoints
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure logging service
- [ ] Set up database backups
- [ ] Test all payment flows
- [ ] Review and secure environment variables

---

## 📈 **Roadmap**

### **✅ Completed (v2.0)**
- ✅ Next.js 14 frontend with TypeScript
- ✅ TypeScript backend with Express.js
- ✅ Real-time market search
- ✅ Category-based filtering
- ✅ Enhanced market cards with visual probability
- ✅ Thirdweb wallet integration
- ✅ AI analysis modal
- ✅ Time ago formatting
- ✅ Responsive design

### **🔄 In Progress (v2.1)**
- 🔄 User authentication
- 🔄 Signal purchase history
- 🔄 Portfolio tracking
- 🔄 Market favorites
- 🔄 Price alerts

### **📝 Planned (v3.0)**
- 📝 Trading bot integration
- 📝 Advanced charts and analytics
- 📝 Social trading features
- 📝 NFT membership tiers
- 📝 Mobile app (React Native)

---

## 🧪 **Testing**

### **Backend API Tests**

```bash
# Test backend health
curl http://localhost:8000/health

# Should return:
# {
#   "status": "healthy",
#   "services": {
#     "api": "running",
#     "polymarket": "healthy",
#     "ai_engine": "healthy",
#     "facilitator": "healthy",
#     "database": "healthy"
#   }
# }

# Search markets
curl "http://localhost:8000/markets/search?q=bitcoin&limit=5"

# Get crypto markets
curl "http://localhost:8000/markets/category/crypto?limit=10"

# Get trending markets
curl "http://localhost:8000/markets/trending?limit=5"

# Get all categories
curl http://localhost:8000/markets/categories

# Get market overview
curl "http://localhost:8000/markets/overview?limit=5"
```

### **Frontend Tests**

```bash
# Test frontend is running
curl http://localhost:3000

# Check specific routes (returns HTML)
curl http://localhost:3000/
```

### **Integration Tests**

```bash
# Test full flow - search from frontend to backend
# 1. Open http://localhost:3000
# 2. Type "bitcoin" in search bar
# 3. Should see filtered crypto markets
# 4. Click "Get AI Analysis" on any market
# 5. Should prompt for wallet connection
```

---

## 🤝 **Contributing**

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write clean, documented code
- Test your changes thoroughly
- Update README if needed

---

## 📄 **License**

MIT License - See [LICENSE](LICENSE) file for details

---

## 🔗 **Links**

- **Polymarket**: [polymarket.com](https://polymarket.com)
- **Thirdweb**: [thirdweb.com](https://thirdweb.com)
- **Supabase**: [supabase.com](https://supabase.com)
- **Next.js**: [nextjs.org](https://nextjs.org)

---

## 🙏 **Acknowledgments**

- **Polymarket** - Real-time prediction market data
- **Thirdweb** - Web3 wallet infrastructure
- **Supabase** - Database and authentication
- **Vercel** - Frontend hosting
- **Next.js Team** - Amazing framework

---

## ⚡ **Performance & Optimization**

### **Frontend Optimizations**
- ✅ Debounced search (500ms) - Reduces API calls
- ✅ React Server Components - Faster initial load
- ✅ Image optimization - Next.js automatic optimization
- ✅ Code splitting - Smaller bundle sizes
- ✅ Lazy loading - Components load on demand

### **Backend Optimizations**
- ✅ Efficient API calls - Batch requests where possible
- ✅ Market caching - Reduces external API calls
- ✅ Connection pooling - Database performance
- ✅ Error handling - Graceful fallbacks
- ✅ Health monitoring - Service status tracking

### **Best Practices**
- Search is debounced to avoid overwhelming the API
- Markets are fetched in batches (default 20, max 100)
- Category filters use keyword matching for speed
- AI analysis requires payment to prevent abuse
- Real-time updates are throttled appropriately

---

## 📞 **Support**

Need help? Have questions?

- 📧 **Issues**: Open an issue on GitHub
- 💻 **Development**: Check the troubleshooting section
- 📚 **Documentation**: Review API endpoints above
- 🤝 **Contributing**: See contributing guidelines

---

<div align="center">

Made with ❤️ by the PolyCaster Team

**PolyCaster - AI-Powered Polymarket Analytics**

[⭐ Star us on GitHub](https://github.com/yourusername/PolyCaster)

</div>
