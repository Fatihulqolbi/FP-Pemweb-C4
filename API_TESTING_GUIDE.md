# 📌 API Endpoints Testing Guide

## Base URL
```
http://localhost:3000/api
```

## Authentication
Token format:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 1️⃣ Submit Score
**Endpoint:** `POST /score/submit`

**Purpose:** Simpan score setelah user selesai bermain game

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body
```json
{
  "game_id": "550e8400-e29b-41d4-a716-446655440000",
  "score": 150,
  "time_spent": 120,
  "game_data": {
    "level": 5,
    "difficulty": "hard",
    "combo": 10
  }
}
```

### Response (201 Created)
```json
{
  "statusCode": 201,
  "message": "Score submitted successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "game_id": "550e8400-e29b-41d4-a716-446655440000",
    "score": 150,
    "time_spent": 120,
    "game_data": {
      "level": 5,
      "difficulty": "hard",
      "combo": 10
    },
    "created_at": "2024-12-06T10:00:00.000Z",
    "updated_at": "2024-12-06T10:00:00.000Z"
  }
}
```

### Error Cases
- **400 Bad Request** - Invalid input (score negatif, gameId bukan UUID)
- **401 Unauthorized** - Token tidak valid
- **404 Not Found** - Game tidak ada
- **403 Forbidden** - Game belum dipublikasikan

---

## 2️⃣ Get Highest Score
**Endpoint:** `GET /score/highest/:game_id`

**Purpose:** Ambil highest score user untuk game tertentu

### Headers
```
Authorization: Bearer {token}
```

### URL Parameters
```
game_id: 550e8400-e29b-41d4-a716-446655440000
```

### Response (200 OK)
```json
{
  "statusCode": 200,
  "message": "Highest score retrieved successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "game_id": "550e8400-e29b-41d4-a716-446655440000",
    "score": 250,
    "time_spent": 95,
    "game_data": {
      "level": 10,
      "difficulty": "extreme"
    },
    "created_at": "2024-12-05T14:30:00.000Z",
    "updated_at": "2024-12-05T14:30:00.000Z"
  }
}
```

### Jika tidak ada score
```json
{
  "statusCode": 200,
  "message": "Highest score retrieved successfully",
  "data": {
    "score": 0
  }
}
```

---

## 3️⃣ Get Game History
**Endpoint:** `GET /score/history/:game_id`

**Purpose:** Ambil riwayat scores user untuk game (sorted by date desc)

### Headers
```
Authorization: Bearer {token}
```

### URL Parameters
```
game_id: 550e8400-e29b-41d4-a716-446655440000
```

### Query Parameters (Optional)
```
limit: 10  (default: 10, max: 50)
```

### Full URL Example
```
GET /score/history/550e8400-e29b-41d4-a716-446655440000?limit=20
```

### Response (200 OK)
```json
{
  "statusCode": 200,
  "message": "Game history retrieved successfully",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "game_id": "550e8400-e29b-41d4-a716-446655440000",
      "score": 250,
      "time_spent": 95,
      "game_data": { "level": 10 },
      "created_at": "2024-12-06T10:00:00.000Z",
      "updated_at": "2024-12-06T10:00:00.000Z"
    },
    {
      "id": "g57bd20c-69dd-4483-b678-1f13c3d4e580",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "game_id": "550e8400-e29b-41d4-a716-446655440000",
      "score": 200,
      "time_spent": 110,
      "game_data": { "level": 8 },
      "created_at": "2024-12-05T15:45:00.000Z",
      "updated_at": "2024-12-05T15:45:00.000Z"
    }
  ]
}
```

---

## 4️⃣ Get Leaderboard
**Endpoint:** `GET /score/leaderboard/:game_id`

**Purpose:** Ambil top scores players (PUBLIC - tidak perlu auth)

### URL Parameters
```
game_id: 550e8400-e29b-41d4-a716-446655440000
```

### Query Parameters (Optional)
```
limit: 10  (default: 10)
```

### Full URL Example
```
GET /score/leaderboard/550e8400-e29b-41d4-a716-446655440000?limit=15
```

### Response (200 OK)
```json
{
  "statusCode": 200,
  "message": "Leaderboard retrieved successfully",
  "data": [
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "username": "john_pro",
      "highest_score": 500,
      "total_plays": 12
    },
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440002",
      "username": "jane_master",
      "highest_score": 480,
      "total_plays": 8
    },
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440003",
      "username": "alex_expert",
      "highest_score": 450,
      "total_plays": 15
    }
  ]
}
```

---

## 5️⃣ Get All User Scores
**Endpoint:** `GET /score/user/all-scores`

