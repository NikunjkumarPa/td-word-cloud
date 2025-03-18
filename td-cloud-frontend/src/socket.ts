import io from "socket.io-client";

const isBrowser = typeof window !== "undefined";

export const socket: SocketIOClient.Socket | undefined = isBrowser
  ? io("http://localhost:4001")
  : undefined;
