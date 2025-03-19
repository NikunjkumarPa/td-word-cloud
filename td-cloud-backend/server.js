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

//Socket: Event and Emitters
const QUESTION_EVENT = "create_question";
const QUESTION_EMIT = "question_created";
const ASK_QUESTION_EVENT = "ask_question";
const QUESTION_ASKED_EMIT = "question_asked";
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
  console.log(`User connected: ${socket.id}`);

  socket.on(QUESTION_EVENT, async (question) => {
    if (!question) return;

    // Increment question index
    const questionId = await redis.incr(QUESTION_INDEX);
    const queKey = `${QUESTION_KEY_PREFIX}${questionId}`;

    // Store the question
    await redis.rpush(queKey, question);
    console.log(`Question created: ${queKey} - ${question}`);

    // Emit to client
    socket.emit(QUESTION_EMIT, { question, queKey });
  });

  socket.on(ASK_QUESTION_EVENT, async (questionId) => {
    console.log(`Question requested: ${questionId}`);

    if (!questionId) {
      console.log("No questionId provided");
      return;
    }

    // Get the question
    const question = await redis.lrange(questionId, 0, 0);
    console.log(`Retrieved question: ${questionId} - ${question}`);

    // Emit the question to the client
    socket.emit(QUESTION_ASKED_EMIT, question);
  });

  socket.on(ANSWER_EVENT, async (answers, questionId) => {
    console.log(`Answers received: ${JSON.stringify(answers)}`);

    if (!answers || answers.length === 0) {
      console.log("No answers provided");
      return;
    }

    // Store the answers
    for (const answer of answers) {
      if (answer && answer.trim() !== "") {
        await redis.rpush(questionId, answer);
      }
    }

    // Get all answers for this question
    const allAnswers = await redis.lrange(questionId, 1, -1);
    console.log(`All answers for ${questionId}: ${allAnswers}`);

    // Emit all answers to the client
    io.emit(ANSWER_EMIT, allAnswers, questionId);
  });

  socket.on("get_answers", async (questionId) => {
    const allAnswers = await redis.lrange(questionId, 1, -1);
    console.log(`Sending answers for ${questionId}: ${allAnswers}`);
    socket.emit(ANSWER_EMIT, allAnswers);
  });

  socket.on(THUMB_EVENT, (thumb) => {
    socket.emit(THUMB_EMIT, thumb);
  });

  socket.on(disconnect, () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/getAnswers", async (req, res) => {
  const questionid = req.query.questionid;
  const allAnswers = await redis.lrange(questionid, 1, -1);
  res.json({ allAnswers, questionid });
});

const PORT = process.env.SERVER_PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
