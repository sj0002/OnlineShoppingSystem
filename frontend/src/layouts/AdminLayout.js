import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

function AdminLayout() {
    const [activeTab, setActiveTab] = useState('approvals');

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <h2 style={styles.brand}>ADMINISTRATOR</h2>
                <nav style={styles.nav}>
                    <button style={activeTab === 'approvals' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('approvals')}>
                        Approve Sellers
                    </button>
                    <button style={activeTab === 'users' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('users')}>
                        Manage Users
                    </button>
                    <button style={activeTab === 'categories' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('categories')}>
                        Manage Categories
                    </button>
                    <button style={activeTab === 'products' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('products')}>
                        Add New Product
                    </button>
                    <button style={activeTab === 'reports' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('reports')}>
                        System Reports
                    </button>
                    <Link to="/" style={styles.storeLink}>View Store</Link>
                </nav>
            </aside>

            <div style={styles.contentShell}>
                <header style={styles.header}>
                    <span>Administration</span>
                    <Link to="/profile" style={styles.profileLink}>Profile</Link>
                </header>
                <Outlet context={{ activeTab, setActiveTab }} />
            </div>
        </div>
    );
}

const styles = {
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' },
    sidebar: { width: '250px', flexShrink: 0, backgroundColor: '#111', borderRight: '1px solid #333', padding: '20px' },
    brand: { color: '#3498db', fontSize: '20px', letterSpacing: '1px', margin: '0 0 40px', paddingBottom: '20px', borderBottom: '1px solid #333' },
    nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
    navItem: { backgroundColor: 'transparent', color: '#888', border: 0, borderRadius: '4px', padding: '15px', textAlign: 'left', fontSize: '16px', cursor: 'pointer' },
    activeNavItem: { backgroundColor: '#222', color: '#fff', border: 0, borderRadius: '4px', padding: '15px', textAlign: 'left', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
    storeLink: { backgroundColor: '#3498db', color: '#fff', padding: '15px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none', borderRadius: '4px', marginTop: '20px' },
    contentShell: { flex: 1, minWidth: 0 },
    header: { height: '64px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', backgroundColor: '#151515', borderBottom: '1px solid #333', fontWeight: 'bold' },
    profileLink: { color: '#aaa', textDecoration: 'none', fontWeight: 'normal' },
};

export default AdminLayout;