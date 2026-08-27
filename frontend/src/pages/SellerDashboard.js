// frontend/src/pages/SellerDashboard.js
import React, { useState } from 'react';

function SellerDashboard() {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div style={styles.dashboardContainer}>

            {/* Sidebar Navigation */}
            <aside style={styles.sidebar}>
                <h2 style={styles.brand}>SELLER PANEL</h2>
                <nav style={styles.nav}>
                    <button
                        style={activeTab === 'products' ? styles.activeNavItem : styles.navItem}
                        onClick={() => setActiveTab('products')}
                    >
                        📦 Manage Products
                    </button>
                    <button
                        style={activeTab === 'orders' ? styles.activeNavItem : styles.navItem}
                        onClick={() => setActiveTab('orders')}
                    >
                        📋 Manage Orders
                    </button>
                    <button style={styles.navItem}>
                        📊 Sales Reports
                    </button>
                </nav>
            </aside>

            {/* Main Workspace */}
            <main style={styles.mainContent}>

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div>
                        <div style={styles.headerRow}>
                            <h2>Product Listings</h2>
                            <button style={styles.addBtn}>+ Add New Product</button>
                        </div>

                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Price (Rs.)</th>
                                    <th style={styles.th}>Stock</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={styles.tr}>
                                    <td style={styles.td}>Hybrid Duffel Bag</td>
                                    <td style={styles.td}>Travel & Bags</td>
                                    <td style={styles.td}>8500</td>
                                    <td style={styles.td}>12</td>
                                    <td style={styles.td}>
                                        <button style={styles.actionBtn}>Edit</button>
                                        <button style={styles.deleteBtn}>Delete</button>
                                    </td>
                                </tr>
                                <tr style={styles.tr}>
                                    <td style={styles.td}>Heavy Textured T-Shirt</td>
                                    <td style={styles.td}>Apparel</td>
                                    <td style={styles.td}>3500</td>
                                    <td style={styles.td}>45</td>
                                    <td style={styles.td}>
                                        <button style={styles.actionBtn}>Edit</button>
                                        <button style={styles.deleteBtn}>Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        <h2>Order Management</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Order ID</th>
                                    <th style={styles.th}>Customer</th>
                                    <th style={styles.th}>Total (Rs.)</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={styles.tr}>
                                    <td style={styles.td}>#ORD-001</td>
                                    <td style={styles.td}>John Doe</td>
                                    <td style={styles.td}>12000</td>
                                    <td style={styles.td}>
                                        <select style={styles.statusSelect} defaultValue="Pending">
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Packed">Packed</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={styles.td}>
                                        <button style={styles.actionBtn}>Update</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
        transition: 'background-color 0.2s',
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
    mainContent: {
        flex: 1,
        padding: '40px',
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
        borderRadius: '8px',
        overflow: 'hidden',
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
    actionBtn: {
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #444',
        padding: '8px 12px',
        marginRight: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteBtn: {
        backgroundColor: '#4a1111',
        color: '#ff6b6b',
        border: '1px solid #6b1a1a',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    statusSelect: {
        backgroundColor: '#222',
        color: '#fff',
        border: '1px solid #444',
        padding: '8px',
        borderRadius: '4px',
    }
};

export default SellerDashboard;