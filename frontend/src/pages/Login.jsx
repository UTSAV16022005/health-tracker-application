import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const stats = [
        { icon: '🔥', label: 'Calories Tracked', value: '2.4M+' },
        { icon: '💪', label: 'Workouts Logged', value: '850K+' },
        { icon: '😴', label: 'Sleep Hours', value: '5.1M+' },
    ];

    return (
        <div className="auth-split-container">
            {/* ── LEFT PANEL ── */}
            <div className="auth-left-panel">
                <div className="auth-left-overlay" />
                <img
                    src="/fitness-panel.png"
                    alt="Fitness motivation"
                    className="auth-left-bg"
                />

                <div className="auth-left-content">
                    <div className="auth-brand">
                        {/* Clean SVG logo — lightning bolt / pulse */}
                        <div className="auth-brand-svg">
                            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                                <path d="M18 3L6 18H15L14 29L26 14H17L18 3Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="auth-brand-name">HealthTrack</span>
                    </div>

                    <div className="auth-left-hero">
                        <h2 className="auth-left-title">
                            Track Every Rep.<br />
                            Own Every Day.
                        </h2>
                        <p className="auth-left-subtitle">
                            Your all-in-one fitness companion for workouts, nutrition, sleep &amp; wellness goals.
                        </p>
                    </div>

                    <div className="auth-stats">
                        {stats.map(({ icon, label, value }) => (
                            <div className="auth-stat-card" key={label}>
                                <span className="auth-stat-icon">{icon}</span>
                                <div>
                                    <div className="auth-stat-value">{value}</div>
                                    <div className="auth-stat-label">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="auth-slide-dots">
                        <span className="dot active" />
                        <span className="dot" />
                        <span className="dot" />
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-right-panel" onMouseMove={handleMouseMove}>
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h1 className="auth-form-title">Welcome back 👋</h1>
                        <p className="auth-form-subtitle">
                            Log in to continue your fitness journey
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form" noValidate>
                        <div className="auth-field-group">
                            <label htmlFor="email" className="auth-label">Email address</label>
                            <div className="auth-input-wrap">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="auth-input auth-input-no-icon"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="auth-field-group">
                            <div className="auth-label-row">
                                <label htmlFor="password" className="auth-label">Password</label>
                                <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
                            </div>
                            <div className="auth-input-wrap">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="auth-input auth-input-no-icon"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={() => setShowPassword(v => !v)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="auth-spinner" />
                            ) : (
                                <>Login to Dashboard <span className="btn-arrow">→</span></>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="auth-social-row">
                        <button 
                            className="auth-social-btn auth-social-btn--full" 
                            type="button"
                            title="Continue with Google"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
                            Continue with Google
                        </button>
                    </div>

                    <p className="auth-register-link">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">Create one free →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
