import axios from "axios"
import {
  FETCH_TICKETS_START,
  FETCH_TICKETS_SUCCESS,
  FETCH_TICKETS_FAIL,
  CREATE_TICKET_START,
  CREATE_TICKET_SUCCESS,
  CREATE_TICKET_FAIL,
  UPDATE_TICKET_STATUS_START,
  UPDATE_TICKET_STATUS_SUCCESS,
  UPDATE_TICKET_STATUS_FAIL,
} from "./types"

const API_URL = "http://localhost:5000/api"

// Get authenticated user's tickets
export const fetchUserTickets = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_TICKETS_START })

    const token = localStorage.getItem("token")

    const res = await axios.get(`${API_URL}/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    dispatch({
      type: FETCH_TICKETS_SUCCESS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: FETCH_TICKETS_FAIL,
      payload: err.response?.data?.message || "Failed to fetch tickets",
    })
  }
}

// Get all tickets (admin only)
export const fetchAllTickets = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_TICKETS_START })

    const token = localStorage.getItem("token")

    const res = await axios.get(`${API_URL}/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    dispatch({
      type: FETCH_TICKETS_SUCCESS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: FETCH_TICKETS_FAIL,
      payload: err.response?.data?.message || "Failed to fetch tickets",
    })
  }
}

// Create a new ticket
export const createTicket = (ticketData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TICKET_START })

    const token = localStorage.getItem("token")

    const res = await axios.post(`${API_URL}/tickets`, ticketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    dispatch({
      type: CREATE_TICKET_SUCCESS,
      payload: res.data.ticket,
    })
  } catch (err) {
    dispatch({
      type: CREATE_TICKET_FAIL,
      payload: err.response?.data?.message || "Failed to create ticket",
    })
  }
}

// Update ticket status (admin only)
export const updateTicketStatus = (ticketId, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TICKET_STATUS_START })

    console.log(`Sending update request for ticket ${ticketId} with status: ${status}`)

    const token = localStorage.getItem("token")
    const response = await axios.put(
      `${API_URL}/tickets/${ticketId}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )

    console.log("Update response:", response.data)

    dispatch({
      type: UPDATE_TICKET_STATUS_SUCCESS,
      payload: response.data.ticket,
    })
    return response.data
  } catch (error) {
    console.error("Error in updateTicketStatus action:", error.response?.data || error.message)

    dispatch({
      type: UPDATE_TICKET_STATUS_FAIL,
      payload: error.response?.data?.message || "Failed to update ticket status",
    })

    throw error
  }
}

export const fetchTicketById = (ticketId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_TICKETS_START })
    const token = localStorage.getItem("token")
    const res = await axios.get(`${API_URL}/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    dispatch({ type: FETCH_TICKETS_SUCCESS, payload: res.data })
  } catch (err) {
    dispatch({ type: FETCH_TICKETS_FAIL, payload: err.response?.data?.message || "Failed to fetch ticket" })
  }
}

export const addComment = (ticketId, comment) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TICKET_START })
    const token = localStorage.getItem("token")
    const res = await axios.post(
      `${API_URL}/tickets/${ticketId}/comments`,
      { text: comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    dispatch({ type: CREATE_TICKET_SUCCESS, payload: res.data.ticket })
  } catch (err) {
    dispatch({ type: CREATE_TICKET_FAIL, payload: err.response?.data?.message || "Failed to add comment" })
  }
}

export const updateTicketStatusOptimistic = (ticketId, status) => ({
  type: "UPDATE_TICKET_STATUS_OPTIMISTIC",
  payload: { _id: ticketId, status },
})

