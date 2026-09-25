import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../ProductCard';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError('');

            try {
                // Query එකක් නැත්නම් ඔක්කොම products, තියෙනවා නම් ඒවා filter කරලා
                const url = query.trim()
                    ? `http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`
                    : `http://localhost:5000/api/products/search`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to search products');
                }

                const data = await response.json();
                setProducts(data);

            } catch (error) {
                console.error('Error searching products:', error);
                setError('Unable to load search results');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

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
                    {query.trim() ? (
                        <>Search Results for: <span style={styles.highlight}>"{query}"</span></>
                    ) : (
                        <>All Products</>
                    )}
                </h2>

                {/* Loading State */}
                {loading && (
                    <p style={styles.message}>Searching products...</p>
                )}

                {/* Error State */}
                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {/* No Products Found */}
                {!loading && !error && products.length === 0 && (
                    <p style={styles.noResults}>
                        No products found for "{query}"
                    </p>
                )}

                {/* Product Grid */}
                {!loading && !error && products.length > 0 && (
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
    },
    message: {
        color: '#aaa',
        fontSize: '18px',
    },
    error: {
        color: '#ff6b6b',
        fontSize: '18px',
    },
    noResults: {
        color: '#aaa',
        fontSize: '18px',
    },
};

export default SearchResults;