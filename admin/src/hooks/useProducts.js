import { useState, useEffect } from 'react';
import { getProducts } from '../api/productApi';
import { toast } from 'react-toastify';

export const useProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data.reverse());
            } catch (error) {
                toast.error('Failed to fetch products');
            }
        };

        fetchProducts();
    }, []);

    return { products };
};
