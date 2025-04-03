import { useState, useEffect } from 'react';
import { getCategories } from '../api/categoryApi';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return categories;
};
