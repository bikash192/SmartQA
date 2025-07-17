require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const roomRoutes = require("./src/routes/roomRoutes");
const app = express(); //Create an instance of express to set up the server

app.use(express.json()); //Middleware to parse JSON bodies

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
// Connect to MongoDB
app.use("/room", roomRoutes); //Mount the room routes on the /room path
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const server = http.createServer(app); //Create an HTTP server using the express app

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Get Executed in evry new Connection ,If the new connection is for custom event "join room";
// to join a room we add it to the pool of clients sharing the same roomCode
io.on("connection", (socket) => {
  console.log("New Client Connected: ", socket.id);

  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);
    console.log(`User joined room: ${roomCode}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

app.set("io", io);

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, (error) => {
  if (error) {
    console.error(`Error starting server: ${error}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
