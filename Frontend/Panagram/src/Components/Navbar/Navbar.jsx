// components/Navbar.jsx
import React from "react";
import "./Navbar.css"; // Import the CSS file for Navbar styles

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <div className="flex justify-center space-x-8 text-2xl w-full">
        <a
          href="#"
          className="hover:text-blue-400 transition centre "
          style={{ fontFamily: "Excalifont, sans-serif" }}
        >
          Panagram
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
