import { createContext, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../hooks/useWishlist';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const { products } = useProducts();
    const { wishlist, addItemToWishlist, removeItemFromWishlist, clearAllWishlist } = useWishlist(token);

    const value = {
        products,
        wishlist,
        addItemToWishlist,
        removeItemFromWishlist,
        clearAllWishlist,
        currency,
        setToken,
        token,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
