import { createContext, useState, useEffect, useCallback } from "react";
import { getFoodList } from "../apiUtils/food/index"; // API function to fetch food items
import { getCart, addToCart, updateCartItem, removeFromCart } from "../apiUtils/cart/index"; // API functions for cart

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});

    // Fetch food items from backend
    useEffect(() => {
        const fetchFood = async () => {
            try {
                const data = await getFoodList();
                setFoodList(data);
            } catch (error) {
                console.error("Error fetching food items:", error);
            }
        };

        fetchFood();
    }, []);

    // Fetch cart data from backend
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartData = await getCart();
                console.log("Cart Data:", cartData); // Debugging response

                // Ensure the cart is mapped correctly
                const formattedCart = {};
                cartData.items.forEach(item => {
                    if (item.food_item && item.food_item.id) {
                        formattedCart[item.food_item.id] = item.quantity;
                    }
                });

                setCartItems(formattedCart);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, []);


    // Add item to cart
    const handleAddToCart = async (itemId) => {
        try {
            const currentQty = cartItems[itemId] || 0;
            const newQty = currentQty + 1;

            if (currentQty === 0) {
                await addToCart(itemId, 1);
            } else {
                await updateCartItem(itemId, newQty);
            }

            setCartItems((prev) => ({ ...prev, [itemId]: newQty }))
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Remove item from cart
    const handleRemoveFromCart = async (itemId) => {
        try {
            const currentQty = cartItems[itemId];
            if (!currentQty) return;

            if (currentQty === 1) {
                await removeFromCart(itemId);
                setCartItems((prev) => {
                    const updatedCart = { ...prev };
                    delete updatedCart[itemId];
                    return updatedCart;
                });
            } else {
                await updateCartItem(itemId, currentQty - 1);
                setCartItems((prev) => ({ ...prev, [itemId]: currentQty - 1 }));
                console.log(cartItems)
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    // Calculate total cart amount
    const getTotalCartAmount = useCallback(() => {
        return Object.entries(cartItems).reduce((total, [id, quantity]) => {
            const item = foodList.find(food => food.id === Number(id));
            return item ? total + item.price * quantity : total;
        }, 0);
    }, [cartItems, foodList]);  // Dependencies: runs only when cartItems or foodList changes


    const contextValue = {
        foodList,
        cartItems,
        handleAddToCart,
        handleRemoveFromCart,
        getTotalCartAmount
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
