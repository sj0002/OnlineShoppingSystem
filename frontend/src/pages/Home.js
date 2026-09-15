import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/products'
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);

            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Unable to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    return (
        <div style={styles.page}>

            <section style={styles.hero}>
                <h1>Welcome to Online Shopping</h1>
                <p>
                    Discover quality products at great prices.
                </p>
            </section>


            <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    Shop by Category
                </h2>

                <div style={styles.categoryGrid}>

                    <div style={styles.categoryCard}>
                        <span>👕</span>
                        <h3>Apparel</h3>
                    </div>

                    <div style={styles.categoryCard}>
                        <span>👜</span>
                        <h3>Travel & Bags</h3>
                    </div>

                    <div style={styles.categoryCard}>
                        <span>💻</span>
                        <h3>Tech Accessories</h3>
                    </div>

                    <div style={styles.categoryCard}>
                        <span>👟</span>
                        <h3>Footwear</h3>
                    </div>

                </div>

            </section>


            <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    New Arrivals
                </h2>

                {loading && (
                    <p style={styles.message}>
                        Loading products...
                    </p>
                )}

                {error && (
                    <p style={styles.error}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div style={styles.productGrid}>

                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                description={product.description}
                                imageUrl={product.imageUrl}
                            />
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}


const styles = {
    page: {
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '0 20px',
    },

    hero: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 0 40px',
    },

    heroTitle: {
        fontSize: '40px',
    },

    section: {
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '40px',
    },

    sectionTitle: {
        fontSize: '28px',
        borderBottom: '1px solid #333',
        paddingBottom: '15px',
        marginBottom: '25px',
    },

    categoryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '25px',
    },

    categoryCard: {
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '8px',
        padding: '35px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontSize: '18px',
    },

    productGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '25px',
    },

    message: {
        color: '#aaa',
    },

    error: {
        color: '#ff6b6b',
    },
};

export default Home;