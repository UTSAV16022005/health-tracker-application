import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth Service
export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.post('/auth/change-password', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data)
};

// Workout Service
export const workoutService = {
    create: (data) => api.post('/workouts', data),
    getWorkouts: (params) => api.get('/workouts', { params }),
    getWorkout: (id) => api.get(`/workouts/${id}`),
    update: (id, data) => api.put(`/workouts/${id}`, data),
    delete: (id) => api.delete(`/workouts/${id}`),
    getWeeklyAnalytics: () => api.get('/workouts/analytics/weekly')
};

// Meal Service
export const mealService = {
    create: (data) => api.post('/meals', data),
    calculateNutrition: (data) => api.post('/meals/calculate/nutrition', data),
    getMealsByDate: (date) => api.get('/meals/daily', { params: { date } }),
    getMealsByDateRange: (startDate, endDate) => 
        api.get('/meals/range', { params: { startDate, endDate } }),
    update: (id, data) => api.put(`/meals/${id}`, data),
    delete: (id) => api.delete(`/meals/${id}`),
    getDailySummary: (date) => api.get('/meals/analytics/daily-summary', { params: { date } }),
    getWeeklyAnalytics: () => api.get('/meals/analytics/weekly')
};

// Water Service
export const waterService = {
    addWater: (data) => api.post('/water', data),
    getDailyIntake: (date) => api.get('/water/daily', { params: { date } }),
    getIntakeByDateRange: (startDate, endDate) => 
        api.get('/water/range', { params: { startDate, endDate } }),
    deleteEntry: (id) => api.delete(`/water/${id}`),
    getWeeklyAnalytics: () => api.get('/water/analytics/weekly')
};

// Sleep Service
export const sleepService = {
    recordSleep: (data) => api.post('/sleep', data),
    getSleepByDate: (date) => api.get('/sleep/date', { params: { date } }),
    getSleepByDateRange: (startDate, endDate) => 
        api.get('/sleep/range', { params: { startDate, endDate } }),
    updateSleep: (id, data) => api.put(`/sleep/${id}`, data),
    deleteSleep: (id) => api.delete(`/sleep/${id}`),
    getWeeklyAnalytics: () => api.get('/sleep/analytics/weekly')
};

// Weight Service
export const weightService = {
    addWeight: (data) => api.post('/weight', data),
    getLatestWeight: () => api.get('/weight/latest'),
    getWeightByDateRange: (startDate, endDate) => 
        api.get('/weight/range', { params: { startDate, endDate } }),
    updateWeight: (id, data) => api.put(`/weight/${id}`, data),
    deleteWeight: (id) => api.delete(`/weight/${id}`),
    getProgress: () => api.get('/weight/analytics/progress'),
    calculateBMI: (weight, height) => api.post('/weight/calculate-bmi', { weight, height })
};

// Activity Service
export const activityService = {
    create: (data) => api.post('/activity', data),
    getDailyActivity: (date) => api.get('/activity/daily', { params: { date } }),
    getActivityByDateRange: (startDate, endDate) => 
        api.get('/activity/range', { params: { startDate, endDate } }),
    updateActivity: (id, data) => api.put(`/activity/${id}`, data),
    deleteActivity: (id) => api.delete(`/activity/${id}`),
    getWeeklySummary: () => api.get('/activity/analytics/weekly')
};

export default api;
