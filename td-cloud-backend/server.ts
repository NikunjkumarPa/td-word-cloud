import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

console.log("process.env.REDIS_URL===>", process.env.REDIS_URL);

// redis.connect();

//Socket: Event and Emitters
const QUESTION_EVENT = "create_question";
const QUESTION_EMIT = "question_created";
const ANSWER_EVENT = "submit_answer";
const ANSWER_EMIT = "answer_submited";
const THUMB_EVENT = "press_thumb";
const THUMB_EMIT = "thumb_pressed";
const connection = "connection";
const disconnect = "disconnect";
//Redis: DB keys
const QUESTION_INDEX = "question_index"; // SET/GET as primary key
const QUESTION_KEY_PREFIX = "question:"; // PRE-Fix key for a question tobe created

io.on(connection, (socket) => {
  socket.on(QUESTION_EVENT, async (question: string) => {
    if (!question) return;
    await redis.incr(QUESTION_INDEX);
    const questionKey = QUESTION_KEY_PREFIX + (await redis.get(QUESTION_INDEX));
    await redis.set(questionKey, question);
    socket.emit(QUESTION_EMIT, { question, questionKey });
  });

  socket.on(ANSWER_EVENT, (answers: string[]) => {
    socket.emit(ANSWER_EMIT, answers);
  });

  socket.on(THUMB_EVENT, (thumb: boolean) => {
    socket.emit(THUMB_EMIT, thumb);
  });
  socket.on(disconnect, () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.SERVER_PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: { origin: "*" }, // Allow all origins (Change in production)
// });

// // Connect to Redis
// const pubClient = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });
// const subClient = pubClient.duplicate();
// const QUESTION_EVENT = "createQuestion";
// const QUESTION_EMIT = "newQuestion";
// const ANSWER_EVENT = "submitAnswer";
// const ANSWER_EMIT = "updateAnswers";
// const QUESTION_KEY = "current_question";
// const ANSWERS_KEY = "question_answers";

// Promise.all([pubClient.connect(), subClient.connect()])
//   .then(() => {
//     console.log("Connected to Redis");
//     io.adapter(createAdapter(pubClient, subClient));
//   })
//   .catch((err) => console.error("Redis connection error:", err));

// // Store active questions
// const questions: Record<string, string[]> = {};

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on(QUESTION_EVENT, async (question) => {
//     await pubClient.set(QUESTION_KEY, question);
//     io.emit(QUESTION_EMIT, question);
//   });

//   socket.on(ANSWER_EVENT, async (answer) => {
//     const currentQuestion = await pubClient.get(QUESTION_KEY);
//     if (!currentQuestion) return;

//     if (!questions[currentQuestion]) {
//       questions[currentQuestion] = [];
//     }

//     questions[currentQuestion].push(answer);
//     io.emit(ANSWER_EMIT, questions[currentQuestion]);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// const PORT = process.env.SERVER_PORT || 4001;
// httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// ================================
// ================================
// ================================
// require("dotenv").config();
// import express, { Request, Response } from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import redis from "./lib/redis";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());

// const QUESTION_KEY = "current_question";
// const ANSWERS_KEY = "question_answers";

// interface QuestionRequest {
//   question: string;
// }

// interface AnswerRequest {
//   answer: string;
// }

// // Admin Creates a Question
// app.post(
//   "/create-question",
//   async (req: Request<{}, {}, QuestionRequest>, res: Response) => {
//     const { question } = req.body;
//     await redis.set(QUESTION_KEY, question);
//     await redis.del(ANSWERS_KEY);
//     io.emit("newQuestion", question);
//     res.status(201).json({ message: "Question created" });
//   }
// );

// // User Submits an Answer
// app.post(
//   "/submit-answer",
//   async (req: Request<{}, {}, AnswerRequest>, res: Response) => {
//     const { answer } = req.body;
//     await redis.rpush(ANSWERS_KEY, answer);
//     io.emit("newAnswer", answer);
//     res.status(200).json({ message: "Answer submitted" });
//   }
// );

// // Get Current Question & Answers
// app.get("/question", async (_req: Request, res: Response) => {
//   const question = await redis.get(QUESTION_KEY);
//   const answers = await redis.lrange(ANSWERS_KEY, 0, -1);
//   res.json({ question, answers });
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// ---------------------------------
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// const QuestionSchema = new mongoose.Schema({
//   question: String,
//   answers: { type: Map, of: Number },
// });

// const Question = mongoose.model("Question", QuestionSchema);

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("createQuestion", async (questionText) => {
//     const question = new Question({ question: questionText, answers: {} });
//     await question.save();
//     io.emit("newQuestion", question);
//   });

//   socket.on("submitAnswer", async ({ questionId, answer }) => {

//     const question = await Question.findById(questionId);
//     if (!question) return;

//     question.answers.set(answer, (question.answers.get(answer) || 0) + 1);
//     await question.save();

//     io.emit("updateAnswers", {
//       questionId,
//       answers: Object.fromEntries(question.answers),
//     });
//   });
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
