import { Server as IOServer } from "socket.io";
import http from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const server = http.createServer((req, res) => {
  nextHandler(req, res);
});

const io = new IOServer(server, {
  path: "/api/socket",
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("message", (msg) => {
    console.log("📩 Mensagem recebida:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("🚀 Servidor WebSocket rodando na porta 3001");
});
