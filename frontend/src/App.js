import { Component } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { connect } from "react-redux"
import Login from "./components/Auth/Login"
import Signup from "./components/Auth/Signup"
import UserDashboard from "./components/Dashboard/UserDashboard"
import AdminDashboard from "./components/Dashboard/AdminDashboard"
import Navbar from "./components/Layout/Navbar"
import { checkAuthStatus } from "./store/actions/authActions"
import ProtectedRoute from "./components/Common/ProtectedRoute"

class App extends Component {
  componentDidMount() {
    this.props.checkAuthStatus()
  }

  render() {
    const { isAuthenticated, user, loading } = this.props

    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )
    }

    return (
      <>
        <Navbar />
        <div className="container py-4">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.auth.loading,
})

export default connect(mapStateToProps, { checkAuthStatus })(App)

