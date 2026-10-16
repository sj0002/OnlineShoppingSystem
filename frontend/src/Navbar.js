import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import categories from './categories';

function Navbar({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
}) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const readUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    };
    const [currentUser, setCurrentUser] = useState(readUser);
    const [cartQuantity, setCartQuantity] = useState(0);
    const isAdminPreview = currentUser?.role === 'Admin';
    const isShopPage = pathname === '/';
    const hideCart = pathname.includes('/seller') || pathname.includes('/dashboard');

    useEffect(() => {
        const syncUser = () => setCurrentUser(readUser());

        window.addEventListener('authChanged', syncUser);
        window.addEventListener('storage', syncUser);

        return () => {
            window.removeEventListener('authChanged', syncUser);
            window.removeEventListener('storage', syncUser);
        };
    }, []);

    useEffect(() => {
        const readCartQuantity = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const quantity = Array.isArray(cart)
                    ? cart.reduce((total, item) => total + Number(item.quantity || 0), 0)
                    : 0;

                setCartQuantity(quantity);
            } catch {
                setCartQuantity(0);
            }
        };

        readCartQuantity();
        window.addEventListener('cartUpdated', readCartQuantity);
        window.addEventListener('storage', readCartQuantity);

        return () => {
            window.removeEventListener('cartUpdated', readCartQuantity);
            window.removeEventListener('storage', readCartQuantity);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChanged'));
        navigate('/login');
    };

    const handleSearch = (e) => {
        // Check if the user pressed the 'Enter' key and the search isn't empty
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            // Navigate to the search page and pass the query in the URL
            navigate(`/search?query=${searchTerm}`);
        }
    };

    return (
        <header style={styles.navbar}>
            <div
                style={styles.logo}
                onClick={() => navigate('/')} // Clicking the logo goes back home
            >
                STOREFRONT.
            </div>

            {/* Search & Filter Section */}
            {isShopPage && (
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search products by name... (Press Enter)"
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <select
                        style={styles.filterSelect}
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            navigate('/');
                        }}
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {isAdminPreview && <div style={styles.previewBanner}>Viewing as Admin - Purchasing Disabled</div>}

            {/* User Actions & Cart */}
            <div style={styles.navActions}>
                {!currentUser && (
                    <>
                        <button style={styles.navLink} onClick={() => navigate('/login')}>Login</button>
                        <button style={styles.navLink} onClick={() => navigate('/login')}>Register</button>
                    </>
                )}
                {currentUser && (
                    <button style={styles.navLink} onClick={() => navigate('/profile')}>Profile</button>
                )}
                {currentUser && (
                    <button style={styles.navLink} onClick={handleLogout}>Logout</button>
                )}

                {!isAdminPreview && !hideCart && (
                    <div style={styles.cartBtn} onClick={() => navigate('/cart')}>
                        🛒 Cart ({cartQuantity})
                    </div>
                )}
            </div>
        </header>
    );
}

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#111111',
        borderBottom: '1px solid #333',
    },
    logo: {
        fontSize: '24px',
        fontWeight: '900',
        letterSpacing: '2px',
        color: '#ffffff',
        cursor: 'pointer',
    },
    searchContainer: {
        display: 'flex',
        gap: '10px',
    },
    searchInput: {
        padding: '10px 15px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
        width: '300px',
    },
    filterSelect: {
        padding: '10px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    navActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    previewBanner: {
        color: '#f0c674',
        fontSize: '13px',
        fontWeight: 'bold',
        textAlign: 'center',
        whiteSpace: 'nowrap',
    },
    navLink: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#aaaaaa',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'color 0.2s',
    },
    cartBtn: {
        cursor: 'pointer',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: '10px 15px',
        borderRadius: '4px',
    }
};

export default Navbar;