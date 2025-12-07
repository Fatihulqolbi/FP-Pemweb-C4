# Implementation Summary: Game Score System

## ✅ Apa yang Sudah Diimplementasikan

### 1. Database Schema
- ✅ Model `GameScores` ditambahkan ke Prisma schema
- ✅ Relasi dengan `Users` dan `Games` 
- ✅ Index untuk performa query (user_id + game_id, game_id + score)
- ✅ Migration sudah dijalankan: `20251206144724_add_game_scores`

**Struktur Tabel:**
```sql
GameScores {
  id: UUID (primary key)
  user_id: UUID (foreign key ke Users)
  game_id: UUID (foreign key ke Games)
  score: INT (nilai score)
  time_spent: INT? (waktu bermain dalam detik)
  game_data: JSON? (data tambahan dari game)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### 2. Backend API Endpoints

#### a) Submit Score
- **Route:** `POST /api/score/submit`
- **Auth:** Required (JWT token)
- **Function:** Simpan score player setelah bermain
- **Validasi:** 
  - Game harus ada di database
  - Game harus dalam status published

#### b) Get Highest Score
- **Route:** `GET /api/score/highest/:game_id`
- **Auth:** Required
- **Function:** Ambil highest score user untuk game tertentu

#### c) Get Game History
- **Route:** `GET /api/score/history/:game_id?limit=10`
- **Auth:** Required
- **Function:** Ambil riwayat scores (maksimal 10 default)

#### d) Get Leaderboard
- **Route:** `GET /api/score/leaderboard/:game_id?limit=10`
- **Auth:** Optional (public)
- **Function:** Top scores untuk game (ranking)

#### e) Get All User Scores
- **Route:** `GET /api/score/user/all-scores`
- **Auth:** Required
- **Function:** Summary scores semua game yang dimainkan user

### 3. Backend Files Struktur

```
Backend/
├── src/api/game/
│   ├── score.service.ts          (Business logic)
│   ├── score.controller.ts       (Route handlers)
│   └── schema/
│       ├── submit-score.schema.ts (Validator)
│       └── index.ts
├── prisma/
│   ├── schema.prisma             (Updated dengan GameScores)
│   └── migrations/
│       └── 20251206144724_add_game_scores/ (Migration)
├── src/api/router.ts             (Updated route mounting)
└── SCORE_API_DOCUMENTATION.md    (API docs)
```

### 4. Frontend Files

#### API Client
- **File:** `Frontend/src/api/score/index.ts`
- **Exports:** 
  - `ScoreAPI` class dengan 5 methods
  - TypeScript interfaces untuk type safety

#### UI Components
- **File:** `Frontend/src/components/ui/ScoreComponents.tsx`
- **Components:**
  1. `GameResult` - Tampilkan score & submit
  2. `GameHistory` - Tabel history scores
  3. `GameLeaderboard` - Top scores ranking
  4. `UserScoresDashboard` - User stats

### 5. Service Methods (ScoreService)

```typescript
- submitScore(userId, scoreData)           // Submit score baru
- getHighestScore(userId, gameId)          // Get highest score user
- getUserGameHistory(userId, gameId, limit) // Get history
- getGameLeaderboard(gameId, limit)        // Get leaderboard
- getUserAllScores(userId)                 // Get semua scores user
```

---

## 🚀 Cara Menggunakan

### Step 1: Setup Database
```bash
cd Backend
npx prisma migrate dev --name add_game_scores
```

### Step 2: Build & Run Backend
```bash
npm run build
npm run start
```

### Step 3: Frontend Integration

**Import component:**
```tsx
import {
  GameResult,
  GameHistory,
  GameLeaderboard,
  UserScoresDashboard,
} from '@/components/ui/ScoreComponents';
import ScoreAPI from '@/api/score';
```

**Usage pada game finish page:**
```tsx
export const GameFinishPage = ({ gameId, finalScore, timespent }) => {
  return (
    <div>
      <GameResult 
        gameId={gameId}
        score={finalScore}
        timeSpent={timespent}
      />
      <GameHistory gameId={gameId} />
      <GameLeaderboard gameId={gameId} />
    </div>
  );
};
```

**Usage untuk user profile:**
```tsx
export const ProfilePage = () => {
  return (
    <div>
      <h1>My Profile</h1>
      <UserScoresDashboard />
    </div>
  );
};
```

---

## 📊 Request/Response Examples

### Submit Score
```json
// REQUEST
POST /api/score/submit
{
  "game_id": "550e8400-e29b-41d4-a716-446655440000",
  "score": 150,
  "time_spent": 180,
  "game_data": {
    "correct_answers": 15,
    "total_questions": 20
  }
}

