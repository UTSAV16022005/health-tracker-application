# Health Tracker - Deployment Guide

## Prerequisites
- Node.js & npm installed
- MongoDB Atlas account
- Git repository setup
- Hosting account (Heroku, Vercel, AWS, etc.)

## Step 1: Prepare Backend for Production

### 1.1 Environment Setup
Create production `.env` file:
```
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/health-tracker?retryWrites=true&w=majority
JWT_SECRET=generate-a-strong-random-secret-key
PORT=5000
NODE_ENV=production
```

### 1.2 Install Production Dependencies
```bash
cd backend
npm install --production
```

### 1.3 Add Production Build Script to package.json
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "prod": "NODE_ENV=production node server.js"
}
```

### 1.4 Create Procfile (for Heroku)
```
web: npm start
```

## Step 2: Prepare Frontend for Production

### 2.1 Environment Setup
Create `.env.production`:
```
VITE_API_URL=https://your-backend-domain.com/api
```

### 2.2 Build Frontend
```bash
cd frontend
npm run build
```

This creates optimized production build in `dist/` folder.

### 2.3 Verify Build
```bash
npm run preview
```

## Step 3: Deploy Backend

### Option A: Deploy to Heroku

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create Heroku app:
```bash
heroku create health-tracker-api
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set ATLAS_URI=your-mongodb-uri
```

4. Deploy:
```bash
git push heroku main
```

5. View logs:
```bash
heroku logs --tail
```

### Option B: Deploy to AWS EC2

1. SSH into your instance:
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

2. Install Node.js:
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs
```

3. Clone and setup:
```bash
git clone your-repo
cd health-tracker/backend
npm install
```

4. Start with PM2:
```bash
npm install -g pm2
pm2 start server.js --name "health-tracker-api"
pm2 startup
pm2 save
```

5. Setup Nginx reverse proxy (optional but recommended)

### Option C: Deploy to DigitalOcean

1. Create Droplet and SSH in
2. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Clone repository and deploy similar to AWS

## Step 4: Deploy Frontend

### Option A: Deploy to Vercel

1. Push code to GitHub
2. Go to vercel.com and import repository
3. Set environment variables:
   - `VITE_API_URL=your-backend-url/api`
4. Deploy (automatic on push)

### Option B: Deploy to Netlify

1. Build frontend:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable: `VITE_API_URL`

### Option C: Deploy to AWS S3 + CloudFront

1. Build frontend:
```bash
npm run build
```

2. Create S3 bucket and upload `dist` folder

3. Create CloudFront distribution

4. Set environment variables in build

### Option D: Deploy to DigitalOcean App Platform

1. Connect GitHub repository
2. Select build commands
3. Configure environment variables
4. Deploy

## Step 5: Database Optimization

### Create Indexes in MongoDB
```javascript
// In MongoDB Atlas or via code
db.users.createIndex({ email: 1 }, { unique: true })
db.workouts.createIndex({ userId: 1, date: -1 })
db.meals.createIndex({ userId: 1, date: -1 })
db.water_intake.createIndex({ userId: 1, timestamp: -1 })
db.sleep.createIndex({ userId: 1, date: -1 })
db.weight.createIndex({ userId: 1, date: -1 })
db.activity.createIndex({ userId: 1, date: -1 })
```

## Step 6: CORS Configuration

Update backend `server.js` for production:
```javascript
const cors = require('cors');

app.use(cors({
    origin: ['https://your-frontend-domain.com'],
    credentials: true
}));
```

## Step 7: SSL/HTTPS Setup

- Use Let's Encrypt for free SSL certificates
- Configure HTTPS on your server
- Update frontend API URLs to use HTTPS

## Step 8: Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Remove debug logs in production
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on API
- [ ] Implement CSRF protection
- [ ] Add input validation and sanitization
- [ ] Keep dependencies updated

## Step 9: Monitoring & Logging

### Setup Logging
```javascript
// Add Morgan for HTTP logging
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Monitor with Services
- Sentry for error tracking
- Loggly for log management
- New Relic for performance monitoring

## Step 10: Backup Strategy

### MongoDB Atlas Backups
- Enable automated daily backups
- Set retention to 30 days
- Test restore procedures

## Domain Setup

1. Purchase domain from registrar
2. Point DNS to your hosting service
3. Configure SSL certificate
4. Test connection

## Performance Optimization

1. **Frontend:**
   - Enable gzip compression
   - Minimize bundle size
   - Use CDN for static assets
   - Implement service workers for offline support

2. **Backend:**
   - Enable caching headers
   - Use pagination for large datasets
   - Implement database indexing
   - Use compression middleware

## Health Checks

Create health check endpoint:
```javascript
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});
```

Configure monitoring to check this endpoint

## Post-Deployment Verification

- [ ] Test user registration
- [ ] Test login/authentication
- [ ] Verify all API endpoints
- [ ] Check database connectivity
- [ ] Test payment processing (if applicable)
- [ ] Verify email notifications
- [ ] Check error handling
- [ ] Test with different browsers
- [ ] Verify mobile responsiveness
- [ ] Check performance metrics

## Troubleshooting

### Backend Issues
- Check server logs: `heroku logs --tail`
- Verify MongoDB connection
- Check environment variables
- Review API error responses

### Frontend Issues
- Check browser console
- Verify API URL configuration
- Check network tab for API calls
- Review Vercel deployment logs

## Scaling Strategies

1. **Database:** Consider sharding if data grows
2. **Server:** Use load balancing for multiple instances
3. **CDN:** Distribute static content globally
4. **Caching:** Implement Redis for session/data caching

## Maintenance

- Regular backups
- Dependency updates
- Security patches
- Performance monitoring
- User feedback collection
