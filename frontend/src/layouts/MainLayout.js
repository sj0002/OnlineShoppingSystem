import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

function MainLayout({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
    return (
        <>
            <Navbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <Outlet />
        </>
    );
}

export default MainLayout;