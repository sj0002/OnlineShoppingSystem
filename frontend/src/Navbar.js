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
        <header className="store-navbar" style={styles.navbar}>
            <div
            className="brand-mark"
                style={styles.logo}
                onClick={() => navigate('/')} // Clicking the logo goes back home
            >
                STOREFRONT.
            </div>

            {/* Search & Filter Section */}
            {isShopPage && (
                <div className="store-search" style={styles.searchContainer}>
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
            <div className="nav-actions" style={styles.navActions}>
                {!currentUser && (
                    <>
                        <button className="nav-link" style={styles.navLink} onClick={() => navigate('/login')}>Login</button>
                        <button className="nav-link" style={styles.navLink} onClick={() => navigate('/login')}>Register</button>
                    </>
                )}
                {currentUser && (
                    <button className="nav-link" style={styles.navLink} onClick={() => navigate('/profile')}>Profile</button>
                )}
                {currentUser && (
                    <button className="nav-link" style={styles.navLink} onClick={handleLogout}>Logout</button>
                )}

                {!isAdminPreview && !hideCart && (
                    <div className="cart-button" style={styles.cartBtn} onClick={() => navigate('/cart')}>
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
        backgroundColor: 'rgba(7, 9, 11, 0.84)',
        borderBottom: '1px solid #293640',
    },
    logo: {
        fontSize: '24px',
        fontWeight: '900',
        letterSpacing: '2px',
        color: '#f3f7f8',
        cursor: 'pointer',
    },
    searchContainer: {
        display: 'flex',
        gap: '10px',
    },
    searchInput: {
        padding: '10px 15px',
        backgroundColor: '#151c22',
        border: '1px solid #293640',
        color: '#f3f7f8',
        borderRadius: '4px',
        width: '300px',
    },
    filterSelect: {
        padding: '10px',
        backgroundColor: '#151c22',
        border: '1px solid #293640',
        color: '#f3f7f8',
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
        color: '#91a2ad',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'color 0.2s',
    },
    cartBtn: {
        cursor: 'pointer',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#1b242b',
        padding: '10px 15px',
        borderRadius: '9px',
    }
};

export default Navbar;