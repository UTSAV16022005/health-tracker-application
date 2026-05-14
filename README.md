# Health Tracker Application

A comprehensive full-stack web application for tracking health metrics, workouts, nutrition, and daily activities. Built with React, Express.js, and MongoDB.

## Features

### 1. User Authentication
- User registration and signup
- Login/logout functionality
- JWT authentication
- Secure password hashing with bcryptjs
- Forgot/reset password functionality
- Profile management

### 2. Dashboard
- Daily health summary
- Calories consumed/burned tracking
- Water intake tracker
- Sleep tracking
- Step counter
- Weight/BMI display
- Progress overview

### 3. Workout Tracking
- Log workouts with categories (Cardio, Strength, Yoga, Running)
- Duration tracking
- Automatic calorie burned calculation
- Workout history
- Weekly/monthly analytics

### 4. Diet & Nutrition Tracking
- Meal logging (Breakfast, Lunch, Dinner, Snacks)
- Calorie counter
- Macronutrient tracking (Protein, Carbs, Fat)
- Daily nutrition goals
- Nutritional analytics

### 5. Water Intake Tracker
- Add daily water intake
- Goal setting
- Progress indicator
- Quick add buttons (250ml, 500ml, 750ml, 1L)

### 6. Sleep Tracking
- Record sleep start/end times
- Sleep duration analysis
- Sleep quality tracking
- Weekly sleep reports

### 7. BMI & Weight Management
- BMI calculator
- Weight history tracking
- Goal weight tracking
- Progress charts

### 8. Activity Tracking
- Daily steps tracking
- Distance walked
- Active minutes
- Calories burned tracking

### 9. Reports & Analytics
- Weekly/monthly reports
- Graphs using Recharts
- Health trends visualization
- Progress analytics

## Tech Stack

### Frontend
- React 19
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- Date-fns for date handling
- Lucide React for icons

### Backend
- Node.js & Express.js
- MongoDB with MongoDB Atlas
- JWT for authentication
- Bcryptjs for password security
- Validator for input validation
- Nodemailer for email notifications

### Database
- MongoDB (Cloud: MongoDB Atlas)
- Collections: users, workouts, meals, water_intake, sleep, weight, activity

## Project Structure

