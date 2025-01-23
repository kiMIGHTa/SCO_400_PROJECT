import React, { useContext } from 'react'
import './ItemCard.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'

const ItemCard = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)

    return (
        <div className='item-card'>
            <div className="item-image-container">
                <img src={image} alt="" className="item-image" />
                {!cartItems[id]
                    ? <img onClick={() => addToCart(id)} src={assets.add_icon_white} alt='add-icon-green' className='add-button' />
                    : <div className='item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
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
            </div>

        </div>
    )
}

export default ItemCard
