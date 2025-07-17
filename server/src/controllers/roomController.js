const Rooms = require("../models/Room.js");
const Questions = require("../models/Questions.js");
const { callGemini } = require("../services/geminiService.js");

const roomController = {
  // ✅ Create Room
  createRoom: async (req, res) => {
    try {
      const { createdBy } = req.body;

      if (!createdBy) {
        return res
          .status(400)
          .json({ message: "createdBy (user name) is required" });
      }

      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const room = await Rooms.create({
        roomCode: code,
        createdBy: createdBy, // plain string like "bikash"
      });

      res.json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ✅ Get Room by Room Code
  getByRoomID: async (req, res) => {
    try {
      const code = req.params.code;

      const room = await Rooms.findOne({ roomCode: code });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.json(room);
    } catch (error) {
      console.error("Error fetching room by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ✅ Create Question inside a Room
  createQuestion: async (req, res) => {
    try {
      const { content, user } = req.body;
      const roomCode = req.params.code;

      if (!content || !user) {
        return res
          .status(400)
          .json({ message: "content and user name are required" });
      }

      const question = await Questions.create({
        roomCode: roomCode,
        content: content,
        user: user, // plain string like "bikash"
      });

      const io = req.app.get("io");
      io.to(roomCode).emit("new-question", question);

      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ✅ Get All Questions for a Room
  getQuestions: async (req, res) => {
    try {
      const code = req.params.code;

      const questions = await Questions.find({ roomCode: code }).sort({
        createdAt: -1,
      });

      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ✅ Delete a Room by Code
  deleteRoom: async (req, res) => {
    try {
      const code = req.params.code;

      const room = await Rooms.findOneAndDelete({ roomCode: code });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ✅ Delete a Question by ID
  deleteQuestion: async (req, res) => {
    try {
      const questionId = req.params.id;

      const question = await Questions.findByIdAndDelete(questionId);

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      res.json({ message: "Question deleted successfully" });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  summarizeQuestions: async (req, res) => {
    try {
      const { code } = req.params;
      const questions = await Questions.find({ roomCode: code });
      if (questions.length === 0) {
        return res.json([]);
      }
      const summary = await callGemini(questions);
      res.json(summary);
    } catch (error) {
      console.error("Error summarizing questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
module.exports = roomController;
