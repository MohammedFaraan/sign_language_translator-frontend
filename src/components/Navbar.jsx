import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-sign-language text-blue-600 text-3xl mr-3"></i>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SignForALL
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 transition-colors font-medium"
                : "text-gray-800 hover:text-blue-600 transition-colors font-medium"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/isl-to-text"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 transition-colors font-medium"
                : "text-gray-800 hover:text-blue-600 transition-colors font-medium"
            }
          >
            ISL→Text
          </NavLink>
          <NavLink
            to="/text-to-isl"
            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
          >
            Text→ISL
          </NavLink>
          <NavLink
            to="#about"
            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
          >
            About
          </NavLink>
          <Link
            to="/isl-to-text"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>
        <div className="md:hidden">
          <button className="text-gray-800 focus:outline-none cursor-pointer whitespace-nowrap">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
