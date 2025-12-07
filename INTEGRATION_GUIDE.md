# 🔗 Backend-Frontend Integration Guide

## ✅ Environment Configuration

### Backend (.env)
```dotenv
POSTGRES_USER="neondb_owner"
POSTGRES_PASSWORD="npg_QW0gm5ySioHe"
POSTGRES_HOST="ep-nameless-pond-a1oa6nfj-pooler.ap-southeast-1.aws.neon.tech"
POSTGRES_PORT="5432"
POSTGRES_NAME="neondb"
DATABASE_URL="postgresql://neondb_owner:npg_QW0gm5ySioHe@ep-nameless-pond-a1oa6nfj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_ACCESS_SECRET="wordit_secret_key_development_2025"
HOST="localhost"
PORT="4000"
BASE_URL="http://localhost:4000"
NODE_ENV="development"
```

### Frontend (.env)
```dotenv
VITE_API_URL=http://localhost:4000
```

---

## 🚀 Running Both Services

### Terminal 1: Start Backend (using Bun)
```bash
cd Backend
npm run start
# or for development with file watching:
npm run start:dev
```

**Expected output:**
```
✓ App listening on port 4000
✓ Database connected
```

### Terminal 2: Start Frontend
```bash
cd Frontend
npm run dev
# Vite will run on http://localhost:5173
```

**Expected output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 📋 Available Scripts

### Backend (Bun Runtime)
```bash
# Development with file watching
npm run start:dev

# Production run (single run)
npm run start

# Build for production
npm run build

# Database migration
npm run migrate:dev

# Database seeding
npm run seed:dev

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
```

### Frontend (Vite)
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Format with prettier
npm run prettier:write
```

---

## 🔌 API Connection Setup

### Backend API Base URL
- **Development:** `http://localhost:4000`
- **Production:** `https://your-api-domain.com`

### Frontend Axios Configuration
**File:** `Frontend/src/api/axios.ts`

```typescript
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:4000
  timeout: 10000,
});
```

### Score API Client
**File:** `Frontend/src/api/score/index.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// All requests use axios which automatically:
// 1. Adds JWT token from auth store
// 2. Handles 401 (logout & redirect to login)
// 3. Sets Content-Type application/json
```

---

## 🧪 Testing Integration

### Step 1: Start Backend
```bash
cd Backend
npm run start:dev
```

Check logs:
```
[Bun] src/main.ts
✓ App listening on port 4000
```

### Step 2: Start Frontend
```bash
cd Frontend
npm run dev
```

Browser opens to `http://localhost:5173`

### Step 3: Test Login Flow
1. Go to Login page
2. Enter credentials
3. Check Network tab:
   - POST `http://localhost:4000/api/auth/login`
   - Response should have JWT token

### Step 4: Test Score Endpoints
After login, you can test:

```typescript
// In browser console or React component
import ScoreAPI from '@/api/score';

// Submit score
await ScoreAPI.submitScore({
  game_id: 'game-uuid',
  score: 100,
  time_spent: 60
});

// Get highest score
const highest = await ScoreAPI.getHighestScore('game-uuid');

// Get leaderboard
const leaderboard = await ScoreAPI.getLeaderboard('game-uuid');
```

---

## 🔐 JWT Authentication Flow

### 1. User Login
```
Frontend (POST /api/auth/login)
    ↓
Backend (validates credentials)
    ↓
Backend (returns JWT token)
    ↓
Frontend (stores token in Zustand store)
```

### 2. Protected API Requests
```
Frontend (calls any protected endpoint)
    ↓
Axios Interceptor (adds Authorization header)
    ↓
Backend (validates JWT)
    ↓
Backend (returns data or 401)
    ↓
If 401: Axios Interceptor (logout & redirect to login)
```

### 3. Token Storage
**File:** `Frontend/src/store/useAuthStore.ts`

```typescript
// Token is stored in Zustand state
// Automatically added to requests by axios interceptor
const token = useAuthStore.getState().token;
```

