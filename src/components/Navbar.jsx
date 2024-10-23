import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import logo from './images/logo.png'; // Update with the correct path to your logo image
import './Navbar.css'; // Import the CSS file

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '30px' }} />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/dashboard"
                activeClassName="active" // This class will be added to the active link
              >
                <h4>Dashboard</h4>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/monitor"
                activeClassName="active"
              >
                <h4>DataLogging</h4>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
