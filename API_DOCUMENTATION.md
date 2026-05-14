# Health Tracker API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All endpoints return JSON responses with the following structure:
```json
{
  "message": "Operation successful",
  "data": {},
  "error": null
}
```

---

## Authentication Endpoints

### Register
- **Endpoint:** `POST /auth/register`
- **Auth Required:** No
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Login
- **Endpoint:** `POST /auth/login`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": { "id": "...", "email": "..." }
}
```

### Get Profile
- **Endpoint:** `GET /auth/profile`
- **Auth Required:** Yes
- **Response:**
```json
{
  "_id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "gender": "male",
  "height": 180,
  "targetWeight": 75,
  "dailyCalorieGoal": 2000,
  "dailyWaterGoal": 2000,
  "dailyStepsGoal": 10000
}
```

### Update Profile
- **Endpoint:** `PUT /auth/profile`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "name": "John Updated",
  "age": 31,
  "height": 182,
  "dailyCalorieGoal": 2200
}
```

### Change Password
- **Endpoint:** `POST /auth/change-password`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

### Forgot Password
- **Endpoint:** `POST /auth/forgot-password`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **Auth Required:** No
- **Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

---

## Workout Endpoints

### Create Workout
- **Endpoint:** `POST /workouts`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "type": "cardio",
  "duration": 30,
  "intensity": "moderate",
  "notes": "Morning run in the park"
}
```
- **Types:** cardio, strength, yoga, running

### Get Workouts
- **Endpoint:** `GET /workouts`
- **Auth Required:** Yes
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD

### Get Single Workout
- **Endpoint:** `GET /workouts/:id`
- **Auth Required:** Yes

### Update Workout
- **Endpoint:** `PUT /workouts/:id`
- **Auth Required:** Yes
- **Request Body:** Same as Create

### Delete Workout
- **Endpoint:** `DELETE /workouts/:id`
- **Auth Required:** Yes

### Get Weekly Analytics
- **Endpoint:** `GET /workouts/analytics/weekly`
- **Auth Required:** Yes
- **Response:**
```json
{
  "totalWorkouts": 4,
  "totalDuration": 120,
  "totalCalories": 500,
  "byType": {
    "cardio": { "count": 2, "calories": 300, "duration": 60 }
  }
}
```

---

## Meal Endpoints

### Create Meal
- **Endpoint:** `POST /meals`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "mealType": "breakfast",
  "foodName": "Oatmeal with berries",
  "calories": 350,
  "protein": 10,
  "carbs": 60,
  "fat": 5
}
```
- **Meal Types:** breakfast, lunch, dinner, snack

### Get Meals by Date
- **Endpoint:** `GET /meals/daily`
- **Auth Required:** Yes
- **Query Parameters:**
  - `date`: YYYY-MM-DD (optional, defaults to today)

### Get Meals by Date Range
- **Endpoint:** `GET /meals/range`
- **Auth Required:** Yes
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD (required)
  - `endDate`: YYYY-MM-DD (required)

### Get Daily Nutrition Summary
- **Endpoint:** `GET /meals/analytics/daily-summary`
- **Auth Required:** Yes
- **Query Parameters:**
  - `date`: YYYY-MM-DD (optional)
- **Response:**
```json
{
  "totalCalories": 2000,
  "totalProtein": 80,
  "totalCarbs": 250,
  "totalFat": 60,
  "meals": 3,
  "byMealType": {
    "breakfast": { "calories": 500, "protein": 20, ... }
  }
}
```

### Update Meal
- **Endpoint:** `PUT /meals/:id`
- **Auth Required:** Yes

### Delete Meal
- **Endpoint:** `DELETE /meals/:id`
- **Auth Required:** Yes

---

## Water Intake Endpoints

### Add Water
- **Endpoint:** `POST /water`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "amount": 250,
  "unit": "ml"
}
```

### Get Daily Intake
- **Endpoint:** `GET /water/daily`
- **Auth Required:** Yes
- **Query Parameters:**
  - `date`: YYYY-MM-DD (optional)
- **Response:**
```json
{
  "date": "2024-01-15",
  "totalAmount": 1500,
  "entries": 6,
  "entries_count": 6
}
```

### Get Intake by Date Range
- **Endpoint:** `GET /water/range`
- **Auth Required:** Yes
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD (required)
  - `endDate`: YYYY-MM-DD (required)

### Get Weekly Analytics
- **Endpoint:** `GET /water/analytics/weekly`
- **Auth Required:** Yes

### Delete Water Entry
- **Endpoint:** `DELETE /water/:id`
- **Auth Required:** Yes

---

## Sleep Endpoints

### Record Sleep
- **Endpoint:** `POST /sleep`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "startTime": "2024-01-15T22:30:00",
  "endTime": "2024-01-16T06:30:00",
  "quality": "good"
}
```
- **Quality:** poor, normal, good, excellent

