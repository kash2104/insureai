const express = require("express");
const authRoutes = require("./routes/auth");
const extractInsuranceRoutes = require("./routes/extractInsurance");
const { auth } = require("./middlewares/auth");

const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const {
  connectQueue,
  summaryWorker,
  //   websearchWorker,
} = require("./config/queue");
const { WebSocketServer, WebSocket } = require("ws");
const { startPubSub } = require("./config/pubsub");
const { setupWebSocket } = require("./config/websocket");

app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1", authRoutes);
app.use("/api/v1", auth, extractInsuranceRoutes);

async function startQueueAndWorkers() {
  try {
    await connectQueue();
    await summaryWorker();
    // await websearchWorker();
  } catch (error) {
    console.error("Error starting queue and workers:", error);
    process.exit(1);
  }
}

startQueueAndWorkers();
startPubSub();

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "App is running successfully.",
  });
});

const httpServer = app.listen(4000, () => {
  console.log("App is listening on port 4000.");
});

const wss = new WebSocketServer({ server: httpServer });

setupWebSocket(wss);

// wss.on('connection', function connection(ws) {
//   ws.on('error', console.error);

//   ws.on('message', function message(data, isBinary) {
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(data, { binary: isBinary });
//       }
//     });
//   });

//   ws.send('Hello! Message From Server!!');
// });
