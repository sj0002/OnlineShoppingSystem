import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../ProductCard';

function SearchResults() {
    // This hook grabs the '?query=...' from the URL
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    return (
        <div style={styles.container}>

            {/* Left Sidebar for Filters */}
            <aside style={styles.sidebar}>
                <h3 style={styles.filterHeader}>Filters</h3>

                {/* Category Filter */}
                <div style={styles.filterGroup}>
                    <h4 style={styles.groupTitle}>Category</h4>
                    <label style={styles.checkboxLabel}>
                        <input type="checkbox" style={styles.checkbox} /> Apparel
                    </label>
                    <label style={styles.checkboxLabel}>
                        <input type="checkbox" style={styles.checkbox} /> Travel & Bags
                    </label>
                    <label style={styles.checkboxLabel}>
                        <input type="checkbox" style={styles.checkbox} /> Tech Accessories
                    </label>
                </div>

                {/* Price Range Filter */}
                <div style={styles.filterGroup}>
                    <h4 style={styles.groupTitle}>Price Range (Rs.)</h4>
                    <div style={styles.priceInputs}>
                        <input type="number" placeholder="Min" style={styles.input} />
                        <span style={styles.dash}>-</span>
                        <input type="number" placeholder="Max" style={styles.input} />
                    </div>
                    <button style={styles.filterBtn}>Apply Filter</button>
                </div>
            </aside>

            {/* Main Results Grid */}
            <main style={styles.mainContent}>
                <h2 style={styles.resultsHeader}>
                    Search Results for: <span style={styles.highlight}>"{query}"</span>
                </h2>

                <div style={styles.productGrid}>
                    {/* We will just show one or two products here as a placeholder for the results */}
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
                </div>
            </main>

        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        color: '#fff',
        minHeight: '80vh',
    },
    sidebar: {
        width: '280px',
        paddingRight: '30px',
        borderRight: '1px solid #333',
    },
    filterHeader: {
        fontSize: '24px',
        margin: '0 0 20px 0',
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
    },
    filterGroup: {
        marginBottom: '30px',
    },
    groupTitle: {
        fontSize: '16px',
        marginBottom: '15px',
        color: '#aaa',
    },
    checkboxLabel: {
        display: 'block',
        marginBottom: '10px',
        cursor: 'pointer',
        fontSize: '15px',
    },
    checkbox: {
        marginRight: '10px',
    },
    priceInputs: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '8px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
    },
    dash: {
        color: '#666',
    },
    filterBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    mainContent: {
        flex: '1',
        paddingLeft: '40px',
    },
    resultsHeader: {
        fontSize: '28px',
        margin: '0 0 30px 0',
        fontWeight: 'normal',
    },
    highlight: {
        fontWeight: 'bold',
    },
    productGrid: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    }
};

export default SearchResults;