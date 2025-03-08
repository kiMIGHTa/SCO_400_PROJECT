import React, { useState, useEffect, useContext } from 'react'
import './cart.css'
import { food_list } from '../../../downloads/assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
const Cart = () => {

  const { cartItems, handleRemoveFromCart, getTotalCartAmount, foodList } = useContext(StoreContext);

  const navigate = useNavigate();


  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item) => {
          if (cartItems[item.id] > 0) {
            return (
              <React.Fragment key={item.id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={item.image} alt='' />
                  <p>{item.name}</p>
                  <p>Ksh {item.price}</p>
                  <p>{cartItems[item.id]}</p>
                  <p>Ksh {item.price * cartItems[item.id]}</p>
                  <p className='cross' onClick={() => handleRemoveFromCart(item.id)}>x</p>
                </div>
                <hr />
                </React.Fragment>
            )

          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button onClick={() => navigate('/placeOrder')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promo">
          <div>
            <p>If you have a promo code, enter it here.</p>
            <div className="cart-promo-input">
              <input type="text" placeholder='Enter promo code here' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart
