"use client";

import { useState } from "react";
import useSocket from "@/hooks/useSocket";

export default function ChatPage() {
  const { socket, messages } = useSocket();
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">💬 Chat WebSocket</h1>

      <div className="w-full max-w-md border p-4 rounded-md bg-gray-100">
        <div className="h-64 overflow-y-auto border-b p-2 mb-2">
          {messages.map((msg, index) => (
            <p key={index} className="text-sm bg-white p-2 rounded-md my-1">{msg}</p>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            className="flex-1 border p-2 rounded-l-md"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="px-4 bg-blue-500 text-white rounded-r-md">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
