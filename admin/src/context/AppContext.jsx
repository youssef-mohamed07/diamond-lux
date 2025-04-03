import { createContext } from 'react';
import { useProducts } from '../hooks/useProducts';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const { products } = useProducts();

    const value = { products };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
