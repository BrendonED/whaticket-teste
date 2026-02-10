import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

function connectToSocket() {
  const token = localStorage.getItem("token");
  return openSocket(getBackendUrl(), {
    // transports: ["websocket", "polling", "flashsocket"], // Let socket.io negotiate
    query: {
      token: JSON.parse(token),
    },
  });
}

export default connectToSocket;