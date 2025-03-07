"use client"

import { Component } from "react"
import { connect } from "react-redux"
import { fetchAllTickets, updateTicketStatus, updateTicketStatusOptimistic } from "../../store/actions/ticketActions"
import "./AdminDashboard.css"

class AdminDashboard extends Component {
  componentDidMount() {
    this.props.fetchAllTickets()
  }

  handleStatusChange = (ticketId, newStatus) => {
    // Optimistic update
    this.props.updateTicketStatusOptimistic(ticketId, newStatus)

    this.props.updateTicketStatus(ticketId, newStatus).catch((error) => {
      console.error(`Error updating status for ticket ${ticketId}:`, error)
      // Revert the optimistic update if the API call fails
      this.props.fetchAllTickets()
    })
  }

  getStatusBadgeClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-danger"
      case "In Progress":
        return "bg-warning"
      case "Closed":
        return "bg-success"
      default:
        return "bg-secondary"
    }
  }

  render() {
    const { tickets, loading, error } = this.props

    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )
    }

    return (
      <div className="container mt-4">
        <h2 className="mb-4">Admin Dashboard - All Tickets</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket._id.substring(0, 8)}...</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.user ? ticket.user.name : "Unknown"}</td>
                  <td>
                    <span className={`badge ${this.getStatusBadgeClass(ticket.status)}`}>{ticket.status}</span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={ticket.status}
                      onChange={(e) => this.handleStatusChange(ticket._id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
  loading: state.tickets.loading,
  error: state.tickets.error,
})

export default connect(mapStateToProps, { fetchAllTickets, updateTicketStatus, updateTicketStatusOptimistic })(
  AdminDashboard,
)

