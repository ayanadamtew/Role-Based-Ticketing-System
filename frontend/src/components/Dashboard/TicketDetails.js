"use client"

import { Component } from "react"
import { connect } from "react-redux"
import { useParams, Navigate } from "react-router-dom"
import { fetchTicketById, addComment } from "../../store/actions/ticketActions"

// This wrapper is needed to use hooks with class components
export const withRouter = (Component) => {
  return (props) => {
    const params = useParams()
    return <Component {...props} params={params} />
  }
}

class TicketDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: "",
      errors: {},
    }
  }

  componentDidMount() {
    const { params } = this.props
    if (params.id) {
      this.props.fetchTicketById(params.id)
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { comment } = this.state
    const { params } = this.props

    // Simple validation
    if (!comment.trim()) {
      this.setState({ errors: { comment: "Comment cannot be empty" } })
      return
    }

    this.props.addComment(params.id, comment)
    this.setState({ comment: "", errors: {} })
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
    const { ticket, loading, error, user } = this.props
    const { comment, errors } = this.state

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )
    }

    if (loading) {
      return (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )
    }

    if (!ticket) {
      return <Navigate to="/dashboard" />
    }

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Ticket Details</h2>
              <span className={`badge ${this.getStatusBadgeClass(ticket.status)}`}>{ticket.status}</span>
            </div>
          </div>

          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{ticket.title}</h5>
              </div>
              <div className="card-body">
                <p className="card-text">{ticket.description}</p>
                <div className="d-flex justify-content-between text-muted">
                  <small>Created by: {ticket.user?.name || "Unknown"}</small>
                  <small>Date: {new Date(ticket.createdAt).toLocaleString()}</small>
                </div>
              </div>
            </div>
          </div>

          {ticket.comments && ticket.comments.length > 0 && (
            <div className="col-md-12 mb-4">
              <h4>Comments</h4>
              <div className="list-group">
                {ticket.comments.map((comment, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{comment.user?.name || "Unknown"}</h6>
                      <small>{new Date(comment.createdAt).toLocaleString()}</small>
                    </div>
                    <p className="mb-1">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Add Comment</h5>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="mb-3">
                    <textarea
                      className={`form-control ${errors.comment ? "is-invalid" : ""}`}
                      id="comment"
                      name="comment"
                      value={comment}
                      onChange={this.handleChange}
                      rows="3"
                      placeholder="Add your comment here..."
                    ></textarea>
                    {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Comment"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ticket: state.tickets.currentTicket,
  loading: state.tickets.loading,
  error: state.tickets.error,
  user: state.auth.user,
})

export default connect(mapStateToProps, { fetchTicketById, addComment })(withRouter(TicketDetails))

