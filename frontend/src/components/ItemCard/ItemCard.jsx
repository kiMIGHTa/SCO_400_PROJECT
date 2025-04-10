import React, { useContext } from 'react'
import './ItemCard.css'
import { assets } from '../../../downloads/assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'

const ItemCard = ({ id, name, price, description, image, restaurantName }) => {
    const { cartItems, handleAddToCart, handleRemoveFromCart } = useContext(StoreContext)
    const quantity = cartItems[id] || 0; // Ensure cartItems[id] is defined


    return (
        <div className='item-card'>
            <div className="item-image-container">
                <img src={image} alt="" className="item-image" />
                {quantity === 0
                    ? <img onClick={() => handleAddToCart(id)} src={assets.add_icon_white} alt='add-icon-green' className='add' />
                    : <div className='item-counter'>
                        <img onClick={() => handleRemoveFromCart(id)} src={assets.remove_icon_red} alt="" />
                        <p>{quantity}</p>
                        <img onClick={() => handleAddToCart(id)} src={assets.add_icon_green} alt="" />
                    </div>
                }
            </div>
            <div className="item-card-info">
                <div className="item-card-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="rating-stars" />
                </div>
                <p className="item-card-description">{description}</p>
                <p className="item-card-price">Ksh {price}</p>
                <a className="item-card-restaurant">{restaurantName}</a>
            </div>

        </div>
    )
}

export default ItemCard
