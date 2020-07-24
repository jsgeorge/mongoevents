import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";

class Header extends Component {
  logout(e) {
    e.preventDefault();
    this.props.logout();
  }
  nonAuthLinks = () => {
    return (
      <React.Fragment>
        <li className="nav-item">
          <Link to="/signin" className="nav-link">
            Sign In
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        </li>
      </React.Fragment>
    );
  };

  authLinks = () => {
    return (
      <React.Fragment>
        <li className="nav-item">
          <Link to="/events/new" className="nav-link ">
            <span> New</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/profile" className="nav-link">
            Account
          </Link>
        </li>

        <li className="nav-item">
          <button className="navBtn" onClick={this.logout.bind(this)}>
            Sign Out
          </button>
        </li>
      </React.Fragment>
    );
  };
  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container">
          {!isAuthenticated ? (
            <Link to="/" className="navbar-brand">
              MongoEvents
            </Link>
          ) : (
            <Link to="/events" className="navbar-brand">
              MongoEvents
            </Link>
          )}

          <div className="navbar-nav navbar-right">
            {isAuthenticated ? (
              <span>{this.authLinks()}</span>
            ) : (
              <span>{this.nonAuthLinks()}</span>
            )}

            {/* <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
         */}
          </div>
        </div>
      </nav>
    );
  }
}

// Header.propTypes = {
//   auth: React.PropTypes.object.isRequired,
//   logout: React.PropTypes.func.isRequired
// };

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
export default connect(mapStateToProps, { logout })(Header);
