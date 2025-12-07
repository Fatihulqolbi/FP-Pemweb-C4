# 🎮 Game Score System - Quick Start Guide

## Installation & Setup

### 1. Database Migration
```bash
cd Backend
npx prisma migrate dev --name add_game_scores
```

### 2. Build Backend
```bash
npm run build
npm run start
```

---

## 🚀 API Quick Reference

### Authentication
All endpoints except leaderboard require JWT token in headers:
```
Authorization: Bearer {your_jwt_token}
```

### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/score/submit` | Submit score setelah bermain | ✅ |
| GET | `/api/score/highest/:game_id` | Get highest score user | ✅ |
| GET | `/api/score/history/:game_id` | Get history scores (last 10) | ✅ |
| GET | `/api/score/leaderboard/:game_id` | Get top scores (public) | ❌ |
| GET | `/api/score/user/all-scores` | Get all user scores summary | ✅ |

---

## 💻 Frontend Usage

### Import API & Components
```typescript
import ScoreAPI from '@/api/score';
import {
  GameResult,
  GameHistory,
  GameLeaderboard,
  UserScoresDashboard,
} from '@/components/ui/ScoreComponents';
```

### Submit Score After Game
```typescript
// Setelah user selesai bermain
const result = await ScoreAPI.submitScore({
  game_id: "550e8400-e29b-41d4-a716-446655440000",
  score: 150,           // Required
  time_spent: 120,      // Optional (seconds)
  game_data: {          // Optional (any metadata)
    correct_answers: 15,
    total_questions: 20
  }
});
```

### Display Components
```tsx
// Game Result Page
<GameResult 
  gameId={gameId}
  score={userScore}
  timeSpent={duration}
/>

// History Tab
<GameHistory gameId={gameId} />

// Leaderboard
<GameLeaderboard gameId={gameId} />

// User Dashboard
<UserScoresDashboard />
```

---

## 📡 API Examples

### cURL Examples

**Submit Score:**
```bash
curl -X POST http://localhost:3000/api/score/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "550e8400-e29b-41d4-a716-446655440000",
    "score": 150,
    "time_spent": 120
  }'
```

**Get Highest Score:**
```bash
curl -X GET http://localhost:3000/api/score/highest/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Leaderboard:**
```bash
curl -X GET "http://localhost:3000/api/score/leaderboard/550e8400-e29b-41d4-a716-446655440000?limit=10"
```

---

## 📊 Typical User Flow

```
1. User Login ✅
   └─ Get JWT Token

2. User Bermain Game
   └─ Collect score + metadata

3. Game Finish
   └─ ScoreAPI.submitScore() ✅
   └─ Display <GameResult />

4. View History/Leaderboard
   └─ <GameHistory /> ✅
   └─ <GameLeaderboard /> ✅

5. Profile Page
   └─ <UserScoresDashboard /> ✅
```

---

## 🗂️ File Structure

```
Backend/
├── src/api/game/
│   ├── score.service.ts       ← Business logic
│   ├── score.controller.ts    ← Route handlers
│   └── schema/
│       └── submit-score.schema.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── 20251206144724_add_game_scores/

Frontend/
├── src/api/score/
│   └── index.ts               ← API client
└── src/components/ui/
    └── ScoreComponents.tsx    ← UI components
```

---

## ✅ Features

- ✅ Score submission & tracking
- ✅ Highest score per user per game
- ✅ Complete score history
- ✅ Public leaderboard
- ✅ User statistics dashboard
- ✅ JWT authentication
- ✅ Input validation
- ✅ Optimized database queries
- ✅ TypeScript support
- ✅ Error handling

---

## 🔍 Database Schema

```sql
CREATE TABLE "GameScores" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "time_spent" INTEGER,
    "game_data" JSONB,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("user_id") REFERENCES "Users"("id"),
    FOREIGN KEY ("game_id") REFERENCES "Games"("id")
);

CREATE INDEX "GameScores_user_id_game_id_idx" 
  ON "GameScores"("user_id", "game_id");
CREATE INDEX "GameScores_game_id_score_idx" 
  ON "GameScores"("game_id", "score");
```

---

## 🧪 Testing

### Test dengan Postman/Thunder Client

1. Get Auth Token:
   ```
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password"
   }
   ```

2. Copy token dari response

3. Submit Score:
   ```
   POST /api/score/submit
   Headers: Authorization: Bearer {token}
   {
     "game_id": "xxx",
     "score": 100
   }
   ```

4. Get Highest Score:
   ```
   GET /api/score/highest/xxx
   Headers: Authorization: Bearer {token}
   ```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Migration failed | `npx prisma migrate reset` (hati-hati, reset DB!) |
| 401 Unauthorized | Check JWT token validity & expiration |
| 404 Game not found | Verify game_id exists & is published |
| 403 Forbidden | Game must be published to accept scores |
| Type errors | Ensure TypeScript interfaces match payload |

---

## 📚 Documentation

- Full API docs: `Backend/SCORE_API_DOCUMENTATION.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- TypeScript interfaces: `Frontend/src/api/score/index.ts`

---

## 💡 Tips

- 🔹 Always include `Authorization` header for protected endpoints
- 🔹 Use query parameter `?limit=N` to paginate history
- 🔹 Leaderboard endpoint is public (no auth needed)
- 🔹 `game_data` field supports any JSON structure
- 🔹 Scores are immutable (cannot edit after submit)
- 🔹 Use `created_at` for sorting, `updated_at` for tracking changes

---

## 🎯 Next Steps

1. ✅ Complete Database Setup
2. ✅ Build & Run Backend
3. ✅ Test endpoints with Postman
4. ✅ Integrate ScoreAPI in Game Component
5. ✅ Display Score Results
6. ✅ Show History & Leaderboard
7. ✅ Add to User Profile

---

**Happy Gaming! 🎮**
