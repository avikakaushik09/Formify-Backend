const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const jwt = require("jsonwebtoken");

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

// CREATE FORM
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, fields } = req.body;

    const form = new Form({
      title,
      description,
      fields,
      createdBy: req.userId,
    });

    await form.save();

    res.status(201).json({
      message: "Form created successfully",
      form,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET MY FORMS
router.get("/my-forms", authMiddleware, async (req, res) => {
  try {
    const forms = await Form.find({
      createdBy: req.userId,
    });

    res.json(forms);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET SINGLE FORM
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    res.json(form);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;