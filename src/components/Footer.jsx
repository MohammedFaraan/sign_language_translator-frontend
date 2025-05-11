import React from "react";

function Footer() {
  return (
    <footer id="about" className="bg-indigo-900 text-white py-5 mt-auto w-full">
      <p className="text-md mb-0 font-medium text-center">
        © {new Date().getFullYear()} SignForALL. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
