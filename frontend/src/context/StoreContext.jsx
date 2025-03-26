import { createContext, useState, useEffect, useCallback } from "react";
import { getFoodList } from "../apiUtils/food/index"; // API function to fetch food items
import { getCart, addToCart, updateCartItem, removeFromCart } from "../apiUtils/cart/index"; // API functions for cart
import { createOrder } from "../apiUtils/order/index"; // API function

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [cartItemIds, setCartItemIds] = useState({}); // Track cart item IDs
    const [cartId, setCartId] = useState(null); // Store cart ID


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
                setCartId(cartData.id);

                // Map both quantities and cart item IDs
                const formattedCart = {};
                const formattedCartItemIds = {};
                cartData.items.forEach(item => {
                    if (item.food_item && item.food_item.id) {
                        formattedCart[item.food_item.id] = item.quantity;
                        formattedCartItemIds[item.food_item.id] = item.id;
                    }
                });

                setCartItems(formattedCart);
                setCartItemIds(formattedCartItemIds);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, [cartId]);


    // Add item to cart
    const handleAddToCart = async (itemId) => {
        try {
            const currentQty = cartItems[itemId] || 0;
            const newQty = currentQty + 1;

            if (currentQty === 0) {
                const response = await addToCart(itemId, 1);
                setCartItemIds(prev => ({ ...prev, [itemId]: response.id }));
            } else {
                await updateCartItem(cartItemIds[itemId], newQty);
            }

            setCartItems((prev) => ({ ...prev, [itemId]: newQty }));
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
                await removeFromCart(cartItemIds[itemId]);
                setCartItems((prev) => {
                    const updatedCart = { ...prev };
                    delete updatedCart[itemId];
                    return updatedCart;
                });
                setCartItemIds((prev) => {
                    const updatedIds = { ...prev };
                    delete updatedIds[itemId];
                    return updatedIds;
                });
            } else {
                await updateCartItem(cartItemIds[itemId], currentQty - 1);
                setCartItems((prev) => ({ ...prev, [itemId]: currentQty - 1 }));
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

    // Handle checkout
    const handleCheckout = async (orderData) => {
        if (!cartId) {
            alert("Cart is empty!");
            return;
        }

        try {

            // Send order details to the backend
            const response = await createOrder({
                cart: cartId,
                total_price: orderData.totalPrice,
                first_name: orderData.firstName,
                last_name: orderData.lastName,
                email: orderData.email,
                street: orderData.street,
                region: orderData.region,
                city: orderData.city,
                phone_number: Number(orderData.phoneNumber),
            });
            alert("A payment prompt will be sent to your mobile phone!")
            console.log("Order:", response.data)

            if (response && response.data.payment_status === "successful") {
                alert("Payment has been made! Order placed successfully!");
                return response.data
            } else {
                alert("Order creation failed. Try again.");
            }
        } catch (error) {
            console.log("Error placing order:", error);
            alert("Error processing order. Try again.");
        }
    };

    const contextValue = {
        foodList,
        cartItems,
        handleAddToCart,
        handleRemoveFromCart,
        getTotalCartAmount,
        handleCheckout
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
