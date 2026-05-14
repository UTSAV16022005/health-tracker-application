import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const response = await authService.getProfile();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setToken(null);
            sessionStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await authService.login({ email, password });
        setToken(response.data.token);
        setUser(response.data.user);
        sessionStorage.setItem('token', response.data.token);
        return response.data;
    };

    const register = async (name, email, password, confirmPassword) => {
        const response = await authService.register({ 
            name, 
            email, 
            password, 
            confirmPassword 
        });
        setToken(response.data.token);
        setUser(response.data.user);
        sessionStorage.setItem('token', response.data.token);
        return response.data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('token');
    };

    const updateProfile = async (profileData) => {
        const response = await authService.updateProfile(profileData);
        setUser(response.data.user);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading, 
            login, 
            register, 
            logout, 
            updateProfile,
            isAuthenticated: !!user  // Only true after server validates the token and returns a user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
