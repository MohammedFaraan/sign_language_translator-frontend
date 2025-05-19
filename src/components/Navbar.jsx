import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar({ onLanguageChange }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageSelect = (language) => {
    if (onLanguageChange) {
      onLanguageChange(language);
    }
    setIsDropdownOpen(false);
  };

  const isHomePage = location.pathname === "/";

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
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 transition-colors font-medium"
                : "text-gray-800 hover:text-blue-600 transition-colors font-medium"
            }
          >
            About
          </NavLink>
          {isHomePage && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
              >
                Language
                <i
                  className={`fas fa-chevron-down ml-2 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                ></i>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="language-menu"
                  >
                    <button
                      onClick={() => handleLanguageSelect("english")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageSelect("kannada")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Kannada
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
