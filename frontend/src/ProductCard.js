import React from 'react';

function ProductCard({ name, price, description }) {
    return (
        <div style={styles.card}>
            <div style={styles.imagePlaceholder}>IMG</div>
            <div style={styles.info}>
                <h3 style={styles.title}>{name}</h3>
                <p style={styles.description}>{description}</p>
                <p style={styles.price}>Rs. {price}</p>
                <button style={styles.button}>Add to Cart</button>
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#111111',
        border: '1px solid #222',
        borderRadius: '8px',
        width: '270px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
    },
    imagePlaceholder: {
        height: '200px',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '24px',
    },
    info: {
        padding: '20px',
    },
    title: {
        margin: '0 0 10px 0',
        fontSize: '18px',
        color: '#fff',
    },
    description: {
        fontSize: '13px',
        color: '#888',
        marginBottom: '15px',
        height: '40px',
    },
    price: {
        fontWeight: 'bold',
        fontSize: '18px',
        color: '#fff',
        marginBottom: '15px',
    },
    button: {
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        padding: '12px',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
};

export default ProductCard;