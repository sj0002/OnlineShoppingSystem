import React from 'react';
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
    const isAuthRoute = pathname === '/login' || pathname === '/register';

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
            {!isAuthRoute && (
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

            {/* User Actions & Cart */}
            <div style={styles.navActions}>
                <button style={styles.navLink} onClick={() => navigate('/login')}>Login</button>
                <button style={styles.navLink} onClick={() => navigate('/login')}>Register</button>

                {/* THIS IS THE UPDATED CART BUTTON */}
                <div style={styles.cartBtn} onClick={() => navigate('/cart')}>
                    🛒 Cart (2)
                </div>
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