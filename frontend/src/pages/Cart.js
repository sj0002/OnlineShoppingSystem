// frontend/src/pages/Cart.js
import React, { useState } from 'react';

function Cart() {
    const [paymentMethod, setPaymentMethod] = useState('COD');

    return (
        <div style={styles.container}>
            <h2 style={styles.pageTitle}>Your Shopping Cart</h2>

            <div style={styles.cartLayout}>
                {/* Left Side: Cart Items */}
                <div style={styles.itemsSection}>

                    {/* Sample Cart Item 1 */}
                    <div style={styles.cartItem}>
                        <div style={styles.itemImage}>IMG</div>
                        <div style={styles.itemDetails}>
                            <h4 style={styles.itemName}>Hybrid Duffel Bag</h4>
                            <p style={styles.itemCategory}>Travel & Bags</p>
                        </div>
                        <div style={styles.itemPrice}>Rs. 8500</div>
                        <div style={styles.itemActions}>
                            <button style={styles.removeBtn}>Remove</button>
                        </div>
                    </div>

                    {/* Sample Cart Item 2 */}
                    <div style={styles.cartItem}>
                        <div style={styles.itemImage}>IMG</div>
                        <div style={styles.itemDetails}>
                            <h4 style={styles.itemName}>Heavy Textured T-Shirt</h4>
                            <p style={styles.itemCategory}>Apparel</p>
                        </div>
                        <div style={styles.itemPrice}>Rs. 3500</div>
                        <div style={styles.itemActions}>
                            <button style={styles.removeBtn}>Remove</button>
                        </div>
                    </div>

                </div>

                {/* Right Side: Checkout Summary & Form */}
                <div style={styles.checkoutSection}>
                    <h3 style={styles.summaryTitle}>Order Summary</h3>

                    <div style={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>Rs. 12000</span>
                    </div>
                    <div style={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>Rs. 400</span>
                    </div>
                    <div style={styles.totalRow}>
                        <span>Total</span>
                        <span>Rs. 12400</span>
                    </div>

                    <hr style={styles.divider} />

                    <h3 style={styles.summaryTitle}>Shipping Address</h3>
                    <form style={styles.checkoutForm}>
                        <input type="text" placeholder="Full Name" style={styles.input} required />
                        <input type="text" placeholder="Street Address" style={styles.input} required />
                        <div style={styles.rowInputs}>
                            <input type="text" placeholder="City" style={styles.inputHalf} required />
                            <input type="text" placeholder="Postal Code" style={styles.inputHalf} required />
                        </div>
                        <input type="text" placeholder="Phone Number" style={styles.input} required />

                        <h3 style={styles.summaryTitle} style={{ marginTop: '20px', marginBottom: '15px' }}>Payment Method</h3>

                        <div style={styles.paymentMethods}>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => setPaymentMethod('COD')}
                                    style={styles.radio}
                                />
                                Cash on Delivery
                            </label>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    value="Card"
                                    checked={paymentMethod === 'Card'}
                                    onChange={() => setPaymentMethod('Card')}
                                    style={styles.radio}
                                />
                                Card / Bank Transfer
                            </label>
                        </div>

                        <button type="button" style={styles.checkoutBtn}>Place Order</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        color: '#fff',
        minHeight: '80vh',
    },
    pageTitle: {
        fontSize: '28px',
        marginBottom: '30px',
        borderBottom: '1px solid #333',
        paddingBottom: '15px',
    },
    cartLayout: {
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
    },
    itemsSection: {
        flex: '2',
        minWidth: '300px',
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#111',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #222',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        marginRight: '20px',
        color: '#555',
    },
    itemDetails: {
        flex: '1',
    },
    itemName: {
        margin: '0 0 5px 0',
        fontSize: '18px',
    },
    itemCategory: {
        margin: '0',
        color: '#888',
        fontSize: '14px',
    },
    itemPrice: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginRight: '20px',
    },
    itemActions: {
        marginLeft: 'auto',
    },
    removeBtn: {
        backgroundColor: 'transparent',
        color: '#ff6b6b',
        border: '1px solid #ff6b6b',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    checkoutSection: {
        flex: '1',
        minWidth: '300px',
        backgroundColor: '#111',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #333',
        height: 'fit-content',
    },
    summaryTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        color: '#aaa',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#fff',
    },
    divider: {
        borderColor: '#333',
        margin: '25px 0',
    },
    checkoutForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    input: {
        padding: '12px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
    },
    rowInputs: {
        display: 'flex',
        gap: '15px',
    },
    inputHalf: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
    },
    paymentMethods: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px',
    },
    radioLabel: {
        cursor: 'pointer',
        fontSize: '15px',
        color: '#ccc',
        display: 'flex',
        alignItems: 'center',
    },
    radio: {
        marginRight: '10px',
    },
    checkoutBtn: {
        padding: '15px',
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        borderRadius: '4px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textTransform: 'uppercase',
    }
};

export default Cart;