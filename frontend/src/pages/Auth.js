import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');
        setLoading(true);

        try {
            // ============================
            // REGISTER
            // ============================
            if (!isLogin) {
                const response = await fetch(
                    'http://localhost:5000/api/auth/register',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                setMessage('Registration successful! Please login.');

                // Clear form
                setName('');
                setEmail('');
                setPassword('');

                // Switch to login after successful registration
                setTimeout(() => {
                    setIsLogin(true);
                    setMessage('');
                }, 1500);
            }

            // ============================
            // LOGIN
            // ============================
            else {
                const response = await fetch(
                    'http://localhost:5000/api/auth/login',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                // Save JWT token
                localStorage.setItem('token', data.token);

                // Save user information
                localStorage.setItem(
                    'user',
                    JSON.stringify(data.user)
                );

                setMessage('Login successful!');

                // Redirect according to role
                setTimeout(() => {
                    if (data.user.role === 'Admin') {
                        navigate('/admin');
                    } else if (data.user.role === 'Seller') {
                        navigate('/seller');
                    } else {
                        navigate('/');
                    }
                }, 500);
            }

        } catch (error) {
            console.error('Authentication error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>

                {/* Toggle Login / Register */}
                <div style={styles.tabContainer}>
                    <button
                        type="button"
                        style={isLogin ? styles.activeTab : styles.tab}
                        onClick={() => {
                            setIsLogin(true);
                            setMessage('');
                            setError('');
                        }}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        style={!isLogin ? styles.activeTab : styles.tab}
                        onClick={() => {
                            setIsLogin(false);
                            setMessage('');
                            setError('');
                        }}
                    >
                        Register
                    </button>
                </div>

                <h2 style={styles.title}>
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h2>

                <form onSubmit={handleSubmit} style={styles.form}>

                    {/* Full Name - Registration only */}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Password */}
                    <div style={styles.passwordField}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            style={styles.passwordInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                            style={styles.passwordToggle}
                            onClick={() => setShowPassword((visible) => !visible)}
                        >
                            {showPassword ? '🙈' : '👁'}
                        </button>
                    </div>

                    {isLogin && (
                        <>
                            <button
                                type="button"
                                style={styles.forgotPassword}
                                onClick={() => setMessage('Password reset is not available yet.')}
                            >
                                Forgot Password?
                            </button>

                            <label style={styles.rememberMe}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                        </>
                    )}

                    {/* Message */}
                    {message && (
                        <div style={styles.successMessage}>
                            {message}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading
                            ? 'Please wait...'
                            : isLogin
                                ? 'Log In'
                                : 'Sign Up'}
                    </button>

                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '20px',
    },

    formCard: {
        backgroundColor: '#111',
        padding: '40px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid #333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    },

    tabContainer: {
        display: 'flex',
        marginBottom: '30px',
        borderBottom: '1px solid #333',
    },

    tab: {
        flex: 1,
        padding: '10px',
        backgroundColor: 'transparent',
        color: '#888',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },

    activeTab: {
        flex: 1,
        padding: '10px',
        backgroundColor: 'transparent',
        color: '#fff',
        border: 'none',
        borderBottom: '2px solid #fff',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },

    title: {
        color: '#fff',
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center',
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },

    input: {
        padding: '12px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '16px',
    },

    passwordField: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },

    passwordInput: {
        width: '100%',
        padding: '12px 48px 12px 12px',
        boxSizing: 'border-box',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '16px',
    },

    passwordToggle: {
        position: 'absolute',
        right: '8px',
        padding: '6px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '18px',
    },

    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: '-8px',
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#6eb5ff',
        cursor: 'pointer',
        fontSize: '14px',
    },

    rememberMe: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '14px',
    },

    submitBtn: {
        marginTop: '10px',
        padding: '14px',
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textTransform: 'uppercase',
    },

    successMessage: {
        backgroundColor: '#143d20',
        color: '#6ee7a0',
        padding: '10px',
        borderRadius: '4px',
        textAlign: 'center',
    },

    errorMessage: {
        backgroundColor: '#3d1414',
        color: '#ff7777',
        padding: '10px',
        borderRadius: '4px',
        textAlign: 'center',
    }
};

export default Auth;