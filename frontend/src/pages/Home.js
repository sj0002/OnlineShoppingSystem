import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import categories from '../categories';

function Home({ selectedCategory, setSelectedCategory }) {
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
					throw new Error('Unable to load products');
				}

				setProducts(await response.json());
			} catch (fetchError) {
				console.error('Error fetching products:', fetchError);
				setError('Unable to load products');
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const filteredProducts = selectedCategory === 'All'
		? products
		: products.filter((product) => product.category === selectedCategory);

	const heading = selectedCategory === 'All'
		? 'New Arrivals'
		: `${selectedCategory} Products`;

	return (
		<main className="store-page" style={styles.container}>
			<h1 style={styles.title}>Discover Our Products</h1>

			<section style={styles.categorySection}>
				<h2 style={styles.sectionHeading}>Shop by Category</h2>
				<div style={styles.categoryGrid}>
					{categories.map((category) => (
						<button
							key={category.value}
							type="button"
							onClick={() => setSelectedCategory(category.value)}
							style={{
								...styles.categoryCard,
								borderColor: selectedCategory === category.value
									? '#ffffff'
									: '#333333',
							}}
						>
							{category.label}
						</button>
					))}
				</div>
			</section>

			<section>
				<h2 style={styles.sectionHeading}>{heading}</h2>

				{loading && (
					<p style={styles.message}>Loading products...</p>
				)}

				{!loading && error && (
					<p style={styles.error}>{error}</p>
				)}

				{!loading && !error && filteredProducts.length === 0 && (
					<p style={styles.message}>
						No products available in this category.
					</p>
				)}

				{!loading && !error && filteredProducts.length > 0 && (
					<div style={styles.productGrid}>
						{filteredProducts.map((product) => (
							<ProductCard
								key={product._id}
								id={product._id}
								name={product.name}
								price={product.price}
								description={product.description}
								category={product.category}
								imageUrl={product.imageUrl}
							/>
						))}
					</div>
				)}
			</section>
		</main>
	);
}

const styles = {
	container: {
		maxWidth: '1320px',
		margin: '0 auto',
		padding: '64px 24px',
		color: '#f3f7f8',
		minHeight: '80vh',
	},
	title: {
		fontSize: 'clamp(34px, 5vw, 64px)',
		lineHeight: 1,
		fontWeight: '800',
		letterSpacing: '-2px',
		margin: '0 0 48px 0',
		maxWidth: '680px',
	},
	categorySection: {
		marginBottom: '62px',
	},
	sectionHeading: {
		fontSize: '22px',
		fontWeight: '700',
		margin: '0 0 20px 0',
		color: '#dce8eb',
	},
	categoryGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
		gap: '12px',
	},
	categoryCard: {
		backgroundColor: '#111a20',
		border: '1px solid #293640',
		borderRadius: '12px',
		color: '#c8d7dc',
		cursor: 'pointer',
		fontSize: '16px',
		minHeight: '76px',
		padding: '18px 12px',
	},
	productGrid: {
		display: 'flex',
		gap: '20px',
		flexWrap: 'wrap',
	},
	message: {
		color: '#91a2ad',
		fontSize: '18px',
	},
	error: {
		color: '#ff6b6b',
		fontSize: '18px',
	},
};

export default Home;
