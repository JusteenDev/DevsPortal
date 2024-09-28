import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { CgProfile } from "react-icons/cg";
import { FaBook } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { FaCode } from "react-icons/fa";

const Navbar = ({ title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = getAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div>
      {/* Fullscreen overlay to block background clicks */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-10 bg-transparent" onClick={handleCloseDropdown} ></div>
      )}

      <div className="navbar bg-base-200 relative z-20">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={toggleDropdown} >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>

            {isDropdownOpen && (
              <ul tabIndex={0} className="menu menu-sm dropdown-content fixed bg-base-200 rounded-box z-30 mt-3 w-52 p-2 shadow" >
                <li>
                  <a> <CgProfile /> Profile</a>
                </li>
                <li>
                  <a> <FaBook /> Portfolio </a>
                </li>
                <li>
                  <a> <FaCode /> Code </a>
                </li>
                <li>
                  <a> <MdSettings /> Account </a>
                </li>
                <li onClick={handleLogout}>
                  <a> <IoLogOut /> Logout </a>
                </li>
              </ul>
            )}
          </div>

          {/* Display the dynamic title based on the active section */}
          <a className="btn btn-ghost text-[20px]">{title}</a>
        </div>

        <div className="navbar-center"></div>

        <div className="navbar-end">
          {/* Only show the search icon if the current section is 'Chats' */}
          {title === "Chats" && (
            <button className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;