```
health-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Workout.js
│   │   ├── Meal.js
│   │   ├── WaterIntake.js
│   │   ├── Sleep.js
│   │   ├── Weight.js
│   │   └── Activity.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── workoutController.js
│   │   ├── mealController.js
│   │   ├── waterController.js
│   │   ├── sleepController.js
│   │   ├── weightController.js
│   │   └── activityController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── mealRoutes.js
│   │   ├── waterRoutes.js
│   │   ├── sleepRoutes.js
│   │   ├── weightRoutes.js
│   │   └── activityRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── connect.js
│   ├── package.json
│   └── config.env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Workouts.jsx
    │   │   ├── Meals.jsx
    │   │   ├── Water.jsx
    │   │   ├── Sleep.jsx
    │   │   ├── Weight.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── auth.css
    │   │   ├── navbar.css
    │   │   ├── dashboard.css
    │   │   ├── features.css
    │   │   └── profile.css
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── App.css
    ├── package.json
    ├── .env.local
    └── vite.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create/Update `config.env` with your MongoDB Atlas URI:
```
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create/Update `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `POST /api/auth/change-password` - Change password (Protected)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Workouts
- `POST /api/workouts` - Create workout (Protected)
- `GET /api/workouts` - Get user workouts (Protected)
- `GET /api/workouts/:id` - Get single workout (Protected)
- `PUT /api/workouts/:id` - Update workout (Protected)
- `DELETE /api/workouts/:id` - Delete workout (Protected)
- `GET /api/workouts/analytics/weekly` - Weekly analytics (Protected)

### Meals
- `POST /api/meals` - Create meal (Protected)
- `GET /api/meals/daily` - Get meals by date (Protected)
- `GET /api/meals/range` - Get meals by date range (Protected)
- `GET /api/meals/analytics/daily-summary` - Daily summary (Protected)
- `GET /api/meals/analytics/weekly` - Weekly analytics (Protected)
- `PUT /api/meals/:id` - Update meal (Protected)
- `DELETE /api/meals/:id` - Delete meal (Protected)

### Water
- `POST /api/water` - Add water intake (Protected)
- `GET /api/water/daily` - Get daily intake (Protected)
- `GET /api/water/range` - Get intake by date range (Protected)
- `GET /api/water/analytics/weekly` - Weekly analytics (Protected)
- `DELETE /api/water/:id` - Delete entry (Protected)

### Sleep
- `POST /api/sleep` - Record sleep (Protected)
- `GET /api/sleep/date` - Get sleep by date (Protected)
- `GET /api/sleep/range` - Get sleep by date range (Protected)
- `GET /api/sleep/analytics/weekly` - Weekly analytics (Protected)
- `PUT /api/sleep/:id` - Update sleep record (Protected)
- `DELETE /api/sleep/:id` - Delete sleep record (Protected)

### Weight
- `POST /api/weight` - Add weight record (Protected)
- `GET /api/weight/latest` - Get latest weight (Protected)
- `GET /api/weight/range` - Get weight by date range (Protected)
- `GET /api/weight/analytics/progress` - Weight progress (Protected)
- `POST /api/weight/calculate-bmi` - Calculate BMI
- `PUT /api/weight/:id` - Update weight record (Protected)
- `DELETE /api/weight/:id` - Delete weight record (Protected)

### Activity
- `POST /api/activity` - Create activity record (Protected)
- `GET /api/activity/daily` - Get daily activity (Protected)
- `GET /api/activity/range` - Get activity by date range (Protected)
- `GET /api/activity/analytics/weekly` - Weekly summary (Protected)
- `PUT /api/activity/:id` - Update activity (Protected)
- `DELETE /api/activity/:id` - Delete activity (Protected)

## Usage

### Register & Login
1. Visit `http://localhost:5173`
2. Click "Register" and create a new account
3. Fill in your personal information
4. Login with your credentials

### Log Health Data
- Navigate to Dashboard
- Use the action buttons to log:
  - Workouts
  - Meals
  - Water intake
  - Sleep
  - Weight

### View Analytics
- All pages show recent entries
- Dashboard shows daily summary
- Analytics available for each tracker

### Update Profile
- Go to Profile page
- Update personal information
- Set daily goals
- Save changes

## Deployment

### Backend Deployment (Heroku)

1. Create Heroku account and install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create app-name`
4. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-secret-key
```
5. Deploy: `git push heroku main`

### Frontend Deployment (Vercel)

1. Create Vercel account
2. Import repository from GitHub
3. Set environment variable: `VITE_API_URL=https://your-backend-url/api`
4. Deploy automatically on push

## Future Enhancements

- [ ] Social features (friend system, leaderboards)
- [ ] AI health suggestions and recommendations
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Social media integration
- [ ] Admin dashboard
- [ ] Advanced analytics and reports
- [ ] Export data to PDF
- [ ] Integration with fitness wearables
- [ ] Real-time notifications

## Security

- Passwords are hashed with bcryptjs
- JWT tokens for authentication
- Protected routes on frontend and backend
- Input validation on both frontend and backend
- Environment variables for sensitive data
- CORS configuration for API security

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
1. Check existing issues on GitHub
2. Create new issue with detailed description
3. Include error messages and screenshots

## Changelog

### Version 1.0.0 (Initial Release)
- Complete user authentication system
- Workout tracking with analytics
- Meal and nutrition tracking
- Water intake tracker
- Sleep tracking
- Weight and BMI management
- Activity tracking
- Dashboard with daily summary
- User profile management
- Weekly analytics for all trackers
