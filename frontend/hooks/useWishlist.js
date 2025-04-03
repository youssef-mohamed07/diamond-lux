import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist, sendWishlistEmail, updateWishlistItem } from '../api/wishlistApi';
import { toast } from 'react-toastify';

const emailWishlist = async (email) => {
    try {
        await sendWishlistEmail(email);
        toast.success('Wishlist sent to email!');
    } catch (error) {
        toast.error('Failed to send wishlist');
    }
};

export const useWishlist = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await axios.get(`${backendUrl}/api/wishlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setWishlist(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [token, backendUrl]);

    const addItemToWishlist = async (productId, quantity = 1) => {
        if (!token) {
            throw new Error("User not authenticated");
        }
        
        try {
            console.log("Adding to wishlist:", productId, quantity);
            const response = await axios.post(
                `${backendUrl}/api/wishlist`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            console.log("Wishlist response:", response.data);
            setWishlist(response.data);
            return response.data;
        } catch (error) {
            console.error("Error adding item to wishlist:", error);
            throw error;
        }
    };

    const removeItemFromWishlist = async (productId) => {
        if (!token) {
            throw new Error("User not authenticated");
        }
        
        try {
            const response = await axios.delete(
                `${backendUrl}/api/wishlist/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setWishlist(response.data);
            return response.data;
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
            throw error;
        }
    };

    const clearAllWishlist = async () => {
        if (!token) {
            throw new Error("User not authenticated");
        }
        
        try {
            const response = await axios.delete(
                `${backendUrl}/api/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setWishlist(response.data);
            return response.data;
        } catch (error) {
            console.error("Error clearing wishlist:", error);
            throw error;
        }
    };

    const updateWishlistItemQuantity = async (productId, quantity) => {
        if (!token) {
            throw new Error("User not authenticated");
        }
        
        try {
            const response = await axios.patch(
                `${backendUrl}/api/wishlist/${productId}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setWishlist(response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating wishlist item quantity:", error);
            throw error;
        }
    };

    return {
        wishlist,
        loading,
        addItemToWishlist,
        removeItemFromWishlist,
        clearAllWishlist,
        updateWishlistItemQuantity,
    };
};