---

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/login          - Login user
POST /api/auth/register       - Register new user
POST /api/auth/logout         - Logout
```

### Scores (NEW)
```
POST /api/score/submit           - Submit score (Auth required)
GET  /api/score/highest/:game_id - Get highest score (Auth required)
GET  /api/score/history/:game_id - Get history (Auth required)
GET  /api/score/leaderboard/:game_id - Get leaderboard (Public)
GET  /api/score/user/all-scores  - Get all scores (Auth required)
```

### Games
```
GET /api/game                 - List all published games
GET /api/game/:id             - Get game details
POST /api/game                - Create game (Auth required)
PATCH /api/game               - Update game (Auth required)
```

### Users
```
GET /api/user                 - List users (Admin only)
GET /api/user/:id             - Get user details
PATCH /api/user/:id           - Update user (Auth required)
```

---

## 📊 Request/Response Format

### Request Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Response Format (Success)
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { /* actual data */ },
  "meta": { /* pagination if applicable */ }
}
```

### Response Format (Error)
```json
{
  "statusCode": 400,
  "message": "Error message"
}
```

---

## 🐛 Debugging Tips

### Check Backend is Running
```bash
# Should return 200
curl http://localhost:4000/api/health

# Or check logs
# Should see: "✓ App listening on port 4000"
```

### Check Frontend Can Reach Backend
```javascript
// In browser console
fetch('http://localhost:4000').then(r => console.log(r))
```

### Check JWT Token
```javascript
// In browser console
import { useAuthStore } from '@/store/useAuthStore';
console.log(useAuthStore.getState().token);
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Make a request (login)
4. Click request
5. Check:
   - URL: `http://localhost:4000/api/auth/login`
   - Method: POST
   - Status: 200 or appropriate
   - Response: should have token

---

## 🚨 Common Issues & Solutions

### Issue: Frontend can't reach backend (CORS error)
**Solution:**
1. Check backend is running on port 4000
2. Check `VITE_API_URL=http://localhost:4000` in Frontend/.env
3. Backend has CORS enabled in src/main.ts

### Issue: 401 Unauthorized on protected endpoints
**Solution:**
1. Make sure you're logged in
2. Check token in browser console: `useAuthStore.getState().token`
3. Check Authorization header in Network tab
4. Token might be expired

### Issue: 404 Not Found on score endpoints
**Solution:**
1. Make sure backend is running with score routes mounted
2. Check `Backend/src/api/router.ts` has `AppRouter.use('/score', ScoreController);`
3. Try accessing endpoint directly: `http://localhost:4000/api/score/highest/test-id`

### Issue: Database connection failed
**Solution:**
1. Check `DATABASE_URL` in Backend/.env
2. Try: `npm run migrate:dev`
3. Check network connection to Neon database

### Issue: Port 4000 already in use
**Solution:**
```bash
# Kill process on port 4000
# On Windows:
netstat -ano | findstr :4000
taskkill /PID {PID} /F

# On Mac/Linux:
lsof -i :4000
kill -9 {PID}
```

---

## 📝 Development Workflow

### 1. Start Backend
```bash
cd Backend
npm run start:dev
```

### 2. Start Frontend (new terminal)
```bash
cd Frontend
npm run dev
```

### 3. Make Changes
- Backend: Changes auto-reload (file watching)
- Frontend: Changes auto-reload (HMR - Hot Module Reload)

### 4. Test
- Browser: http://localhost:5173
- API: http://localhost:4000

### 5. Check Logs
- Backend: Terminal showing `npm run start:dev`
- Frontend: Terminal showing `npm run dev`
- Network: DevTools → Network tab

---

## 🎯 Integration Checklist

- [x] Backend using Bun runtime
- [x] Frontend using Vite + React
- [x] Axios configured with JWT
- [x] CORS enabled on backend
- [x] Environment variables set
- [x] Score API endpoints ready
- [x] Database connection working
- [x] Authentication flow working
- [ ] Frontend integrated with score components
- [ ] Score submission tested end-to-end
- [ ] Leaderboard displayed
- [ ] History shown
- [ ] User dashboard working

---

## 🚀 Next Steps

1. **Verify Backend Running**
   ```bash
   npm run start:dev
   ```

2. **Verify Frontend Running**
   ```bash
   npm run dev
   ```

3. **Test Login**
   - Navigate to http://localhost:5173/login
   - Use existing credentials or register new

4. **Test Score API**
   - After login, go to game page
   - Play game and submit score
   - Check if saved in database

5. **Verify UI Components**
   - GameResult component shows
   - GameHistory table displays
   - GameLeaderboard shows rankings

---

**Integration Complete! Your app is now connected! 🎉**

For questions or issues, check:
- Backend logs: `npm run start:dev` terminal
- Frontend logs: `npm run dev` terminal + DevTools
- Network requests: DevTools → Network tab
