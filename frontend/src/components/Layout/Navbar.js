"use client"

import { Component } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { logout } from "../../store/actions/authActions"

class Navbar extends Component {
  handleLogout = (e) => {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    const { isAuthenticated, user } = this.props

    const authLinks = (
      <>
        <li className="nav-item">
          <span className="nav-link">
            Welcome, {user?.name} ({user?.role})
          </span>
        </li>
        <li className="nav-item">
          <a href="#!" className="nav-link" onClick={this.handleLogout}>
            Logout
          </a>
        </li>
      </>
    )

    const guestLinks = (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            Signup
          </Link>
        </li>
      </>
    )

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Ticketing System
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">{isAuthenticated ? authLinks : guestLinks}</ul>
          </div>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
})

export default connect(mapStateToProps, { logout })(Navbar)

