import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('Customer'); // Default role
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // This is the updated routing logic
        if (isLogin) {
            if (role === 'Admin') {
                navigate('/admin');     // Sends Admin to Admin Dashboard
            } else if (role === 'Seller') {
                navigate('/seller');    // Sends Seller to Seller Dashboard
            } else {
                navigate('/');          // Sends Customer back to the Home page
            }
        } else {
            console.log(`Submitting Registration for ${role}`);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>

                {/* Toggle Login / Register */}
                <div style={styles.tabContainer}>
                    <button
                        style={isLogin ? styles.activeTab : styles.tab}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        style={!isLogin ? styles.activeTab : styles.tab}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                <h2 style={styles.title}>
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h2>

                <form onSubmit={handleSubmit} style={styles.form}>

                    {/* UPDATED: Three Role Selection Buttons */}
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

                    {/* Registration only fields */}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            style={styles.input}
                            required
                        />
                    )}

                    {/* Common Fields */}
                    <input
                        type="email"
                        placeholder="Email Address"
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        style={styles.input}
                        required
                    />

                    <button type="submit" style={styles.submitBtn}>
                        {isLogin ? 'Log In' : 'Sign Up'}
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
    }
};

export default Auth;