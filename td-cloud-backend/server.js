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
const ANSWER_KEY_PREFIX = "answers:"; // PRE-Fix key for answers to a question

// Helper functions
const getQuestionKey = (questionId) => `${QUESTION_KEY_PREFIX}${questionId}`;
const getAnswerKey = (questionId) => `${ANSWER_KEY_PREFIX}${questionId}`;

io.on(connection, (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on(QUESTION_EVENT, async (question) => {
    if (!question) return;

    // Increment question index
    const questionId = await redis.incr(QUESTION_INDEX);
    const queKey = getQuestionKey(questionId);

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

    // Extract just the ID if it's a full key
    const id = questionId.includes(":") ? questionId.split(":")[1] : questionId;
    const queKey = getQuestionKey(id);

    // Get the question
    const question = await redis.lrange(queKey, 0, 0);
    console.log(`Retrieved question: ${queKey} - ${question}`);

    // Emit the question to the client
    socket.emit(QUESTION_ASKED_EMIT, question);
  });

  socket.on(ANSWER_EVENT, async (answers) => {
    console.log(`Answers received: ${JSON.stringify(answers)}`);

    if (!answers || answers.length === 0) {
      console.log("No answers provided");
      return;
    }

    // Get the current question ID
    const currentQuestionId = await redis.get(QUESTION_INDEX);
    const answerKey = getQuestionKey(currentQuestionId);

    // Store the answers
    for (const answer of answers) {
      if (answer && answer.trim() !== "") {
        await redis.rpush(answerKey, answer);
      }
    }

    // Get all answers for this question
    const allAnswers = await redis.lrange(answerKey, 1, -1);
    console.log(`All answers for ${answerKey}: ${allAnswers}`);

    // Emit all answers to the client
    io.emit(ANSWER_EMIT, allAnswers);
  });

  socket.on("get_answers", async (questionId) => {
    const id = questionId || (await redis.get(QUESTION_INDEX));
    const answerKey = getAnswerKey(id);

    const allAnswers = await redis.lrange(answerKey, 0, -1);
    console.log(`Sending answers for ${answerKey}: ${allAnswers}`);

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
  const questionId = req.query.questionId || (await redis.get(QUESTION_INDEX));
  const answerKey = getQuestionKey(questionId);

  const allAnswers = await redis.lrange(answerKey, 1, -1);

  res.json({
    data: allAnswers,
    questionId: questionId,
  });
});

const PORT = process.env.SERVER_PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
