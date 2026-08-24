import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('Customer');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                            password,
                            role
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

                    {/* Role Selection */}
                    <div style={styles.roleContainer}>

                        <label style={styles.radioLabel}>
                            <input
                                type="radio"
                                value="Customer"
                                checked={role === 'Customer'}
                                onChange={() => setRole('Customer')}
                                style={styles.radio}
                            />
                            Customer
                        </label>

                        <label style={styles.radioLabel}>
                            <input
                                type="radio"
                                value="Seller"
                                checked={role === 'Seller'}
                                onChange={() => setRole('Seller')}
                                style={styles.radio}
                            />
                            Seller
                        </label>

                        <label style={styles.radioLabel}>
                            <input
                                type="radio"
                                value="Admin"
                                checked={role === 'Admin'}
                                onChange={() => setRole('Admin')}
                                style={styles.radio}
                            />
                            Admin
                        </label>

                    </div>

                    {/* Full Name - Registration only */}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email Address"
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        style={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />

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

    roleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        color: '#fff',
    },

    radioLabel: {
        cursor: 'pointer',
        fontSize: '14px',
        color: '#aaa',
        display: 'flex',
        alignItems: 'center',
    },

    radio: {
        marginRight: '8px',
    },

    input: {
        padding: '12px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '16px',
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