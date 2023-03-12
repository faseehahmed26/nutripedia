import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Form,
//   FormControl,
//   Nav,
//   Navbar,
//   NavDropdown,
// } from "react-bootstrap";
// import "./styles.css";
const NavigationBar = () => {
  return (
    <React.Fragment
      style={{ left: "0px !important", right: "0px", top: "0px" }}
    >
      <nav
        className="navbar navbar-expand-lg navbar-style "
        style={{ background: "#CFFF68" }}
      >
        <a className="navbar-brand" href="#">
          Nutripedia
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarToggle"
          aria-controls="navbarToggle"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarToggle">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link
                to="/classifier"
                className="nav-link"
                style={{ color: "black" }}
              >
                Classifier
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavigationBar;
