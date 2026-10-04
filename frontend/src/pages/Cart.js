import React, { useEffect, useState } from 'react';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const savedCart =
            JSON.parse(localStorage.getItem('cart')) || [];

        setCartItems(savedCart);
    };

    const updateCart = (updatedCart) => {
        setCartItems(updatedCart);

        localStorage.setItem(
            'cart',
            JSON.stringify(updatedCart)
        );

        window.dispatchEvent(new Event('cartUpdated'));
    };

    const increaseQuantity = (id) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1
                }
                : item
        );

        updateCart(updatedCart);
    };

    const decreaseQuantity = (id) => {
        const updatedCart = cartItems
            .map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }
                    : item
            )
            .filter((item) => item.quantity > 0);

        updateCart(updatedCart);
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(
            (item) => item.id !== id
        );

        updateCart(updatedCart);
    };

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const shipping = cartItems.length > 0 ? 400 : 0;

    const total = subtotal + shipping;

    return (
        <div style={styles.container}>

            <h2 style={styles.pageTitle}>
                Your Shopping Cart
            </h2>

            {cartItems.length === 0 ? (

                <div style={styles.emptyCart}>
                    <h3>Your cart is empty</h3>
                    <p>
                        Add some products to your cart to continue shopping.
                    </p>
                </div>

            ) : (

                <div style={styles.cartLayout}>

                    {/* LEFT SIDE */}
                    <div style={styles.itemsSection}>

                        {cartItems.map((item) => (

                            <div
                                key={item.id}
                                style={styles.cartItem}
                            >

                                {/* Image */}
                                <div style={styles.itemImage}>
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={styles.cartImage}
                                        />
                                    ) : (
                                        'IMG'
                                    )}
                                </div>

                                {/* Details */}
                                <div style={styles.itemDetails}>

                                    <h4 style={styles.itemName}>
                                        {item.name}
                                    </h4>

                                    <p style={styles.itemCategory}>
                                        {item.category}
                                    </p>

                                    <p style={styles.singlePrice}>
                                        Rs. {item.price}
                                    </p>

                                </div>

                                {/* Quantity */}
                                <div style={styles.quantitySection}>

                                    <button
                                        style={styles.quantityBtn}
                                        onClick={() =>
                                            decreaseQuantity(item.id)
                                        }
                                    >
                                        −
                                    </button>

                                    <span style={styles.quantity}>
                                        {item.quantity}
                                    </span>

                                    <button
                                        style={styles.quantityBtn}
                                        onClick={() =>
                                            increaseQuantity(item.id)
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                {/* Total */}
                                <div style={styles.itemPrice}>
                                    Rs. {item.price * item.quantity}
                                </div>

                                {/* Remove */}
                                <button
                                    style={styles.removeBtn}
                                    onClick={() =>
                                        removeItem(item.id)
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        ))}

                    </div>

                    {/* RIGHT SIDE */}
                    <div style={styles.checkoutSection}>

                        <h3 style={styles.summaryTitle}>
                            Order Summary
                        </h3>

                        <div style={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>
                                Rs. {subtotal}
                            </span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>
                                Rs. {shipping}
                            </span>
                        </div>

                        <div style={styles.totalRow}>
                            <span>Total</span>
                            <span>
                                Rs. {total}
                            </span>
                        </div>

                        <hr style={styles.divider} />

                        <h3 style={styles.summaryTitle}>
                            Shipping Address
                        </h3>

                        <form style={styles.checkoutForm}>

                            <input
                                type="text"
                                placeholder="Full Name"
                                style={styles.input}
                                required
                            />

                            <input
                                type="text"
                                placeholder="Street Address"
                                style={styles.input}
                                required
                            />

                            <div style={styles.rowInputs}>

                                <input
                                    type="text"
                                    placeholder="City"
                                    style={styles.inputHalf}
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    style={styles.inputHalf}
                                    required
                                />

                            </div>

                            <input
                                type="text"
                                placeholder="Phone Number"
                                style={styles.input}
                                required
                            />

                            <h3
                                style={{
                                    ...styles.summaryTitle,
                                    marginTop: '20px',
                                    marginBottom: '15px'
                                }}
                            >
                                Payment Method
                            </h3>

                            <div style={styles.paymentMethods}>

                                <label style={styles.radioLabel}>

                                    <input
                                        type="radio"
                                        value="COD"
                                        checked={
                                            paymentMethod === 'COD'
                                        }
                                        onChange={() =>
                                            setPaymentMethod('COD')
                                        }
                                        style={styles.radio}
                                    />

                                    Cash on Delivery

                                </label>

                                <label style={styles.radioLabel}>

                                    <input
                                        type="radio"
                                        value="Card"
                                        checked={
                                            paymentMethod === 'Card'
                                        }
                                        onChange={() =>
                                            setPaymentMethod('Card')
                                        }
                                        style={styles.radio}
                                    />

                                    Card / Bank Transfer

                                </label>

                            </div>

                            <button
                                type="button"
                                style={styles.checkoutBtn}
                            >
                                Place Order
                            </button>

                        </form>

                    </div>

                </div>

            )}

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

    emptyCart: {
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '50px',
        textAlign: 'center',
    },

    cartLayout: {
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
    },

    itemsSection: {
        flex: '2',
        minWidth: '500px',
    },

    cartItem: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#111',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #222',
        gap: '15px',
    },

    itemImage: {
        width: '80px',
        height: '80px',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        color: '#555',
        overflow: 'hidden',
        flexShrink: 0,
    },

    cartImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },

    itemDetails: {
        flex: '1',
    },

    itemName: {
        margin: '0 0 5px 0',
        fontSize: '18px',
    },

    itemCategory: {
        margin: '0 0 5px 0',
        color: '#888',
        fontSize: '14px',
    },

    singlePrice: {
        margin: 0,
        color: '#aaa',
        fontSize: '14px',
    },

    quantitySection: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },

    quantityBtn: {
        width: '30px',
        height: '30px',
        backgroundColor: '#222',
        color: '#fff',
        border: '1px solid #444',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px',
    },

    quantity: {
        minWidth: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    itemPrice: {
        fontSize: '17px',
        fontWeight: 'bold',
        minWidth: '100px',
        textAlign: 'right',
    },

    removeBtn: {
        backgroundColor: 'transparent',
        color: '#ff6b6b',
        border: '1px solid #ff6b6b',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
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