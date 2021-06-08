import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./logout";
function Navbar() {
  const useData = useSelector((state) => state.addUser);
  return (
    <div style={{ backgroundColor: "#083144" }}>
      <div className="container">
        <nav className="navbar navbar-expand-lg pt-4 pb-4 ">
          <a className="navbar-brand text-white">Booking App</a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            {useData.role === "user" ? (
              <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link active text-white">
                  Areas
                </Link>
                <Link
                  to="/viewbooking"
                  className="nav-item nav-link text-white"
                >
                  View Booking
                </Link>
              </div>
            ) : useData.role === "admin" ? (
              <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link active text-white">
                  Areas
                </Link>
                <Link to="/addarea" className="nav-item nav-link text-white">
                  Add Area
                </Link>
              </div>
            ) : null}
          </div>
          <Logout />
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
