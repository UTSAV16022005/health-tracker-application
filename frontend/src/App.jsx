import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Meals from './pages/Meals';
import Water from './pages/Water';
import Sleep from './pages/Sleep';
import Weight from './pages/Weight';
import Profile from './pages/Profile';

// Inner layout that can read the current route
function AppLayout() {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    if (isAuthPage) {
        // Auth pages: fullscreen, no sidebar
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        );
    }

    // App pages: sidebar + main content
    return (
        <div className="h-[100dvh] bg-background flex flex-col md:flex-row w-full overflow-hidden">
            <Navbar />
            <main className="flex-1 w-full h-full md:h-[100dvh] overflow-y-auto pt-16 md:pt-0">
                <Routes>
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
                    <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
                    <Route path="/water" element={<ProtectedRoute><Water /></ProtectedRoute>} />
                    <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
                    <Route path="/weight" element={<ProtectedRoute><Weight /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    {/* Fallback redirect for any unknown route */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppLayout />
                <Toaster 
                    position="top-right" 
                    toastOptions={{
                        className: 'font-sans',
                        style: {
                            borderRadius: '12px',
                            background: '#1a1a2e',
                            color: '#fff',
                        },
                    }} 
                />
            </AuthProvider>
        </Router>
    );
}

export default App;

