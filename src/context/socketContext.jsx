import { createContext, useState, useEffect } from "react";

const SocketContext = createContext({
  socket: null,
  taskId: "",
  connectionError: false,
});

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [taskId, setTaskId] = useState(() => localStorage.getItem("task_id"));

  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    async function openSocket() {
      if (!socket && taskId) {
        const ws = new WebSocket(`ws://localhost:4000`);

        ws.onopen = () => {
          setSocket(ws);
          // console.log("WebSocket connection established");
          // setTaskId(localStorage.getItem("task_id"));
        };

        ws.onclose = () => {
          setSocket(null);
        };

        ws.onerror = () => {
          setSocket(null);
          setConnectionError(true);
        };

        return () => {
          ws.close();
        };
      }
    }

    openSocket();
  }, [taskId]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        taskId,
        connectionError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
