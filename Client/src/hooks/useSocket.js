import { useContext } from "react";
import { SocketContext } from "../context/socketContext";

const useSocket = () => {
  const { socket, taskId, connectionError } = useContext(SocketContext);

  const sendMessage = () => {
    if (!socket) {
      console.error("WebSocket is not connected");
      return;
    }
    socket?.send(
      JSON.stringify({
        action: "subscribe",
        task_id: taskId,
      })
    );
  };
  return { socket, taskId, connectionError, sendMessage };
};

export default useSocket;
