import io from "socket.io-client";

const isBrowser = typeof window !== "undefined";

export const socket: SocketIOClient.Socket | undefined = isBrowser
  ? io("http://172.27.46.71:4001")
  : undefined;
