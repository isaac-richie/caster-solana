# Polymarket API Exploration Results

## ✅ **Available Endpoints**

### 1. `/markets` ✅ (Currently Using)
- **Status**: Working
- **Description**: Returns list of individual markets
- **Response**: Array of market objects
- **Query Params**: `?active=true&closed=false&limit=X&sortBy=X&sortOrder=Y`
- **Example**: `https://gamma-api.polymarket.com/markets?limit=20`

### 2. `/events` ✅ (NEW - Not Currently Using)
- **Status**: Working
- **Description**: Returns event objects that contain multiple markets grouped together
- **Response**: Array of event objects with nested `markets[]` array
- **Data Structure**:
  ```json
  {
    "id": "2890",
    "ticker": "...",
    "title": "...",
    "description": "...",
    "markets": [...],  // Array of related markets
    "series": [...],   // Series information
    "tags": [...],     // Tags
    "volume": 1335.05,
    "liquidity": 0,
    "category": "Sports"
  }
  ```
- **Use Case**: Better for grouping related markets (e.g., all NBA games in a series)
- **Example**: `https://gamma-api.polymarket.com/events?limit=20`

## 🔒 **Endpoints Requiring Authentication**

### 3. `/users` 🔒
- **Status**: Exists but requires authentication
- **HTTP Status**: 401 (Unauthorized)
- **Error Message**: "invalid token/cookies"
- **Use Case**: User-specific data, trader information (likely requires API key or session cookie)
- **Note**: This endpoint EXISTS but is protected - could be used for trader data if we get API access

## ❌ **Endpoints That Don't Exist**

The following endpoints returned 404 (Not Found):
- `/traders`
- `/leaderboard`
- `/stats`
- `/analytics`
- `/positions`
- `/trades`
- `/outcomes`
- `/liquidity`
- `/portfolio`
- `/history`
- `/volume`
- `/trending`
- `/winners`
- `/top-traders`
- `/market-stats`
- `/platform-stats`
- `/global-stats`

## 📊 **Summary**

### What We Can Use:
1. ✅ `/markets` - Individual markets (already using)
2. ✅ `/events` - Grouped markets/events (NEW - can add)

### What Requires Auth:
3. 🔒 `/users` - User/trader data (requires authentication)

### What Doesn't Exist:
- ❌ Trader leaderboards
- ❌ PnL statistics
- ❌ Individual trader data
- ❌ Trading history
- ❌ Platform statistics

## 💡 **Recommendations**

### 1. Add `/events` Endpoint Support
The `/events` endpoint provides richer data structure with:
- Grouped markets (e.g., all games in NBA series)
- Series information
- Tags
- Event-level volume/liquidity

**Implementation**: Add `getEvents()` method to `PolymarketService`

### 2. Trader Data - Alternative Approaches
Since `/users` requires auth and trader-specific endpoints don't exist:

**Option A**: On-Chain Indexing
- Index Polymarket smart contract events
- Track wallet addresses and their trades
- Calculate PnL from market outcomes
- Build our own leaderboard

**Option B**: Request API Access
- Contact Polymarket for API access
- May provide `/users` endpoint with trader data
- Requires business partnership/API key

**Option C**: Web Scraping (Not Recommended)
- Scrape Polymarket website
- Unreliable and fragile
- Likely violates ToS

### 3. Platform Statistics
Since `/stats` endpoints don't exist, we can:
- Aggregate data from `/markets` endpoint
- Calculate our own statistics:
  - Total volume
  - Active markets count
  - Category distribution
  - Price trends

## 🚀 **Next Steps**

1. ✅ Document findings (this file)
2. ⏭️ Add `/events` endpoint support to `PolymarketService`
3. ⏭️ Consider on-chain indexing for trader leaderboards
4. ⏭️ Build platform statistics from market data aggregation

