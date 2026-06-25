const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Response = require("../models/Response");

// Submit Form Response
router.post("/submit", async (req, res) => {
  try {
    const { formId, responses } = req.body;

    const newResponse = new Response({
      formId,
      responses,
    });

    await newResponse.save();

    res.status(201).json({
      message: "Response submitted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Responses By Form ID
router.get("/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    console.log("Searching for Form ID:", formId);

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({
        message: "Invalid Form ID",
      });
    }

    const responses = await Response.find({
      formId: formId,
    });

    console.log("Found Responses:", responses);

    res.status(200).json(responses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;