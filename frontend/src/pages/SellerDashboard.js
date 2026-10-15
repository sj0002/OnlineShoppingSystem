import React, { useState, useEffect, useCallback } from 'react';

import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/products';

const CATEGORIES_API_URL = 'http://localhost:5000/api/categories';

const ORDERS_API_URL = 'http://localhost:5000/api/orders';

function SellerDashboard() {

    const [activeTab, setActiveTab] = useState('overview');

    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [orders, setOrders] = useState([]);

    const [ordersLoading, setOrdersLoading] = useState(false);

    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');

    const [message, setMessage] = useState('');

    const [editingId, setEditingId] = useState(null);

    const emptyForm = {

        name: '',

        description: '',

        price: '',

        category: '',

        stockQuantity: '',

        imageUrl: '',

        imageFile: null

    };

    const [form, setForm] = useState(emptyForm);

    const getToken = () =>

        localStorage.getItem('token') ||

        localStorage.getItem('authToken');

    const apiRequest = useCallback(async (url, options = {}) => {

        const token = getToken();

        if (!token) {

            throw new Error('Login token not found. Please log in again.');

        }

        const isFormData = options.body instanceof FormData;

        const response = await fetch(url, {

            ...options,

            headers: {

                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),

                Authorization: `Bearer ${token}`,

                ...options.headers

            }

        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {

            throw new Error(data.message || 'Request failed.');

        }

        return data;

    }, []);

    const loadProducts = useCallback(async () => {

        setLoading(true);

        setError('');

        try {

            const data = await apiRequest(

                `${API_URL}/seller/my-products`

            );

            setProducts(Array.isArray(data) ? data : []);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }, [apiRequest]);

    const loadOrders = useCallback(async () => {

    setOrdersLoading(true);

    setError('');

    try {

        const data = await apiRequest(

            `${ORDERS_API_URL}/seller/my-orders`

        );

        setOrders(Array.isArray(data) ? data : []);

    } catch (err) {

        setError(err.message || 'Unable to load orders.');

    } finally {

        setOrdersLoading(false);

    }

}, [apiRequest]);

    useEffect(() => {

        loadProducts();

    }, [loadProducts]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(CATEGORIES_API_URL);
                console.log(response);
                const data = await response.json();
                console.log('Categories API Data:', data);

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load categories.');
                }

                const categoryList = Array.isArray(data) ? data : data.categories;
                if (!Array.isArray(categoryList)) {
                    throw new Error('Categories API returned an unexpected data format.');
                }

                setCategories(categoryList
                    .map((category) => typeof category === 'string' ? category : category.name)
                    .filter(Boolean));
            } catch (categoryError) {
                console.error('Error fetching categories:', categoryError);
                setError(categoryError.message || 'Unable to load categories.');
            }
        };

        loadCategories();
    }, []);

    const handleInputChange = (e) => {

        const { name, value, files } = e.target;

        setForm((previous) => ({

            ...previous,

            [name]: name === 'imageFile' ? files[0] : value

        }));

    };

    const openAddForm = () => {

        setEditingId(null);

        setForm(emptyForm);

        setError('');

        setMessage('');

        setActiveTab('add-product');

    };

    const openEditForm = (product) => {

        setEditingId(product._id);

        setForm({

            name: product.name || '',

            description: product.description || '',

            price: product.price ?? '',

            category: product.category || '',

            stockQuantity: product.stockQuantity ?? 0,

            imageUrl: product.imageUrl || '',

            imageFile: null

        });

        setError('');

        setMessage('');

        setActiveTab('add-product');

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        setMessage('');

        if (

            !form.name.trim() ||

            !form.description.trim() ||

            !form.category.trim() ||

            form.price === '' ||

            form.stockQuantity === ''

        ) {

            setError('Please fill in all required fields.');

            return;

        }

        const price = Number(form.price);

        const stockQuantity = Number(form.stockQuantity);

        if (!Number.isFinite(price) || price < 0) {

            setError('Price must be a valid non-negative number.');

            return;

        }

        if (

            !Number.isInteger(stockQuantity) ||

            stockQuantity < 0

        ) {

            setError('Stock must be a non-negative whole number.');

            return;

        }

        const payload = {

            name: form.name.trim(),

            description: form.description.trim(),

            price,

            category: form.category.trim(),

            stockQuantity,

            imageUrl: form.imageUrl.trim()

        };

        setSaving(true);

        try {

            if (editingId) {

                await apiRequest(`${API_URL}/${editingId}`, {

                    method: 'PUT',

                    body: JSON.stringify(payload)

                });

                setMessage('Product updated successfully.');

            } else {

                const formData = new FormData();

                formData.append('name', payload.name);
                formData.append('description', payload.description);
                formData.append('price', String(payload.price));
                formData.append('category', payload.category);
                formData.append('stockQuantity', String(payload.stockQuantity));

                if (form.imageFile) {
                    formData.append('image', form.imageFile);
                }

                await apiRequest(API_URL, {

                    method: 'POST',

                    body: formData

                });

                setMessage('Product added successfully.');

            }

            setEditingId(null);

            setForm(emptyForm);

            await loadProducts();

            setActiveTab('products');

        } catch (err) {

            setError(err.message);

        } finally {

            setSaving(false);

        }

    };

    const handleDelete = async (productId) => {

        const confirmed = window.confirm(

            'Are you sure you want to delete this product?'

        );

        if (!confirmed) return;

        setError('');

        setMessage('');

        try {

            await apiRequest(`${API_URL}/${productId}`, {

                method: 'DELETE'

            });

            setMessage('Product deleted successfully.');

            await loadProducts();

        } catch (err) {

            setError(err.message);

        }

    };

    const handleStatusChange = async (orderId, status) => {

        setUpdatingOrderId(orderId);

        setError('');

        setMessage('');

        try {

            await apiRequest(`${ORDERS_API_URL}/${orderId}/status`, {

                method: 'PATCH',

                body: JSON.stringify({ status })

            });

            setMessage('Order status updated successfully.');

            await loadOrders();

        } catch (err) {

            setError(err.message || 'Unable to update order status.');

        } finally {

            setUpdatingOrderId(null);

        }

    };

    const navigationItems = [

        { id: 'overview', label: 'Dashboard Overview' },

        { id: 'products', label: 'My Products' },

        { id: 'add-product', label: 'Add New Product' },

        { id: 'orders', label: 'My Orders' }

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

                            style={

                                activeTab === item.id

                                    ? styles.activeNavItem

                                    : styles.navItem

                            }

                            onClick={() => {

                                setError('');

                                setMessage('');

                                setActiveTab(item.id);

                                if (item.id === 'products') {

                                    loadProducts();

                                }

                                if (item.id === 'orders') {

                                    loadOrders();

                                }

                                if (item.id === 'add-product') {

                                    setEditingId(null);

                                    setForm(emptyForm);

                                }

                            }}

                        >

                            {item.label}

                        </button>

                    ))}

                    <Link to="/" style={styles.storeLink}>

                        View Store

                    </Link>

                </nav>

            </aside>

            <main style={styles.mainContent}>

                {error && (

                    <div style={styles.errorBox}>

                        {error}

                    </div>

                )}

                {message && (

                    <div style={styles.successBox}>

                        {message}

                    </div>

                )}

                {activeTab === 'overview' && (

                    <section>

                        <h2>Welcome, Seller!</h2>

                        <p style={styles.mutedText}>

                            Here is a quick look at your store activity.

                        </p>

                        <div style={styles.statsGrid}>

                            <div style={styles.statCard}>

                                <span style={styles.statLabel}>

                                    My Products

                                </span>

                                <strong style={styles.statValue}>

                                    {products.length}

                                </strong>

                            </div>

                            <div style={styles.statCard}>

                                <span style={styles.statLabel}>

                                    Total Stock

                                </span>

                                <strong style={styles.statValue}>

                                    {products.reduce(

                                        (total, product) =>

                                            total +

                                            Number(product.stockQuantity || 0),

                                        0

                                    )}

                                </strong>

                            </div>

                            <div style={styles.statCard}>

                                <span style={styles.statLabel}>

                                    Product Value

                                </span>

                                <strong style={styles.statValue}>

                                    Rs. {products.reduce(

                                        (total, product) =>

                                            total +

                                            Number(product.price || 0) *

                                            Number(product.stockQuantity || 0),

                                        0

                                    ).toLocaleString()}

                                </strong>

                            </div>

                        </div>

                        <button

                            type="button"

                            style={styles.addBtn}

                            onClick={() => {

                                loadProducts();

                            }}

                        >

                            Refresh Dashboard

                        </button>

                    </section>

                )}

                {activeTab === 'products' && (

                    <section>

                        <div style={styles.headerRow}>

                            <h2>My Products</h2>

                            <button

                                type="button"

                                style={styles.addBtn}

                                onClick={openAddForm}

                            >

                                + Add New Product

                            </button>

                        </div>

                        {loading ? (

                            <p style={styles.mutedText}>

                                Loading products...

                            </p>

                        ) : (

                            <div style={styles.tableWrapper}>

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

                                        {products.length === 0 ? (

                                            <tr>

                                                <td

                                                    style={styles.td}

                                                    colSpan="5"

                                                >

                                                    No products found.

                                                    Add your first product.

                                                </td>

                                            </tr>

                                        ) : (

                                            products.map((product) => (

                                                <tr

                                                    key={product._id}

                                                    style={styles.tr}

                                                >

                                                    <td style={styles.td}>

                                                        {product.name}

                                                    </td>

                                                    <td style={styles.td}>

                                                        {product.category}

                                                    </td>

                                                    <td style={styles.td}>

                                                        {Number(

                                                            product.price

                                                        ).toLocaleString()}

                                                    </td>

                                                    <td style={styles.td}>

                                                        {product.stockQuantity}

                                                    </td>

                                                    <td style={styles.td}>

                                                        <div style={styles.actionButtons}>

                                                            <button

                                                                type="button"

                                                                style={styles.editBtn}

                                                                onClick={() =>

                                                                    openEditForm(product)

                                                                }

                                                            >

                                                                Edit

                                                            </button>

                                                            <button

                                                                type="button"

                                                                style={styles.deleteBtn}

                                                                onClick={() =>

                                                                    handleDelete(product._id)

                                                                }

                                                            >

                                                                Delete

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                )}

                {activeTab === 'add-product' && (

                    <section>

                        <h2>

                            {editingId ? 'Edit Product' : 'Add New Product'}

                        </h2>

                        <form

                            style={styles.form}

                            onSubmit={handleSubmit}

                        >

                            <label style={styles.label}>

                                Product Name *

                                <input

                                    style={styles.input}

                                    name="name"

                                    value={form.name}

                                    onChange={handleInputChange}

                                    required

                                />

                            </label>

                            <label style={styles.label}>

                                Description *

                                <textarea

                                    style={styles.textarea}

                                    name="description"

                                    value={form.description}

                                    onChange={handleInputChange}

                                    required

                                    rows="4"

                                />

                            </label>

                            <div style={styles.formGrid}>

                                <label style={styles.label}>

                                    Price (Rs.) *

                                    <input

                                        style={styles.input}

                                        type="number"

                                        name="price"

                                        value={form.price}

                                        onChange={handleInputChange}

                                        min="0"

                                        step="0.01"

                                        required

                                    />

                                </label>

                                <label style={styles.label}>

                                    Stock Quantity *

                                    <input

                                        style={styles.input}

                                        type="number"

                                        name="stockQuantity"

                                        value={form.stockQuantity}

                                        onChange={handleInputChange}

                                        min="0"

                                        step="1"

                                        required

                                    />

                                </label>

                            </div>

                            <label style={styles.label}>

                                Category *

                                <select

                                    style={styles.input}

                                    name="category"

                                    value={form.category}

                                    onChange={handleInputChange}

                                    required
                                >
                                    <option value="" disabled>Select a Category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                            </label>

                            <label style={styles.label}>

                                Product image (optional)

                                <input

                                    style={styles.input}

                                    type="file"

                                    name="imageFile"

                                    onChange={handleInputChange}

                                />

                            </label>

                            <div style={styles.formActions}>

                                <button

                                    type="submit"

                                    style={styles.addBtn}

                                    disabled={saving}

                                >

                                    {saving

                                        ? 'Saving...'

                                        : editingId

                                            ? 'Update Product'

                                            : 'Save Product'}

                                </button>

                                <button

                                    type="button"

                                    style={styles.cancelBtn}

                                    onClick={() => {

                                        setEditingId(null);

                                        setForm(emptyForm);

                                        setError('');

                                        setActiveTab('products');

                                    }}

                                >

                                    Cancel

                                </button>

                            </div>

                        </form>

                    </section>

                )}

                {activeTab === 'orders' && (

                    <section>

                        <div style={styles.headerRow}>

                            <h2>My Orders</h2>

                            <button

                                type="button"

                                style={styles.addBtn}

                                onClick={loadOrders}

                                disabled={ordersLoading}

                            >

                                {ordersLoading ? 'Refreshing...' : 'Refresh Orders'}

                            </button>

                        </div>

                        {ordersLoading ? (

                            <p style={styles.mutedText}>Loading orders...</p>

                        ) : orders.length === 0 ? (

                            <p style={styles.mutedText}>

                                No orders found for your products yet.

                            </p>

                        ) : (

                            <div style={styles.tableWrapper}>

                                <table style={styles.table}>

                                    <thead>

                                        <tr>

                                            <th style={styles.th}>Order ID</th>

                                            <th style={styles.th}>Customer</th>

                                            <th style={styles.th}>Items</th>

                                            <th style={styles.th}>Total (Rs.)</th>

                                            <th style={styles.th}>Date</th>

                                            <th style={styles.th}>Status</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {orders.map((order) => (

                                            <tr key={order._id} style={styles.tr}>

                                                <td style={styles.td}>

                                                    {String(order._id).slice(-8).toUpperCase()}

                                                </td>

                                                <td style={styles.td}>

                                                    <div>{order.customer?.name || 'Unknown customer'}</div>

                                                    <small style={styles.mutedText}>

                                                        {order.customer?.email || 'No email'}

                                                    </small>

                                                </td>

                                                <td style={styles.td}>

                                                    {order.items?.map((item, index) => (

                                                        <div key={item._id || index} style={{ marginBottom: '8px' }}>

                                                            <strong>{item.product?.name || 'Product unavailable'}</strong>

                                                            <div style={styles.mutedText}>

                                                                Qty: {item.quantity} × Rs. {Number(item.price || 0).toLocaleString()}

                                                            </div>

                                                        </div>

                                                    ))}

                                                </td>

                                                <td style={styles.td}>

                                                    {Number(order.totalAmount || 0).toLocaleString()}

                                                </td>

                                                <td style={styles.td}>

                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}

                                                </td>

                                                <td style={styles.td}>

                                                    <select

                                                        value={order.status || 'Pending'}

                                                        disabled={updatingOrderId === order._id}

                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}

                                                        style={{ ...styles.input, minWidth: '140px', cursor: 'pointer' }}

                                                    >

                                                        <option value="Pending">Pending</option>

                                                        <option value="Processing">Processing</option>

                                                        <option value="Shipped">Shipped</option>

                                                        <option value="Delivered">Delivered</option>

                                                        <option value="Cancelled">Cancelled</option>

                                                    </select>

                                                    {updatingOrderId === order._id && (

                                                        <small style={styles.mutedText}>Updating...</small>

                                                    )}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

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

        fontFamily: '"Helvetica Neue", Arial, sans-serif'

    },

    sidebar: {

        width: '250px',

        flexShrink: 0,

        backgroundColor: '#111',

        borderRight: '1px solid #333',

        padding: '20px'

    },

    brand: {

        fontSize: '20px',

        fontWeight: '900',

        letterSpacing: '1px',

        marginBottom: '40px',

        borderBottom: '1px solid #333',

        paddingBottom: '20px'

    },

    nav: {

        display: 'flex',

        flexDirection: 'column',

        gap: '10px'

    },

    navItem: {

        backgroundColor: 'transparent',

        color: '#888',

        border: 'none',

        padding: '15px',

        textAlign: 'left',

        fontSize: '16px',

        cursor: 'pointer',

        borderRadius: '4px'

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

        fontWeight: 'bold'

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

        marginTop: '20px'

    },

    mainContent: {

        flex: 1,

        minWidth: 0,

        padding: '40px'

    },

    mutedText: {

        color: '#aaa'

    },

    statsGrid: {

        display: 'flex',

        gap: '20px',

        flexWrap: 'wrap',

        marginTop: '30px',

        marginBottom: '25px'

    },

    statCard: {

        display: 'flex',

        flexDirection: 'column',

        gap: '12px',

        minWidth: '200px',

        backgroundColor: '#111',

        border: '1px solid #333',

        padding: '20px',

        borderRadius: '8px'

    },

    statLabel: {

        color: '#aaa',

        fontSize: '14px',

        textTransform: 'uppercase'

    },

    statValue: {

        fontSize: '25px',

        overflowWrap: 'anywhere'

    },

    headerRow: {

        display: 'flex',

        justifyContent: 'space-between',

        alignItems: 'center',

        gap: '15px',

        flexWrap: 'wrap',

        marginBottom: '30px'

    },

    addBtn: {

        backgroundColor: '#fff',

        color: '#000',

        border: 'none',

        padding: '12px 20px',

        fontWeight: 'bold',

        borderRadius: '4px',

        cursor: 'pointer'

    },

    tableWrapper: {

        width: '100%',

        overflowX: 'auto'

    },

    table: {

        width: '100%',

        borderCollapse: 'collapse',

        backgroundColor: '#111'

    },

    th: {

        backgroundColor: '#1a1a1a',

        padding: '15px',

        textAlign: 'left',

        borderBottom: '1px solid #333',

        color: '#aaa',

        whiteSpace: 'nowrap'

    },

    tr: {

        borderBottom: '1px solid #222'

    },

    td: {

        padding: '15px',

        verticalAlign: 'middle'

    },

    form: {

        maxWidth: '750px',

        display: 'flex',

        flexDirection: 'column',

        gap: '20px',

        marginTop: '25px',

        padding: '25px',

        backgroundColor: '#111',

        border: '1px solid #333',

        borderRadius: '8px'

    },

    label: {

        display: 'flex',

        flexDirection: 'column',

        gap: '8px',

        color: '#ddd',

        fontSize: '14px'

    },

    input: {

        width: '100%',

        boxSizing: 'border-box',

        backgroundColor: '#1a1a1a',

        color: '#fff',

        border: '1px solid #444',

        borderRadius: '4px',

        padding: '12px',

        fontSize: '15px'

    },

    textarea: {

        width: '100%',

        boxSizing: 'border-box',

        backgroundColor: '#1a1a1a',

        color: '#fff',

        border: '1px solid #444',

        borderRadius: '4px',

        padding: '12px',

        fontSize: '15px',

        fontFamily: 'inherit',

        resize: 'vertical'

    },

    formGrid: {

        display: 'grid',

        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',

        gap: '20px'

    },

    formActions: {

        display: 'flex',

        gap: '12px',

        flexWrap: 'wrap'

    },

    cancelBtn: {

        backgroundColor: '#333',

        color: '#fff',

        border: '1px solid #555',

        padding: '12px 20px',

        borderRadius: '4px',

        cursor: 'pointer'

    },

    actionButtons: {

        display: 'flex',

        gap: '8px',

        flexWrap: 'wrap'

    },

    editBtn: {

        backgroundColor: '#2563eb',

        color: '#fff',

        border: 'none',

        borderRadius: '4px',

        padding: '8px 12px',

        cursor: 'pointer'

    },

    deleteBtn: {

        backgroundColor: '#dc2626',

        color: '#fff',

        border: 'none',

        borderRadius: '4px',

        padding: '8px 12px',

        cursor: 'pointer'

    },

    errorBox: {

        backgroundColor: '#451a1a',

        border: '1px solid #b91c1c',

        color: '#fecaca',

        padding: '12px 16px',

        borderRadius: '6px',

        marginBottom: '20px'

    },

    successBox: {

        backgroundColor: '#14351f',

        border: '1px solid #238636',

        color: '#bbf7d0',

        padding: '12px 16px',

        borderRadius: '6px',

        marginBottom: '20px'

    }

};

export default SellerDashboard;
