# Game Score System - API Endpoints

## Overview
Sistem score untuk game yang menyimpan highest score dan history setiap pemain di setiap game yang dimainkan.

## Endpoints

### 1. Submit Score
**POST** `/api/score/submit`

Submit skor setelah selesai bermain game.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "game_id": "uuid",
  "score": 100,
  "time_spent": 120,
  "game_data": {
    "questions_correct": 8,
    "total_questions": 10
  }
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Score submitted successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "game_id": "uuid",
    "score": 100,
    "time_spent": 120,
    "game_data": {...},
    "created_at": "2024-12-06T10:00:00Z",
    "updated_at": "2024-12-06T10:00:00Z"
  }
}
```

---

### 2. Get Highest Score
**GET** `/api/score/highest/:game_id`

Dapatkan highest score user untuk game tertentu.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Highest score retrieved successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "game_id": "uuid",
    "score": 150,
    "time_spent": 180,
    "game_data": {...},
    "created_at": "2024-12-06T09:30:00Z",
    "updated_at": "2024-12-06T09:30:00Z"
  }
}
```

---

### 3. Get Game History
**GET** `/api/score/history/:game_id?limit=10`

Dapatkan riwayat scores user untuk game tertentu (default 10 records).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Jumlah record yang diambil (default: 10)

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Game history retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "game_id": "uuid",
      "score": 100,
      "time_spent": 120,
      "game_data": {...},
      "created_at": "2024-12-06T10:00:00Z",
      "updated_at": "2024-12-06T10:00:00Z"
    },
    {
      "id": "uuid",
      "user_id": "uuid",
      "game_id": "uuid",
      "score": 120,
      "time_spent": 110,
      "game_data": {...},
      "created_at": "2024-12-06T09:45:00Z",
      "updated_at": "2024-12-06T09:45:00Z"
    }
  ]
}
```

---

### 4. Get Game Leaderboard
**GET** `/api/score/leaderboard/:game_id?limit=10`

Dapatkan leaderboard top scores untuk game tertentu (public endpoint).

**Query Parameters:**
- `limit` (optional): Jumlah top players (default: 10)

**Response (200 OK):**
```json
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

### 5. Get All User Scores
**GET** `/api/score/user/all-scores`

Dapatkan summary scores user untuk semua game yang pernah dimainkan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "All user scores retrieved successfully",
  "data": [
    {
      "game_id": "uuid",
      "game_name": "Quiz Master",
      "highest_score": 150,
      "total_plays": 5,
      "last_played": "2024-12-06T10:00:00Z"
    },
    {
      "game_id": "uuid",
      "game_name": "Memory Game",
      "highest_score": 200,
      "total_plays": 3,
      "last_played": "2024-12-05T15:30:00Z"
    }
  ]
}
```

---

## Database Schema

### GameScores Model
```prisma
model GameScores {
  id        String   @id @default(uuid())
  user_id   String
  game_id   String
  score     Int
  time_spent Int?
  game_data Json?

  user      Users    @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
  game      Games    @relation(fields: [game_id], references: [id], onDelete: Cascade, onUpdate: Cascade)

  created_at DateTime @default(now())
  updated_at DateTime @default(now()) @updatedAt

  @@index([user_id, game_id])
  @@index([game_id, score])
}
```

---

## Implementation Steps

1. **Setup Database**
   ```bash
   cd Backend
   npx prisma migrate dev --name add_game_scores
   ```

2. **Build & Run Backend**
   ```bash
   npm run build
   npm run start
   ```

3. **Testing Endpoints**
   - Use Postman atau Thunder Client
   - Pastikan sudah login dan punya valid JWT token
   - Test setiap endpoint sesuai dokumentasi di atas

---

## Frontend Integration Example

```typescript
// Submit score setelah game selesai
const submitScore = async (gameId: string, score: number, timespent: number) => {
  const response = await fetch('/api/score/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      game_id: gameId,
      score: score,
      time_spent: timespent,
      game_data: {
        // optional: tambahan data dari game
      }
    })
  });
  return response.json();
};

// Get highest score
const getHighestScore = async (gameId: string) => {
  const response = await fetch(`/api/score/highest/${gameId}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  return response.json();
};

// Get game history
const getGameHistory = async (gameId: string, limit = 10) => {
  const response = await fetch(`/api/score/history/${gameId}?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  return response.json();
};

// Get leaderboard
const getLeaderboard = async (gameId: string, limit = 10) => {
  const response = await fetch(`/api/score/leaderboard/${gameId}?limit=${limit}`);
  return response.json();
};

// Get all scores
const getAllScores = async () => {
  const response = await fetch('/api/score/user/all-scores', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  return response.json();
};
```

---

## Error Handling

### 404 Not Found - Game tidak ditemukan
```json
{
  "statusCode": 404,
  "message": "Game not found"
}
```

### 403 Forbidden - Game belum dipublikasikan
```json
{
  "statusCode": 403,
  "message": "Cannot submit score for unpublished game"
}
```

### 401 Unauthorized - Token tidak valid
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
