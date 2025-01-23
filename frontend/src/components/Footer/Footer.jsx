import React from 'react'
import './Footer.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-display">
                <div className="footer-content">
                    <img src={assets.logo} alt="" className="footer-logo" />
                    <p className="footer-text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>

                </div>
                <div className="footer-content">
                    <h2>MPISHI</h2>
                    <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-content">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                    <li>+254712555555</li>
                    <li>mpishi@gmail.com</li>
                    </ul>

                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2025 @ Mpishi.com - All Rights Reserved</p>

        </div>
    )
}

export default Footer
