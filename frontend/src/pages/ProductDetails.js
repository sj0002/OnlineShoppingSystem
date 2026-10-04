import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/products/${id}`
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Product not found');
                    } else {
                        setError('Unable to fetch product details');
                    }

                    return;
                }

                const data = await response.json();
                setProduct(data);

            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Unable to connect to the server');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        const existingCart =
            JSON.parse(localStorage.getItem('cart')) || [];

        const existingItem = existingCart.find(
            (item) => item.id === product._id
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = existingCart.map((item) =>
                item.id === product._id
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            );
        } else {
            updatedCart = [
                ...existingCart,
                {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    imageUrl: product.imageUrl,
                    quantity: 1
                }
            ];
        }

        localStorage.setItem(
            'cart',
            JSON.stringify(updatedCart)
        );

        window.dispatchEvent(new Event('cartUpdated'));

        alert(`${product.name} added to cart!`);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <p style={styles.message}>Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <p style={styles.error}>{error}</p>

                <button
                    style={styles.backButton}
                    onClick={() => navigate('/')}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            <button
                style={styles.backButton}
                onClick={() => navigate('/')}
            >
                ← Back to Products
            </button>

            <div style={styles.productDetails}>

                <div style={styles.imageSection}>
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={styles.productImage}
                        />
                    ) : (
                        <div style={styles.imagePlaceholder}>
                            No Image
                        </div>
                    )}
                </div>

                <div style={styles.infoSection}>

                    <h1 style={styles.title}>
                        {product.name}
                    </h1>

                    <p style={styles.price}>
                        Rs. {product.price}
                    </p>

                    <div style={styles.divider}></div>

                    <h3 style={styles.heading}>
                        Description
                    </h3>

                    <p style={styles.description}>
                        {product.description}
                    </p>

                    <div style={styles.detailRow}>
                        <strong>Category:</strong>
                        <span>{product.category}</span>
                    </div>

                    <div style={styles.detailRow}>
                        <strong>Stock:</strong>
                        <span>{product.stockQuantity}</span>
                    </div>

                    {product.seller && (
                        <div style={styles.detailRow}>
                            <strong>Seller:</strong>
                            <span>{product.seller.name}</span>
                        </div>
                    )}

                    <button
                        style={styles.cartButton}
                        onClick={handleAddToCart}
                    >
                        ADD TO CART
                    </button>

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
    },

    productDetails: {
        display: 'flex',
        gap: '50px',
        marginTop: '30px',
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '10px',
        padding: '30px',
    },

    imageSection: {
        width: '50%',
        height: '500px',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        overflow: 'hidden',
    },

    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },

    imagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#777',
        fontSize: '24px',
    },

    infoSection: {
        flex: 1,
        padding: '10px',
    },

    title: {
        fontSize: '36px',
        marginBottom: '15px',
    },

    price: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '25px',
    },

    divider: {
        borderTop: '1px solid #333',
        marginBottom: '25px',
    },

    heading: {
        fontSize: '20px',
        marginBottom: '10px',
    },

    description: {
        color: '#aaa',
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '30px',
    },

    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #222',
        padding: '15px 0',
        color: '#ddd',
    },

    cartButton: {
        width: '100%',
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '15px',
    },

    backButton: {
        backgroundColor: 'transparent',
        color: '#fff',
        border: '1px solid #444',
        padding: '10px 18px',
        borderRadius: '5px',
        cursor: 'pointer',
    },

    message: {
        color: '#aaa',
        fontSize: '18px',
    },

    error: {
        color: '#ff6b6b',
        fontSize: '20px',
        marginBottom: '20px',
    },
};

export default ProductDetails;