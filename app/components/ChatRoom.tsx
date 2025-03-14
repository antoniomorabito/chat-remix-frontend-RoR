import React, { useState } from "react";
import axios from "axios";

interface ChatRoomProps {
  chatroomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatroomId }) => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [content, setContent] = useState("");

  const sendMessage = async () => {
    if (!content.trim()) return;
    try {
      await axios.post("http://localhost:3000/messages", {
        message: { chatroom_id: chatroomId, content: content, sender: "User" },
      });
      setMessages((prev) => [...prev, { sender: "User", content }]);
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "User" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-gray-800 self-start"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Start chatting now...</p>
        )}
      </div>

      {/* Input Chat */}
      <div className="p-4 bg-white shadow-md flex">
        <input
          type="text"
          className="flex-1 border p-2 rounded-l-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
