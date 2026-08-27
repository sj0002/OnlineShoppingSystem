import React from 'react';
import ProductCard from '../ProductCard';

function Home() {
    return (
        <main style={styles.mainContainer}>

            {/* 1. Hero Banner Section */}
            <div style={styles.heroBanner}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>GEAR UP FOR PERFORMANCE</h1>
                    <p style={styles.heroSub}>Discover the new collection of heavy-duty apparel and functional accessories.</p>
                    <button style={styles.heroBtn}>SHOP NOW</button>
                </div>
            </div>

            {/* 2. Quick Category Row */}
            <div style={styles.categorySection}>
                <h3 style={styles.sectionTitle}>Shop by Category</h3>
                <div style={styles.categoryRow}>
                    <div style={styles.categoryCard}>👕 Apparel</div>
                    <div style={styles.categoryCard}>🎒 Travel & Bags</div>
                    <div style={styles.categoryCard}>💻 Tech Accessories</div>
                    <div style={styles.categoryCard}>👟 Footwear</div>
                </div>
            </div>

            {/* 3. Main Product Grid */}
            <div style={styles.productSection}>
                <h3 style={styles.sectionTitle}>New Arrivals</h3>
                <div style={styles.productGrid}>
                    {/* We are passing dummy data into the ProductCard components */}
                    <ProductCard
                        name="Heavy Textured T-Shirt"
                        price="3500"
                        description="Neutral colors, heavy cotton."
                    />
                    <ProductCard
                        name="Hybrid Duffel Bag"
                        price="8500"
                        description="All-black, water-resistant travel gear."
                    />
                    <ProductCard
                        name="Aluminum Laptop Stand"
                        price="4200"
                        description="Adjustable, functional desktop accessory."
                    />
                    <ProductCard
                        name="Speed Gaming Mousepad"
                        price="2800"
                        description="Large rubber base, low friction."
                    />
                </div>
            </div>

        </main>
    );
}

const styles = {
    mainContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        color: '#fff',
    },
    heroBanner: {
        height: '400px',
        backgroundColor: '#161616',
        backgroundImage: 'linear-gradient(45deg, #0a0a0a 25%, #161616 25%, #161616 50%, #0a0a0a 50%, #0a0a0a 75%, #161616 75%, #161616 100%)',
        backgroundSize: '40px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 50px',
        marginBottom: '40px',
        borderRadius: '8px',
        border: '1px solid #333',
    },
    heroContent: {
        maxWidth: '500px',
    },
    heroTitle: {
        fontSize: '42px',
        margin: '0 0 15px 0',
        fontWeight: '900',
        letterSpacing: '1px',
    },
    heroSub: {
        fontSize: '18px',
        color: '#aaa',
        marginBottom: '25px',
        lineHeight: '1.5',
    },
    heroBtn: {
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        padding: '15px 30px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    categorySection: {
        marginBottom: '40px',
    },
    sectionTitle: {
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
        marginBottom: '20px',
        fontSize: '22px',
    },
    categoryRow: {
        display: 'flex',
        gap: '20px',
        overflowX: 'auto',
    },
    categoryCard: {
        flex: '1',
        minWidth: '200px',
        backgroundColor: '#111',
        border: '1px solid #222',
        padding: '30px 20px',
        textAlign: 'center',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    productSection: {
        marginBottom: '40px',
    },
    productGrid: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    }
};

export default Home;