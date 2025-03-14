import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useState, useEffect } from "react";

interface Chatroom {
  unique_code: string;
  name: string;
}

interface ChatroomResponse {
  chatrooms: Chatroom[];
  pagination: {
    total_pages: number;
    total_count: number;
    current_page: number;
  };
}


export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const per_page = url.searchParams.get("per_page") || "10";

  try {
    const res = await axios.get(`http://localhost:3000/chatrooms?page=${page}&per_page=${per_page}`);
    return res.data as ChatroomResponse;
  } catch (error) {
    console.error("🚨 Error fetching chatrooms:", error);
    throw new Response("Failed to load chatrooms", { status: 500 });
  }
}

export default function ChatroomsList() {
  const { chatrooms, pagination } = useLoaderData() as ChatroomResponse;
  const [chatroomList, setChatroomList] = useState(chatrooms);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newChatroom, setNewChatroom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setChatroomList(chatrooms);
  }, [chatrooms]);

  // ✅ Add new chatroom function
  const addChatroom = async () => {
    if (!newChatroom.trim()) return;

    try {
      const response = await axios.post("http://localhost:3000/chatrooms", {
        chatroom: { name: newChatroom },
      });

      setChatroomList((prev) => [response.data.chatroom, ...prev]); // 🆕 Update list instantly
      setNewChatroom("");
    } catch (error) {
      console.error("🚨 Error creating chatroom:", error);
    }
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= pagination.total_pages) {
      navigate(`?page=${page}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Chatrooms */}
      <div
        className={`w-80 bg-white shadow-lg p-4 transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden md:block"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">🗨️ Chatrooms</h2>

        {/* 🆕 Chatroom Creation Form */}
        <div className="mb-4">
          <input
            type="text"
            className="border p-2 w-full rounded-md"
            value={newChatroom}
            onChange={(e) => setNewChatroom(e.target.value)}
            placeholder="Enter new chatroom name..."
          />
          <button
            onClick={addChatroom}
            className="mt-2 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            ➕ Create Chatroom
          </button>
        </div>

        {/* Chatroom List */}
        <div className="space-y-2">
          {chatroomList.length > 0 ? (
            chatroomList.map((chatroom) => (
              <button
                key={chatroom.unique_code}
                onClick={() => setSelectedChat(chatroom.unique_code)}
                className={`w-full text-left p-3 rounded-lg text-gray-800 hover:bg-blue-100 ${
                  selectedChat === chatroom.unique_code ? "bg-blue-500 text-white" : ""
                }`}
              >
                {chatroom.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No chatrooms available.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between">
          <button
            disabled={pagination.current_page <= 1}
            onClick={() => goToPage(pagination.current_page - 1)}
            className={`p-2 rounded ${
              pagination.current_page <= 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            ⬅ Prev
          </button>

          <span className="p-2">Page {pagination.current_page} / {pagination.total_pages}</span>

          <button
            disabled={pagination.current_page >= pagination.total_pages}
            onClick={() => goToPage(pagination.current_page + 1)}
            className={`p-2 rounded ${
              pagination.current_page >= pagination.total_pages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next ➡
          </button>
        </div>
      </div>

      {/* Chatroom Container */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Navbar Chat */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            📜
          </button>
          <h2 className="text-lg font-semibold">
            {selectedChat ? `Chatroom: ${selectedChat}` : "Select a Chatroom"}
          </h2>
        </div>

        {/* Chat Messages */}
        {selectedChat ? <ChatRoom chatroomId={selectedChat} /> : <EmptyChat />}
      </div>
    </div>
  );
}

function ChatRoom({ chatroomId }: { chatroomId: string }) {
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
}

function EmptyChat() {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      Select a chatroom to start chatting!
    </div>
  );
}
