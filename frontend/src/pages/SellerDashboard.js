import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SellerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const navigationItems = [
        { id: 'overview', label: 'Dashboard Overview' },
        { id: 'products', label: 'My Products' },
        { id: 'add-product', label: 'Add New Product' },
        { id: 'orders', label: 'My Orders' },
    ];

    return (
        <div style={styles.dashboardContainer}>
            <aside style={styles.sidebar}>
                <h2 style={styles.brand}>SELLER PANEL</h2>
                <nav style={styles.nav}>
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            style={activeTab === item.id ? styles.activeNavItem : styles.navItem}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                    <Link to="/" style={styles.storeLink}>View Store</Link>
                </nav>
            </aside>

            <main style={styles.mainContent}>
                {activeTab === 'overview' && (
                    <section>
                        <h2>Welcome, Seller!</h2>
                        <p style={styles.mutedText}>Here is a quick look at your store activity.</p>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <span style={styles.statLabel}>Active Products</span>
                                <strong style={styles.statValue}>24</strong>
                            </div>
                            <div style={styles.statCard}>
                                <span style={styles.statLabel}>Pending Orders</span>
                                <strong style={styles.statValue}>8</strong>
                            </div>
                            <div style={styles.statCard}>
                                <span style={styles.statLabel}>This Month&apos;s Sales</span>
                                <strong style={styles.statValue}>Rs. 186,500</strong>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'products' && (
                    <section>
                        <div style={styles.headerRow}>
                            <h2>My Products</h2>
                            <button type="button" style={styles.addBtn} onClick={() => setActiveTab('add-product')}>
                                Add New Product
                            </button>
                        </div>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Price (Rs.)</th>
                                    <th style={styles.th}>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={styles.tr}>
                                    <td style={styles.td}>Hybrid Duffel Bag</td>
                                    <td style={styles.td}>Travel &amp; Bags</td>
                                    <td style={styles.td}>8500</td>
                                    <td style={styles.td}>12</td>
                                </tr>
                                <tr style={styles.tr}>
                                    <td style={styles.td}>Heavy Textured T-Shirt</td>
                                    <td style={styles.td}>Apparel</td>
                                    <td style={styles.td}>3500</td>
                                    <td style={styles.td}>45</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === 'add-product' && (
                    <section>
                        <h2>Add New Product</h2>
                        <div style={styles.placeholderPanel}>
                            <p style={styles.mutedText}>Product creation form coming soon.</p>
                            <button type="button" style={styles.addBtn} onClick={() => setActiveTab('products')}>
                                View My Products
                            </button>
                        </div>
                    </section>
                )}

                {activeTab === 'orders' && (
                    <section>
                        <h2>My Orders</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Order ID</th>
                                    <th style={styles.th}>Customer</th>
                                    <th style={styles.th}>Total (Rs.)</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={styles.tr}>
                                    <td style={styles.td}>#ORD-001</td>
                                    <td style={styles.td}>John Doe</td>
                                    <td style={styles.td}>12000</td>
                                    <td style={styles.td}>Pending</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                )}
            </main>
        </div>
    );
}

const styles = {
    dashboardContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#111',
        borderRight: '1px solid #333',
        padding: '20px',
    },
    brand: {
        fontSize: '20px',
        fontWeight: '900',
        letterSpacing: '1px',
        marginBottom: '40px',
        borderBottom: '1px solid #333',
        paddingBottom: '20px',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    navItem: {
        backgroundColor: 'transparent',
        color: '#888',
        border: 'none',
        padding: '15px',
        textAlign: 'left',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    activeNavItem: {
        backgroundColor: '#222',
        color: '#fff',
        border: 'none',
        padding: '15px',
        textAlign: 'left',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
        fontWeight: 'bold',
    },
    storeLink: {
        display: 'block',
        backgroundColor: '#3498db',
        color: '#fff',
        padding: '15px',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        textDecoration: 'none',
        borderRadius: '4px',
        marginTop: '20px',
    },
    mainContent: {
        flex: 1,
        padding: '40px',
    },
    mutedText: {
        color: '#aaa',
    },
    statsGrid: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        marginTop: '30px',
    },
    statCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: '200px',
        backgroundColor: '#111',
        border: '1px solid #333',
        padding: '20px',
        borderRadius: '8px',
    },
    statLabel: {
        color: '#aaa',
        fontSize: '14px',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: '28px',
    },
    placeholderPanel: {
        maxWidth: '600px',
        marginTop: '25px',
        padding: '25px',
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    addBtn: {
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        padding: '12px 20px',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#111',
    },
    th: {
        backgroundColor: '#1a1a1a',
        padding: '15px',
        textAlign: 'left',
        borderBottom: '1px solid #333',
        color: '#aaa',
    },
    tr: {
        borderBottom: '1px solid #222',
    },
    td: {
        padding: '15px',
        verticalAlign: 'middle',
    },
};

export default SellerDashboard;
