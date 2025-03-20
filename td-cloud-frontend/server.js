import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import Redis from "ioredis";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
console.log("process.env.process.env.NODE_ENV====>", process.env.NODE_ENV);
console.log("process.env.SERVER_PORT====>", process.env.SERVER_PORT);

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, turbopack: true });
const handler = app.getRequestHandler();

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

const questionKey = async (questionNo) =>
  QUESTION_KEY_PREFIX + (questionNo ?? (await redis.get(QUESTION_INDEX)));

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on(connection, (socket) => {
    socket.on(QUESTION_EVENT, async (question) => {
      if (!question) return;
      await redis.incr(QUESTION_INDEX);
      const queKey = await questionKey();
      await redis.rpush(queKey, question);
      socket.emit(QUESTION_EMIT, { question, queKey });
    });

    socket.on(ASK_QUESTION_EVENT, async (questionNo) => {
      console.log("questionNo===>", questionNo);

      const question = await redis.lrange(questionNo, 0, 0);
      socket.emit(QUESTION_ASKED_EMIT, question);
    });

    socket.on(ANSWER_EVENT, async (answers) => {
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

    socket.on(THUMB_EVENT, (thumb) => {
      socket.emit(THUMB_EMIT, thumb);
    });
    socket.on(disconnect, () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