**Purpose:** Ambil summary scores user untuk semua game yang pernah dimainkan

### Headers
```
Authorization: Bearer {token}
```

### Response (200 OK)
```json
{
  "statusCode": 200,
  "message": "All user scores retrieved successfully",
  "data": [
    {
      "game_id": "550e8400-e29b-41d4-a716-446655440000",
      "game_name": "Quiz Master",
      "highest_score": 250,
      "total_plays": 5,
      "last_played": "2024-12-06T10:00:00.000Z"
    },
    {
      "game_id": "550e8400-e29b-41d4-a716-446655440010",
      "game_name": "Memory Game",
      "highest_score": 180,
      "total_plays": 3,
      "last_played": "2024-12-05T14:30:00.000Z"
    },
    {
      "game_id": "550e8400-e29b-41d4-a716-446655440020",
      "game_name": "Puzzle Master",
      "highest_score": 320,
      "total_plays": 8,
      "last_played": "2024-12-04T09:15:00.000Z"
    }
  ]
}
```

---

## 🧪 Testing dengan cURL

### Submit Score
```bash
curl -X POST http://localhost:3000/api/score/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "550e8400-e29b-41d4-a716-446655440000",
    "score": 150,
    "time_spent": 120
  }'
```

### Get Highest Score
```bash
curl -X GET http://localhost:3000/api/score/highest/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get History
```bash
curl -X GET "http://localhost:3000/api/score/history/550e8400-e29b-41d4-a716-446655440000?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Leaderboard (Public)
```bash
curl -X GET "http://localhost:3000/api/score/leaderboard/550e8400-e29b-41d4-a716-446655440000?limit=10"
```

### Get All Scores
```bash
curl -X GET http://localhost:3000/api/score/user/all-scores \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔴 Error Responses

### 400 - Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid input",
  "errors": {
    "score": ["Score must be non-negative"]
  }
}
```

### 401 - Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized - Invalid token"
}
```

### 403 - Forbidden
```json
{
  "statusCode": 403,
  "message": "Cannot submit score for unpublished game"
}
```

### 404 - Not Found
```json
{
  "statusCode": 404,
  "message": "Game not found"
}
```

### 500 - Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 📊 Testing Workflow

### 1. Get Auth Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'
```
Save token dari response.

### 2. Get Game ID
```bash
curl -X GET http://localhost:3000/api/game \
  -H "Authorization: Bearer {token}"
```
Copy published game's ID.

### 3. Submit Score
```bash
curl -X POST http://localhost:3000/api/score/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "{game_id}",
    "score": 100
  }'
```

### 4. Get Highest Score
```bash
curl -X GET http://localhost:3000/api/score/highest/{game_id} \
  -H "Authorization: Bearer {token}"
```

### 5. Check Leaderboard
```bash
curl -X GET http://localhost:3000/api/score/leaderboard/{game_id}
```

### 6. Get History
```bash
curl -X GET http://localhost:3000/api/score/history/{game_id} \
  -H "Authorization: Bearer {token}"
```

---

## 💾 Postman Collection Template

Import ke Postman:

```json
{
  "info": {
    "name": "Game Score API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Submit Score",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"game_id\": \"550e8400-e29b-41d4-a716-446655440000\", \"score\": 150}"
        },
        "url": {
          "raw": "{{baseUrl}}/score/submit",
          "host": ["{{baseUrl}}"],
          "path": ["score", "submit"]
        }
      }
    }
  ]
}
```

---

## ✅ Checklist Implementasi

- [ ] Database migration berhasil
- [ ] Backend compile tanpa error
- [ ] Test login & get token
- [ ] Test submit score
- [ ] Test get highest score
- [ ] Test get history
- [ ] Test leaderboard (public)
- [ ] Test all scores (protected)
- [ ] Frontend API client terintegrasi
- [ ] UI components tampil dengan benar
- [ ] Score submit dari game berfungsi
- [ ] History & leaderboard terupdate

---

## 🆘 Debugging Tips

1. **Check Backend Logs:**
   ```bash
   npm run start
   ```
   Lihat error di console

2. **Verify JWT Token:**
   - Copy token dari login response
   - Paste ke https://jwt.io untuk decode

3. **Check Database:**
   ```bash
   npx prisma studio
   ```
   Lihat GameScores table

4. **Network Tab Browser:**
   - Open DevTools (F12)
   - Network tab
   - Lihat request/response details

5. **Test dengan Postman:**
   - Create new request
   - Set method, URL, headers
   - Send & check response

---

**Happy Testing! 🚀**
