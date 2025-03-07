import express from "express"
import Ticket from "../models/Ticket.js"
import { auth, isAdmin } from "../middleware/auth.js"

const router = express.Router()

// @route   POST /api/tickets
// @desc    Create a new ticket
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body

    const ticket = new Ticket({
      title,
      description,
      user: req.user._id,
    })

    await ticket.save()

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// @route   GET /api/tickets
// @desc    Get all tickets (admin) or user's tickets
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let tickets

    if (req.user.role === "admin") {
      // Admin sees all tickets
      tickets = await Ticket.find().populate("user", "name email")
    } else {
      // User sees only their tickets
      tickets = await Ticket.find({ user: req.user._id })
    }

    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// @route   PUT /api/tickets/:id
// @desc    Update ticket status (admin only)
// @access  Private/Admin
router.put("/:id", [auth, isAdmin], async (req, res) => {
  try {
    const { status } = req.body
    console.log(`Received update request for ticket ${req.params.id} with status: ${status}`)

    // Validate status
    if (!["Open", "In Progress", "Closed"].includes(status)) {
      console.log(`Invalid status value: ${status}`)
      return res.status(400).json({ message: "Invalid status value" })
    }

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      console.log(`Ticket not found: ${req.params.id}`)
      return res.status(404).json({ message: "Ticket not found" })
    }

    ticket.status = status
    const updatedTicket = await ticket.save()

    console.log(`Ticket ${req.params.id} updated successfully to status: ${status}`)

    res.json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Error updating ticket status:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// @route   POST /api/tickets/:id/comments
// @desc    Add a comment to a ticket
// @access  Private
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" })
    }

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    // Check if user is authorized to comment on this ticket
    if (req.user.role !== "admin" && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to comment on this ticket" })
    }

    ticket.comments.push({
      text,
      user: req.user._id,
    })

    await ticket.save()

    // Populate the user info for the new comment
    const updatedTicket = await Ticket.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name")

    res.json({
      message: "Comment added successfully",
      ticket: updatedTicket,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// @route   GET /api/tickets/:id
// @desc    Get a ticket by ID with comments
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("user", "name email").populate("comments.user", "name")

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    // Check if user is authorized to view this ticket
    if (req.user.role !== "admin" && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this ticket" })
    }

    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

