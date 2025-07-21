import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import extractInsuranceRoutes from "./routes/extractInsurance";
import { auth } from "./middlewares/auth";

const app = express();
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import { connectQueue } from "./config/queue";
import { WebSocketServer } from "ws";
import { startPubSub } from "./config/pubsub";
import { setupWebSocket } from "./config/websocket";

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
    origin: [
      "http://localhost:5173",
      "https://insuremed.vercel.app",
      "https://medico.kavish.tech",
    ],
    credentials: true,
  })
);

app.use("/api/v1", authRoutes);
app.use("/api/v1", auth, extractInsuranceRoutes);

async function startQueueAndWorkers() {
  try {
    await connectQueue();
    // await summaryWorker();
    // await websearchWorker();
  } catch (error) {
    console.error("Error starting queue and workers:", error);
    process.exit(1);
  }
}

startQueueAndWorkers();
startPubSub();

app.get("/", (req: Request, res: Response) => {
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
