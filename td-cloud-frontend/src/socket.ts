import io from "socket.io-client";

const isBrowser = typeof window !== "undefined";

export const socket: SocketIOClient.Socket | undefined = isBrowser
  ? io()
  : undefined;
