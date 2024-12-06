import React from "react";
import './NavbarItem.css';

function NavbarItem() {
  return (
    <div className="">
      <nav className="navbar  bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/home">The Scheduler</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link fw-bold active" aria-current="page" href="/home">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-bold active" aria-current="page" href="/Archives">Schedule Archive</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-bold active" aria-current="page" href="/Edit-Profile">Edit Profile</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-bold active" aria-current="page" href="/Progress-Views">Progress Views</a>
                </li>
                {/* <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/home"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/action">Action</a></li>
                    <li><a className="dropdown-item" href="/another-action">Another action</a></li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item" href="/something-else">Something else here</a></li>
                  </ul>
                </li> */}
                <li className="nav-item">
                  <a className="nav-link fw-bold active" aria-current="page" href="/logout">Logout</a>
                </li>
              </ul>
              {/* <form className="d-flex mt-3" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form> */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarItem;
