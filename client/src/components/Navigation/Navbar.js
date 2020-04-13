import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Navbar.module.css';

const Navbar = (props) => {
    return (
        <nav className={classes.Navbar}>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/images">All Images</Link></li>
            </ul>
                
        </nav>
    )
}

export default Navbar;