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

// const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const redis = new Redis("redis://localhost:6379");

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
const ANSWER_KEY_PREFIX = "question:answer"; // PRE-Fix key for a question tobe created

const questionKey = async () =>
  QUESTION_KEY_PREFIX + (await redis.get(QUESTION_INDEX));
const answerKey = async () =>
  ANSWER_KEY_PREFIX + (await redis.get(QUESTION_INDEX));

io.on(connection, (socket) => {
  socket.on(QUESTION_EVENT, async (question: string) => {
    if (!question) return;
    await redis.incr(QUESTION_INDEX);
    const queKey = await questionKey();
    await redis.rpush(queKey, question);
    socket.emit(QUESTION_EMIT, { question, queKey });
  });

  socket.on(ASK_QUESTION_EVENT, async () => {
    const question = await redis.lrange(await questionKey(), 0, 0);
    socket.emit(QUESTION_ASKED_EMIT, question);
  });

  socket.on(ANSWER_EVENT, async (answers: string[]) => {
    console.log("answers====>", JSON.stringify(answers));
    if (!answers) return;
    const queKey = await questionKey();
    await redis.rpush(queKey, JSON.stringify(answers));
    const allAnswers = await redis.lrange(queKey, 1, -1);
    console.log(
      "allAnswers===>",
      allAnswers.flatMap((_ans) => JSON.parse(_ans))
    );
    socket.emit(
      ANSWER_EMIT,
      allAnswers.flatMap((_ans) => JSON.parse(_ans))
    );
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