### Get Sleep by Date
- **Endpoint:** `GET /sleep/date`
- **Auth Required:** Yes
- **Query Parameters:**
  - `date`: YYYY-MM-DD (optional)

### Get Sleep by Date Range
- **Endpoint:** `GET /sleep/range`
- **Auth Required:** Yes
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD (required)
  - `endDate`: YYYY-MM-DD (required)

### Update Sleep Record
- **Endpoint:** `PUT /sleep/:id`
- **Auth Required:** Yes

### Delete Sleep Record
- **Endpoint:** `DELETE /sleep/:id`
- **Auth Required:** Yes

### Get Weekly Analytics
- **Endpoint:** `GET /sleep/analytics/weekly`
- **Auth Required:** Yes

---

## Weight Endpoints

### Add Weight Record
- **Endpoint:** `POST /weight`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "weight": 75.5,
  "unit": "kg",
  "notes": "Morning measurement"
}
```

### Get Weight by Date Range
- **Endpoint:** `GET /weight/range`
- **Auth Required:** Yes
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD (required)
  - `endDate`: YYYY-MM-DD (required)

### Get Latest Weight
- **Endpoint:** `GET /weight/latest`
- **Auth Required:** Yes

### Get Weight Progress
- **Endpoint:** `GET /weight/analytics/progress`
- **Auth Required:** Yes
- **Response:**
```json
{
  "initialWeight": 80,
  "currentWeight": 75,
  "weightChange": -5,
  "totalRecords": 10,
  "progressTrend": "losing"
}
```

### Calculate BMI
- **Endpoint:** `POST /weight/calculate-bmi`
- **Auth Required:** No
- **Request Body:**
```json
{
  "weight": 75,
  "height": 180
}
```
- **Response:**
```json
{
  "bmi": 23.15,
  "category": "Normal weight"
}
```

### Update Weight Record
- **Endpoint:** `PUT /weight/:id`
- **Auth Required:** Yes

### Delete Weight Record
- **Endpoint:** `DELETE /weight/:id`
- **Auth Required:** Yes

---

## Activity Endpoints

### Create Activity
- **Endpoint:** `POST /activity`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "steps": 10000,
  "distance": 8.5,
  "activeMinutes": 45,
  "caloriesBurned": 350
}
```

### Get Daily Activity
- **Endpoint:** `GET /activity/daily`
- **Auth Required:** Yes
- **Query Parameters:**
  - `date`: YYYY-MM-DD (optional)

### Get Activity by Date Range
- **Endpoint:** `GET /activity/range`
- **Auth Required:** Yes
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD (required)
  - `endDate`: YYYY-MM-DD (required)

### Get Weekly Summary
- **Endpoint:** `GET /activity/analytics/weekly`
- **Auth Required:** Yes
- **Response:**
```json
{
  "totalSteps": 70000,
  "totalDistance": 60,
  "totalActiveMinutes": 315,
  "totalCalories": 2450,
  "avgDailySteps": 10000,
  "daysActive": 7
}
```

### Update Activity
- **Endpoint:** `PUT /activity/:id`
- **Auth Required:** Yes

### Delete Activity
- **Endpoint:** `DELETE /activity/:id`
- **Auth Required:** Yes

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

---

## Rate Limiting (Recommended for Production)
- Implement rate limiting: 100 requests per 15 minutes per user
- Use `express-rate-limit` package

## Pagination (for future enhancement)
- Implement pagination for list endpoints
- Use query parameters: `page`, `limit`

## Examples

### Example: Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","confirmPassword":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get Profile (using token from login)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer your-token-here"
```

### Example: Add Workout
```bash
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{"type":"cardio","duration":30,"intensity":"moderate"}'
```

---

## API Testing
Use Postman or similar tools to test API endpoints. Import the endpoints using this documentation.

## WebSocket Support (Future Enhancement)
- Real-time notifications
- Live analytics updates
- Instant reminders
