import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ id, name, price, description, category, imageUrl }) {
    const navigate = useNavigate();
    const isAdmin = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'))?.role === 'Admin';
        } catch {
            return false;
        }
    })();

    const handleViewDetails = () => {
        navigate(`/products/${id}`);
    };

    const addToCart = (event) => {
        event.stopPropagation();

        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                description,
                category,
                imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        window.dispatchEvent(new Event('cartUpdated'));

        alert(`${name} added to cart!`);
    };

    return (
        <div
            className="product-card"
            style={styles.card}
            onClick={handleViewDetails}
        >
            <div style={styles.imageContainer}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        style={styles.productImage}
                    />
                ) : (
                    <div style={styles.imagePlaceholder}>
                        IMG
                    </div>
                )}
            </div>

            <div style={styles.info}>
                <h3 style={styles.title}>
                    {name}
                </h3>

                <p style={styles.description}>
                    {description}
                </p>

                <p style={styles.price}>
                    Rs. {price}
                </p>

                {!isAdmin && (
                    <button
                        style={styles.button}
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#151d23',
        border: '1px solid #293640',
        borderRadius: '14px',
        width: '270px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },

    imageContainer: {
        width: '100%',
        height: '200px',
        backgroundColor: '#0c1115',
    },

    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },

    imagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#49616d',
        fontWeight: 'bold',
        fontSize: '24px',
    },

    info: {
        padding: '22px',
    },

    title: {
        margin: '0 0 10px 0',
        fontSize: '18px',
        color: '#f3f7f8',
    },

    description: {
        fontSize: '13px',
        color: '#91a2ad',
        marginBottom: '15px',
        height: '40px',
    },

    price: {
        fontWeight: 'bold',
        fontSize: '18px',
        color: '#64b5ff',
        marginBottom: '18px',
    },

    button: {
        backgroundColor: '#35d0bd',
        color: '#071011',
        border: '1px solid #5ce5d5',
        padding: '12px',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
};

export default ProductCard;