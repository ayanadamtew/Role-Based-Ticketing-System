import axios from "axios"
import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL, LOGOUT, AUTH_CHECK } from "./types"

const API_URL = "http://localhost:5000/api"

// Login user
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START })

    const res = await axios.post(`${API_URL}/auth/login`, { email, password })

    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token: res.data.token,
        user: res.data.user,
      },
    })
  } catch (err) {
    dispatch({
      type: AUTH_FAIL,
      payload: err.response?.data?.message || "Authentication failed",
    })
  }
}

// Register user
export const signup =
  ({ name, email, password }) =>
  async (dispatch) => {
    try {
      dispatch({ type: AUTH_START })

      const res = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      })

      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          token: res.data.token,
          user: res.data.user,
        },
      })
    } catch (err) {
      dispatch({
        type: AUTH_FAIL,
        payload: err.response?.data?.message || "Registration failed",
      })
    }
  }

// Check authentication status
export const checkAuthStatus = () => (dispatch) => {
  const token = localStorage.getItem("token")

  if (!token) {
    dispatch({
      type: AUTH_CHECK,
      payload: {
        isAuthenticated: false,
        user: null,
      },
    })
    return
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token")
      dispatch({
        type: AUTH_CHECK,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      })
      return
    }

    dispatch({
      type: AUTH_CHECK,
      payload: {
        isAuthenticated: true,
        user: {
          id: payload.userId,
          role: payload.role,
        },
      },
    })
  } catch (error) {
    localStorage.removeItem("token")
    dispatch({
      type: AUTH_CHECK,
      payload: {
        isAuthenticated: false,
        user: null,
      },
    })
  }
}

// Logout user
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT })
}

