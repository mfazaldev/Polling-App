const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: function (options) {
          return options.length >= 2;
        },
        message: "Poll must have at least 2 options",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    votedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Poll", pollSchema);