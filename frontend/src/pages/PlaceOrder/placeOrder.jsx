import React, { useContext, useState } from 'react'
import './placeOrder.css'
import { StoreContext } from '@/context/StoreContext'
import { useNavigate } from 'react-router-dom';
const PlaceOrder = () => {
  const { getTotalCartAmount, handleCheckout } = useContext(StoreContext)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  // State for delivery details
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    street: '',
    region: '',
    city: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict phone number input
    if (name === "phoneNumber") {
      // Allow only numbers and prevent non-numeric characters
      if (!/^\d*$/.test(value)) return;

      // Ensure phone number is at most 12 digits (254 + 9 digits)
      if (value.length > 12) return;

      // Validate only when the full number (12 digits) is entered
      if (value.length === 12 && !/^254\d{9}$/.test(value)) {
        alert("Phone number must be in the format 254XXXXXXXXX.");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };


 // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (getTotalCartAmount() === 0) {
    alert('Your cart is empty!');
    return;
  }

  setLoading(true); // Disable button

  const orderData = {
    ...formData,
    totalPrice: getTotalCartAmount() + 2, // Including delivery fee
  };

  const success = await handleCheckout(orderData); // Call checkout function
  console.log("Success: ",success);
  
  const orderId = success.order_id;

  if (success.message==="Payment successful") {
    navigate(`/orderStatus/${orderId}`); // Redirect after successful order
  } else {
    alert('Order placement failed. Please try again.');
    setLoading(false); // Re-enable button if failed
  }
};


  return (
    <div>
      <form className='place-order' onSubmit={handleSubmit}>
        <div className="place-order-left">
          <p className="title">Delivery details</p>
          <div className="multi-fields">
            <input type="text" name="firstName" placeholder='First Name' value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder='Last Name' value={formData.lastName} onChange={handleChange} required />
          </div>
          <input type="text" name="email" placeholder='Email Address' value={formData.email} onChange={handleChange} required />
          <input type="text" name="street" placeholder='Street' value={formData.street} onChange={handleChange} required />
          <div className="multi-fields">
            <input type="text" name="region" placeholder='Region' value={formData.region} onChange={handleChange} required />
            <input type="text" name="city" placeholder='City' value={formData.city} onChange={handleChange} required />
          </div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number (254XXXXXXXXX)"
            value={formData.phoneNumber}
            onChange={handleChange}
            pattern="^254\d{9}$"
            title="Phone number must be exactly 12 digits and start with 254"
            required
          />        </div>
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
                <p>{getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
              </div>
            </div>
            <button type="submit" disabled={getTotalCartAmount() === 0 || loading}>
              {loading ? "Processing..." : "PROCEED TO PAYMENT"}
            </button>
          </div>
        </div>

      </form>

    </div>
  )
}

export default PlaceOrder
