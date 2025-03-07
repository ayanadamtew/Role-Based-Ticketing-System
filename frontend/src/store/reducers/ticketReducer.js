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
} from "../actions/types"

const initialState = {
  tickets: [],
  loading: false,
  error: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_TICKETS_START:
    case CREATE_TICKET_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_TICKETS_SUCCESS:
      return {
        ...state,
        tickets: action.payload,
        loading: false,
        error: null,
      }
    case CREATE_TICKET_SUCCESS:
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
        loading: false,
        error: null,
      }
    case UPDATE_TICKET_STATUS_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case UPDATE_TICKET_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        tickets: state.tickets.map((ticket) => (ticket._id === action.payload._id ? action.payload : ticket)),
      }
    case UPDATE_TICKET_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case FETCH_TICKETS_FAIL:
    case CREATE_TICKET_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

