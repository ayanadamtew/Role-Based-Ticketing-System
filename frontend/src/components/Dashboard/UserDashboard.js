"use client"

import { Component } from "react"
import { connect } from "react-redux"
import { fetchUserTickets, createTicket } from "../../store/actions/ticketActions"

class UserDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      errors: {},
      showForm: false,
    }
  }

  componentDidMount() {
    this.props.fetchUserTickets()
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  toggleForm = () => {
    this.setState((prevState) => ({ showForm: !prevState.showForm }))
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { title, description } = this.state

    // Simple validation
    const errors = {}
    if (!title) errors.title = "Title is required"
    if (!description) errors.description = "Description is required"

    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
      return
    }

    this.props.createTicket({ title, description })

    // Reset form
    this.setState({
      title: "",
      description: "",
      errors: {},
      showForm: false,
    })
  }

  getStatusBadgeClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-info"
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
    const { title, description, errors, showForm } = this.state

    return (
      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2>My Support Tickets</h2>
            <button className="btn btn-primary" onClick={this.toggleForm}>
              {showForm ? "Cancel" : "Create New Ticket"}
            </button>
          </div>
        </div>

        {error && (
          <div className="col-md-12 mb-4">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        )}

        {showForm && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create New Support Ticket</h5>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      id="title"
                      name="title"
                      value={title}
                      onChange={this.handleChange}
                      placeholder="Brief description of your issue"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      id="description"
                      name="description"
                      value={description}
                      onChange={this.handleChange}
                      rows="4"
                      placeholder="Detailed explanation of your issue"
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Ticket"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-12">
          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="alert alert-info">
              You haven't created any tickets yet. Create your first support ticket!
            </div>
          ) : (
            <div className="row">
              {tickets.map((ticket) => (
                <div className="col-md-6 mb-4" key={ticket._id}>
                  <div className="card h-100 ticket-item">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{ticket.title}</h5>
                      <span className={`badge ${this.getStatusBadgeClass(ticket.status)}`}>{ticket.status}</span>
                    </div>
                    <div className="card-body">
                      <p className="card-text">{ticket.description}</p>
                    </div>
                    <div className="card-footer text-muted">Created: {new Date(ticket.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default connect(mapStateToProps, { fetchUserTickets, createTicket })(UserDashboard)

