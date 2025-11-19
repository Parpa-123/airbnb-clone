import React from 'react';
import Img from '../../assets/image.png';
import { FaGlobe, FaBars } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <nav className="px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <img src={Img} alt="Site Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Nav Menus */}
      <ul className="flex flex-row gap-6 text-sm font-medium">
        <li className="cursor-pointer">Home</li>
        <li className="cursor-pointer">Experience</li>
        <li className="cursor-pointer">Services</li>
      </ul>

      
      <div className="flex flex-row items-center gap-4">
        <span className="cursor-pointer">Become a host</span>
        <FaGlobe className="text-xl cursor-pointer" />

        
        <FaBars className="text-xl cursor-pointer" />
      </div>
    </nav>
  );
};

export default Header;
