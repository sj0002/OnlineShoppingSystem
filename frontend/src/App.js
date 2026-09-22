import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Navbar from './Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div style={styles.appContainer}>

        {/* The Navbar stays outside the Routes so it always shows on top */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* The Routes determine which page content to load below the Navbar */}
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/search" element={<SearchResults />} />

          <Route path="/login" element={<Auth />} />

          <Route path="/seller" element={<SellerDashboard />} />

          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/cart" element={<Cart />} />

          {/* US-06: View Product Details */}
          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

        </Routes>

      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    minHeight: '100vh',
  }
};

export default App;