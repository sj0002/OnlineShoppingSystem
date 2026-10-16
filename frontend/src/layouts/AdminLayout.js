import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

function AdminLayout() {
    const [activeTab, setActiveTab] = useState('approvals');

    return (
        <div className="admin-layout" style={styles.layout}>
            <aside style={styles.sidebar}>
                <h2 style={styles.brand}>ADMIN / CONTROL</h2>
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
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#07090b', color: '#f3f7f8' },
    sidebar: { width: '264px', flexShrink: 0, backgroundColor: '#0f1418', borderRight: '1px solid #293640', padding: '28px 18px' },
    brand: { color: '#35d0bd', fontSize: '17px', letterSpacing: '1.6px', margin: '0 0 42px', padding: '0 12px 22px', borderBottom: '1px solid #293640' },
    nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
    navItem: { backgroundColor: 'transparent', color: '#91a2ad', border: 0, borderRadius: '9px', padding: '13px 14px', textAlign: 'left', fontSize: '14px', cursor: 'pointer' },
    activeNavItem: { backgroundColor: 'rgba(53, 208, 189, 0.13)', color: '#35d0bd', border: '1px solid rgba(53, 208, 189, 0.2)', borderRadius: '9px', padding: '13px 14px', textAlign: 'left', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' },
    storeLink: { backgroundColor: '#35d0bd', color: '#071011', padding: '13px 14px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none', borderRadius: '9px', marginTop: '24px' },
    contentShell: { flex: 1, minWidth: 0 },
    header: { height: '72px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', backgroundColor: '#0f1418', borderBottom: '1px solid #293640', fontWeight: 'bold', color: '#dce8eb' },
    profileLink: { color: '#35d0bd', textDecoration: 'none', fontWeight: 'normal' },
};

export default AdminLayout;