import { Socket } from "socket.io-client";

let socketInstance: Socket | null = null;
let userIdInstance: string | null = null;
export const setSocketInstance = (socket: Socket) => {
  socketInstance = socket;
};

export const getSocketInstance = () => {
  return socketInstance;
};

export const setUserIdInstance = (userId: string) => {
  userIdInstance = userId;
};

export const getUserIdInstance = () => {
  return userIdInstance;
};