// RESPONSE (201)
{
  "statusCode": 201,
  "message": "Score submitted successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "game_id": "uuid",
    "score": 150,
    "time_spent": 180,
    "game_data": {...},
    "created_at": "2024-12-06T10:00:00Z",
    "updated_at": "2024-12-06T10:00:00Z"
  }
}
```

### Get Leaderboard
```json
// REQUEST
GET /api/score/leaderboard/{game_id}?limit=10

// RESPONSE (200)
{
  "statusCode": 200,
  "message": "Leaderboard retrieved successfully",
  "data": [
    {
      "user_id": "uuid",
      "username": "john_doe",
      "highest_score": 250,
      "total_plays": 5
    },
    {
      "user_id": "uuid",
      "username": "jane_smith",
      "highest_score": 200,
      "total_plays": 3
    }
  ]
}
```

---

## 🔍 Feature Details

### 1. Score Tracking
- ✅ Setiap game play tercatat dengan score
- ✅ Support untuk metadata (time_spent, game_data)
- ✅ Automatic timestamp (created_at, updated_at)

### 2. Highest Score
- ✅ Auto-calculated dari semua scores user per game
- ✅ Efisien dengan indexing

### 3. History
- ✅ Riwayat lengkap dengan pagination option
- ✅ Sorted by date (newest first)

### 4. Leaderboard
- ✅ Public endpoint (tidak perlu auth)
- ✅ Top X players untuk game
- ✅ Includes total plays per player

### 5. User Dashboard
- ✅ Summary scores semua game
- ✅ Last played date
- ✅ Total plays per game

---

## 🔐 Security & Validation

### Backend Validation
- ✅ JWT authentication untuk protected endpoints
- ✅ Zod schema validation untuk request body
- ✅ Game existence check sebelum submit score
- ✅ Only published games dapat menerima scores

### Data Validation
- ✅ Score harus non-negative integer
- ✅ Time spent harus non-negative
- ✅ Game ID harus valid UUID format

---

## 📈 Performance Optimization

### Database Indexes
```sql
-- Index untuk user scores queries
CREATE INDEX "GameScores_user_id_game_id_idx" ON "GameScores"("user_id", "game_id");

-- Index untuk leaderboard sorting
CREATE INDEX "GameScores_game_id_score_idx" ON "GameScores"("game_id", "score");
```

### Query Optimization
- ✅ Grouping untuk leaderboard calculations
- ✅ Limit queries untuk history
- ✅ Select only needed fields

---

## 🧪 Testing Endpoints

### Menggunakan Postman/Thunder Client

1. **Login & Get Token**
   - POST /api/auth/login
   - Copy JWT token

2. **Test Submit Score**
   - POST /api/score/submit
   - Header: Authorization: Bearer {token}
   - Body: JSON dengan game_id, score, time_spent

3. **Test Get Highest Score**
   - GET /api/score/highest/{game_id}
   - Header: Authorization: Bearer {token}

4. **Test Leaderboard** (tidak perlu token)
   - GET /api/score/leaderboard/{game_id}

5. **Test History**
   - GET /api/score/history/{game_id}
   - Header: Authorization: Bearer {token}

---

## ❓ FAQ

**Q: Bagaimana cara submit score dari frontend?**
```tsx
const submitGameScore = async () => {
  const response = await ScoreAPI.submitScore({
    game_id: currentGame.id,
    score: userScore,
    time_spent: gameDuration,
  });
  console.log(response);
};
```

**Q: Bagaimana menampilkan highest score user?**
```tsx
const highestScore = await ScoreAPI.getHighestScore(gameId);
console.log(highestScore.score);
```

**Q: Apakah leaderboard public?**
Ya, endpoint leaderboard tidak memerlukan authentication.

**Q: Bagaimana format game_data yang bisa disimpan?**
Bisa apa saja, contoh:
```json
{
  "correct_answers": 15,
  "total_questions": 20,
  "difficulty": "hard",
  "combo_streak": 5
}
```

---

## 📝 Next Steps (Optional)

Jika ingin tambah fitur:
- [ ] Achievements/badges berdasarkan score
- [ ] Social features (challenge friends)
- [ ] Score trends & analytics
- [ ] Daily/weekly leaderboard
- [ ] Score sharing
- [ ] Replay functionality

---

## 📞 Support

Jika ada error:
1. Check console backend logs
2. Verify JWT token is valid
3. Ensure game_id exists dan published
4. Check database migrations applied

**Dokumentasi lengkap:** `Backend/SCORE_API_DOCUMENTATION.md`
