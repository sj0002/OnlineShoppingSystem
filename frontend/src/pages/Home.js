import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

function Home() {
	const [products, setProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const categories = [
		{ label: 'All Categories', value: 'All' },
		{ label: 'Apparel', value: 'Apparel' },
		{ label: 'Travel & Bags', value: 'Travel & Bags' },
		{ label: 'Electronics', value: 'Electronics' },
		{ label: 'Footwear', value: 'Footwear' },
	];

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
		<main style={styles.container}>
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
		maxWidth: '1400px',
		margin: '0 auto',
		padding: '40px 20px',
		color: '#fff',
		minHeight: '80vh',
	},
	title: {
		fontSize: '36px',
		fontWeight: 'normal',
		margin: '0 0 40px 0',
	},
	categorySection: {
		marginBottom: '50px',
	},
	sectionHeading: {
		fontSize: '28px',
		fontWeight: 'normal',
		margin: '0 0 25px 0',
	},
	categoryGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
		gap: '15px',
	},
	categoryCard: {
		backgroundColor: '#111111',
		border: '2px solid #333333',
		borderRadius: '8px',
		color: '#fff',
		cursor: 'pointer',
		fontSize: '16px',
		minHeight: '90px',
		padding: '20px 12px',
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
};

export default Home;
