import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categories from '../categories';

const defaultProductData = {
  name: '',
  description: '',
  price: 0,
  category: 'Apparel',
  stockQuantity: 0,
  imageUrl: '',
  seller: '64f8b5d3a9d123456789abcd',
};

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', role: 'Customer', status: 'Active' },
  { id: 2, name: 'Daniel Smith', email: 'daniel@email.com', role: 'Seller', status: 'Pending' },
  { id: 3, name: 'Maya Perera', email: 'maya@email.com', role: 'Customer', status: 'Active' },
  { id: 4, name: 'Nimal Fernando', email: 'nimal@email.com', role: 'Seller', status: 'Approved' },
];

const initialCategories = categories.filter((category) => category.value !== 'All');

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [productData, setProductData] = useState(defaultProductData);
  const [productMessage, setProductMessage] = useState('');
  const [productError, setProductError] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryList, setCategoryList] = useState(initialCategories);

  const fetchPendingSellers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/sellers/pending');
      if (!response.ok) {
        throw new Error('Failed to fetch pending sellers');
      }

      const data = await response.json();
      setPendingSellers(data);
    } catch (fetchError) {
      console.error('Error fetching sellers:', fetchError);
      setError('Unable to load pending sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchPendingSellers();
    }
  }, [activeTab]);

  const handleApprove = async (sellerId, sellerName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/sellers/${sellerId}/approve`, {
        method: 'PUT',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve seller');
      }

      setActionMessage(`✅ ${sellerName} approved successfully!`);
      fetchPendingSellers();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (approveError) {
      console.error('Approve error:', approveError);
      setActionMessage(`❌ Error: ${approveError.message}`);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleReject = async (sellerId, sellerName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/sellers/${sellerId}/reject`, {
        method: 'PUT',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject seller');
      }

      setActionMessage(`❌ ${sellerName} rejected.`);
      fetchPendingSellers();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (rejectError) {
      console.error('Reject error:', rejectError);
      setActionMessage(`❌ Error: ${rejectError.message}`);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleProductChange = (event) => {
    const { name, value } = event.target;

    setProductData((currentData) => ({
      ...currentData,
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value,
    }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setProductMessage('');
    setProductError('');

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to create product');
      }

      setProductMessage('Product added successfully.');
      setProductData(defaultProductData);
    } catch (productSubmitError) {
      setProductError(productSubmitError.message);
    }
  };

  const handleUserStatusToggle = (userId) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'Active' ? 'Suspended' : 'Active',
            }
          : user
      )
    );
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    const trimmedValue = categoryInput.trim();

    if (!trimmedValue) {
      return;
    }

    const newCategory = {
      label: trimmedValue,
      value: trimmedValue,
    };

    setCategoryList((current) => {
      const exists = current.some((category) => category.value.toLowerCase() === trimmedValue.toLowerCase());
      if (exists) {
        return current;
      }
      return [...current, newCategory];
    });

    setCategoryInput('');
  };

  return (
    <div style={styles.dashboardContainer}>
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>ADMINISTRATOR</h2>
        <nav style={styles.nav}>
          <button style={activeTab === 'approvals' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('approvals')}>
            🏪 Approve Sellers
          </button>
          <button style={activeTab === 'users' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('users')}>
            👥 Manage Users
          </button>
          <button style={activeTab === 'categories' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('categories')}>
            📁 Manage Categories
          </button>
          <button style={activeTab === 'products' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('products')}>
            🛍️ Add New Product
          </button>
          <button style={activeTab === 'reports' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('reports')}>
            📈 System Reports
          </button>
          <Link to="/" style={styles.storeLink}>
            🛒 View Store
          </Link>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        {activeTab === 'approvals' && (
          <div>
            <div style={styles.headerRow}>
              <h2>Pending Seller Registrations</h2>
              <div style={styles.headerActions}>
                <button type="button" style={styles.headerAction} onClick={() => setActiveTab('products')}>
                  Add New Product
                </button>
                <button style={styles.refreshBtn} onClick={fetchPendingSellers}>
                  🔄 Refresh
                </button>
              </div>
            </div>

            {actionMessage && <div style={styles.actionMessage}>{actionMessage}</div>}
            {loading && <p style={styles.message}>Loading pending sellers...</p>}
            {error && <p style={styles.error}>{error}</p>}
            {!loading && !error && pendingSellers.length === 0 && <p style={styles.message}>No pending seller registrations.</p>}

            {!loading && !error && pendingSellers.length > 0 && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Date Applied</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSellers.map((seller) => (
                    <tr key={seller._id} style={styles.tr}>
                      <td style={styles.td}>{seller.name}</td>
                      <td style={styles.td}>{seller.email}</td>
                      <td style={styles.td}>{new Date(seller.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <button style={styles.approveBtn} onClick={() => handleApprove(seller._id, seller.name)}>
                          Approve
                        </button>
                        <button style={styles.rejectBtn} onClick={() => handleReject(seller._id, seller.name)}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2>Manage Users</h2>
            <div style={styles.cardGrid}>
              {users.map((user) => (
                <div key={user.id} style={styles.userCard}>
                  <div>
                    <h3 style={styles.userName}>{user.name}</h3>
                    <p style={styles.userMeta}>{user.email}</p>
                    <p style={styles.userMeta}>{user.role}</p>
                  </div>
                  <div style={styles.userMetaRow}>
                    <span style={user.status === 'Active' ? styles.statusActive : styles.statusInactive}>{user.status}</span>
                    <button style={styles.secondaryBtn} onClick={() => handleUserStatusToggle(user.id)}>
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h2>Manage Categories</h2>
            <form onSubmit={handleCategorySubmit} style={styles.categoryForm}>
              <input
                type="text"
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                placeholder="Add new category"
                style={styles.formInput}
              />
              <button type="submit" style={styles.submitBtn}>
                Add Category
              </button>
            </form>
            <div style={styles.tagGroup}>
              {categoryList.map((category) => (
                <span key={category.value} style={styles.tag}>
                  {category.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <h2>Add New Product</h2>
            <form style={styles.productForm} onSubmit={handleProductSubmit}>
              <label style={styles.formLabel}>
                Product Name
                <input name="name" type="text" value={productData.name} onChange={handleProductChange} style={styles.formInput} required />
              </label>

              <label style={styles.formLabel}>
                Description
                <textarea name="description" value={productData.description} onChange={handleProductChange} style={styles.formInput} rows="4" required />
              </label>

              <div style={styles.formGrid}>
                <label style={styles.formLabel}>
                  Price
                  <input name="price" type="number" min="0" step="0.01" value={productData.price} onChange={handleProductChange} style={styles.formInput} required />
                </label>

                <label style={styles.formLabel}>
                  Stock Quantity
                  <input name="stockQuantity" type="number" min="0" value={productData.stockQuantity} onChange={handleProductChange} style={styles.formInput} required />
                </label>
              </div>

              <label style={styles.formLabel}>
                Category
                <select name="category" value={productData.category} onChange={handleProductChange} style={styles.formInput} required>
                  {categoryList.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.formLabel}>
                Image URL
                <input name="imageUrl" type="text" value={productData.imageUrl} onChange={handleProductChange} style={styles.formInput} />
              </label>

              <label style={styles.formLabel}>
                Seller ID
                <input name="seller" type="text" value={productData.seller} onChange={handleProductChange} style={styles.formInput} required />
              </label>

              <button type="submit" style={styles.submitBtn}>
                Add Product
              </button>

              {productMessage && <p style={styles.successMessage}>{productMessage}</p>}
              {productError && <p style={styles.errorMessage}>{productError}</p>}
            </form>
          </div>
        )}

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
    color: '#3498db',
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
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerAction: {
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    padding: '12px 18px',
  },
  refreshBtn: {
    backgroundColor: '#222',
    color: '#fff',
    border: '1px solid #444',
    padding: '10px 18px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  actionMessage: {
    backgroundColor: '#1a3a1a',
    color: '#6bff6b',
    padding: '12px 18px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '15px',
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
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  userCard: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '18px',
  },
  userName: {
    margin: '0 0 8px 0',
    fontSize: '20px',
  },
  userMeta: {
    margin: '4px 0',
    color: '#aaa',
  },
  userMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  statusActive: {
    backgroundColor: '#123b29',
    color: '#7df6b4',
    border: '1px solid #1d6946',
    borderRadius: '999px',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  statusInactive: {
    backgroundColor: '#3c1d1d',
    color: '#ff9d9d',
    border: '1px solid #7a2f2f',
    borderRadius: '999px',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#222',
    color: '#fff',
    border: '1px solid #444',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  categoryForm: {
    display: 'flex',
    gap: '12px',
    margin: '20px 0',
    maxWidth: '420px',
  },
  tagGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '12px',
  },
  tag: {
    backgroundColor: '#1c1c1c',
    border: '1px solid #333',
    borderRadius: '999px',
    padding: '8px 12px',
    color: '#d2d2d2',
  },
  productForm: {
    maxWidth: '720px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    marginTop: '25px',
    padding: '25px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '18px',
  },
  formLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#bbb',
    fontSize: '14px',
  },
  formInput: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '11px 12px',
    backgroundColor: '#222',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '15px',
  },
  submitBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    padding: '12px 20px',
  },
  successMessage: {
    color: '#6bff6b',
    margin: '0',
  },
  errorMessage: {
    color: '#ff6b6b',
    margin: '0',
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
  },
  message: {
    color: '#aaa',
    fontSize: '16px',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '16px',
  },
};

export default AdminDashboard;