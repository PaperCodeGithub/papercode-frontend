import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./style/navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">PaperCode</h1>
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMenu}
        aria-label="Toggle navigation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" /> 
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" /> 
          )}
        </svg>
      </button>

      <div className={`navbar-links ${isMenuOpen ? "is-open" : ""}`}>
        <NavLink to="/" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}>
          Home
        </NavLink>

        <NavLink to="/projects" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}>
          Projects
        </NavLink>

        <NavLink to="/experiments" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}>
          Experiments
        </NavLink>

        <NavLink to="/marketplace" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}>
          Market Place
        </NavLink>

        <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}>
          About
        </NavLink>
      </div>
    </nav>
  );
}