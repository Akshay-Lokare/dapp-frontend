import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const SocketLogs = () => {
  useEffect(() => {
    // Listen for logs coming from the server
    socket.on("server-log", (logMessage: string) => {
      console.log("🧩 [Server]:", logMessage);
    });

    return () => {
      socket.off("server-log");
    };
  }, []);

  return null; // no UI, only logs to console
};

export default SocketLogs;
