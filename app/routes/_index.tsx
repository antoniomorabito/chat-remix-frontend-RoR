import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useState, useEffect } from "react";

import ChatroomList from "~/components/ChatroomList";
import ChatRoom from "~/components/ChatRoom";
import EmptyChat from "~/components/EmptyChat";
import Pagination from "~/components/Pagination";
import ChatroomModal from "~/components/ChatroomModal";

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

// Fetch chatrooms from API
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

export default function IndexPage() {
  const { chatrooms, pagination } = useLoaderData() as ChatroomResponse;
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Function to navigate pages
  const goToPage = (page: number) => {
    if (page > 0 && page <= pagination.total_pages) {
      navigate(`?page=${page}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Chatrooms */}
      <div className="w-80 bg-white shadow-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">🗨️ Chatrooms</h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
        >
          ➕ Create Chatroom
        </button>

        <ChatroomList chatrooms={chatrooms} selectedChat={selectedChat} onSelectChat={setSelectedChat} />

        <Pagination currentPage={pagination.current_page} totalPages={pagination.total_pages} onPageChange={goToPage} />
      </div>

      {/* Chatroom Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {selectedChat ? `Chatroom: ${selectedChat}` : "Select a Chatroom"}
          </h2>
        </div>

        {selectedChat ? <ChatRoom chatroomId={selectedChat} /> : <EmptyChat />}
      </div>

      {isModalOpen && <ChatroomModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
