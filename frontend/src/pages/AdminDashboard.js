// frontend/src/pages/AdminDashboard.js
import React, { useState } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('approvals');

  return (
    <div style={styles.dashboardContainer}>
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>ADMINISTRATOR</h2>
        <nav style={styles.nav}>
          <button 
            style={activeTab === 'approvals' ? styles.activeNavItem : styles.navItem}
            onClick={() => setActiveTab('approvals')}
          >
            🏪 Approve Sellers
          </button>
          <button 
            style={activeTab === 'users' ? styles.activeNavItem : styles.navItem}
            onClick={() => setActiveTab('users')}
          >
            👥 Manage Users
          </button>
          <button 
            style={activeTab === 'categories' ? styles.activeNavItem : styles.navItem}
            onClick={() => setActiveTab('categories')}
          >
            📁 Manage Categories
          </button>
          <button 
            style={activeTab === 'reports' ? styles.activeNavItem : styles.navItem}
            onClick={() => setActiveTab('reports')}
          >
            📈 System Reports
          </button>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main style={styles.mainContent}>
        
        {/* Pending Sellers Tab */}
        {activeTab === 'approvals' && (
          <div>
            <div style={styles.headerRow}>
              <h2>Pending Seller Registrations</h2>
            </div>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Store Name</th>
                  <th style={styles.th}>Owner Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Date Applied</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.tr}>
                  <td style={styles.td}>Tech Gear Hub</td>
                  <td style={styles.td}>Jane Smith</td>
                  <td style={styles.td}>jane.smith@email.com</td>
                  <td style={styles.td}>2026-08-01</td>
                  <td style={styles.td}>
                    <button style={styles.approveBtn}>Approve</button>
                    <button style={styles.rejectBtn}>Reject</button>
                  </td>
                </tr>
                <tr style={styles.tr}>
                  <td style={styles.td}>Colombo Apparels</td>
                  <td style={styles.td}>Kamal Perera</td>
                  <td style={styles.td}>kamal@colomboapp.com</td>
                  <td style={styles.td}>2026-08-02</td>
                  <td style={styles.td}>
                    <button style={styles.approveBtn}>Approve</button>
                    <button style={styles.rejectBtn}>Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* System Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <h2>Overall System Reports</h2>
            
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h4 style={styles.statTitle}>Total Sales</h4>
                <p style={styles.statValue}>Rs. 1,450,000</p>
              </div>
              <div style={styles.statCard}>
                <h4 style={styles.statTitle}>Total Orders</h4>
                <p style={styles.statValue}>342</p>
              </div>
              <div style={styles.statCard}>
                <h4 style={styles.statTitle}>Active Sellers</h4>
                <p style={styles.statValue}>18</p>
              </div>
              <div style={styles.statCard}>
                <h4 style={styles.statTitle}>Registered Customers</h4>
                <p style={styles.statValue}>1,204</p>
              </div>
            </div>
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
    color: '#3498db', // Give Admin a slightly different accent color
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
  approveBtn: {
    backgroundColor: '#1a4a1a',
    color: '#6bff6b',
    border: '1px solid #1a6b1a',
    padding: '8px 12px',
    marginRight: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectBtn: {
    backgroundColor: '#4a1111',
    color: '#ff6b6b',
    border: '1px solid #6b1a1a',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  statCard: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#111',
    border: '1px solid #333',
    padding: '20px',
    borderRadius: '8px',
  },
  statTitle: {
    margin: '0 0 10px 0',
    color: '#aaa',
    fontSize: '14px',
    textTransform: 'uppercase',
  },
  statValue: {
    margin: '0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
  }
};

export default AdminDashboard;