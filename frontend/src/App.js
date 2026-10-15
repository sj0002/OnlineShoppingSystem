import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import CustomerDashboard from './pages/CustomerDashboard';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <Router>
      <div style={styles.appContainer}>

        <Routes>
          <Route element={<MainLayout
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />}>
            <Route index element={<Home selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="login" element={<Auth />} />
            <Route path="profile" element={<CustomerDashboard />} />
            <Route path="seller" element={<SellerDashboard />} />
            <Route path="cart" element={<Cart />} />
            <Route path="products/:id" element={<ProductDetails />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

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