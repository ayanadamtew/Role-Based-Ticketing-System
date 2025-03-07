import { Component } from "react"
import { Navigate } from "react-router-dom"

class ProtectedRoute extends Component {
  render() {
    const { isAuthenticated, children } = this.props

    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }

    return children
  }
}

export default ProtectedRoute

