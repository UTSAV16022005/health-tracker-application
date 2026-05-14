# Health Tracker - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Prerequisites
- ✅ Node.js v14+ installed
- ✅ MongoDB Atlas account (free at mongodb.com)
- ✅ Code editor (VS Code recommended)

### Step 2: Clone & Setup

#### Windows Users:
```batch
setup.bat
```

#### macOS/Linux Users:
```bash
chmod +x setup.sh
./setup.sh
```

#### Manual Setup:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 3: Configure MongoDB

1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `backend/config.env`:

```env
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/health-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-here
PORT=3000
```

### Step 4: Start the Application

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Server runs at: `http://localhost:3000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
App runs at: `http://localhost:5173`

### Step 5: Access the Application

1. Open browser: `http://localhost:5173`
2. Click "Register" to create account
3. Start tracking your health!

---

## 📋 Features Quick Reference

### Dashboard
- View daily health summary
- See all your metrics at a glance
- Quick access buttons for adding data

### 💪 Workouts
- Log cardio, strength, yoga, or running
- Automatic calorie calculation
- Weekly analytics

### 🍽️ Meals
- Track breakfast, lunch, dinner, snacks
- Monitor calories and macronutrients
- Daily nutrition summary

### 💧 Water
- Log water intake
- Track daily goal progress
- Quick add buttons (250ml, 500ml, 750ml, 1L)

### 😴 Sleep
- Record sleep start and end times
- Track sleep quality
- Weekly sleep analytics

### ⚖️ Weight & BMI
- Track weight changes
- Calculate and monitor BMI
- View progress charts

### 👤 Profile
- Update personal information
- Set daily health goals
- Customize targets

---

## 🔧 Common Tasks

### Reset Password
1. On login page, click "Forgot password?"
2. Enter your email
3. Use the reset token provided
4. Set new password

### Change Daily Goals
1. Go to Profile page
2. Update calorie, water, or steps goals
3. Click "Update Profile"

### View Weekly Analytics
- Available on each tracker page
- Shows trends and patterns
- Helps identify progress

### Export Data
- All data stored in MongoDB
- API endpoints available for integration
- Can build export feature if needed

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
# Kill process and restart
npm run dev
```

### MongoDB connection error
- Verify MongoDB Atlas URI in config.env
- Check if IP is whitelisted in MongoDB Atlas
- Verify network is active

### Frontend won't load
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port already in use
```bash
# Kill process on port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change PORT in config.env
```

---

## 📚 Documentation Files

- `README.md` - Full project documentation
- `API_DOCUMENTATION.md` - Complete API reference
- `DEPLOYMENT.md` - Production deployment guide

---

## 🚢 Deployment Quick Links

### Free Hosting Options
- **Backend:** Heroku, Railway.app, Render.com
- **Frontend:** Vercel.com, Netlify.com
- **Database:** MongoDB Atlas (free tier available)

### Simple Heroku Deployment
```bash
# Backend
cd backend
git push heroku main
```

### Simple Vercel Deployment
1. Push frontend to GitHub
2. Connect repository to Vercel
3. Deploy automatically

---

## 💡 Pro Tips

1. **Regular Backups:** MongoDB Atlas auto-backups
2. **Mobile Friendly:** Works great on phones
3. **Share Progress:** Screenshots of dashboard
4. **Set Reminders:** Use phone calendar
5. **Track Trends:** Check analytics weekly

---

## 🤝 Need Help?

1. Check documentation files
2. Review API examples
3. Check browser console for errors
4. Verify environment variables
5. Check MongoDB Atlas connection

---

## 🎯 Next Steps

- [ ] Complete user profile setup
- [ ] Log your first workout
- [ ] Track meals for a day
- [ ] Monitor sleep schedule
- [ ] Check weekly analytics
- [ ] Deploy to production
- [ ] Invite friends to use the app

---

## 📞 Support

For issues:
1. Check existing documentation
2. Review error messages carefully
3. Verify all configuration
4. Check network connectivity
5. Restart services

---

## 🎉 You're All Set!

Start tracking your health and achieving your fitness goals with Health Tracker!

**Happy Tracking! 💪**
