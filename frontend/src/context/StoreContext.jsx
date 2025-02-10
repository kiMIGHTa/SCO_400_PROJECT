import { createContext, useState, useEffect } from "react";
import { food_list } from "../../../downloads/assets/frontend_assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    // const [selectedAddress, setSelectedAddress] = useState("home");
    // const [selectedDelivery, setSelectedDelivery] = useState("standard");
    // const [selectedPayment, setSelectedPayment] = useState("mpesa");

    const [cartItems, setCartItems] = useState({})

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev => ({ ...prev, [itemId]: prev[itemId] + 1 })))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        let total = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                total += itemInfo.price * cartItems[item]
            }
        }
        return total
    }

    // useEffect(()=>{
    //     console.log(cartItems);
    // },[cartItems])


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider