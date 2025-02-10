import React, { useContext } from 'react'
import './placeOrder.css'
import { StoreContext } from '@/context/StoreContext'
const PlaceOrder = () => {
  const {getTotalCartAmount} = useContext(StoreContext)
  
  return (
    <div>
      <form className='place-order'>
        <div className="place-order-left">
          <p className="title">Delivery details</p>
          <div className="multi-fields">
            <input type="text" placeholder='First Name' />
            <input type="text" placeholder='Last Name' />
          </div>
          <input type="text" placeholder='Email Address' />
          <input type="text" placeholder='Street' />
          <div className="multi-fields">
            <input type="text" placeholder='Region' />
            <input type="text" placeholder='City' />
          </div>
          <input type="text" placeholder="Phone Number" />
        </div>
        <div className="place-order-right">
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
              <p>{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button >PROCEED TO PAYMENT</button>
        </div>
        </div>

      </form>

    </div>
  )
}

export default PlaceOrder
