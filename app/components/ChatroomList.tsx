import React from "react";
import ChatroomItem from "./ChatroomItem";

interface Chatroom {
  unique_code: string;
  name: string;
}

interface ChatroomListProps {
  chatrooms: Chatroom[];
  selectedChat: string | null;
  onSelectChat: (chatroomId: string) => void;
}

const ChatroomList: React.FC<ChatroomListProps> = ({ chatrooms, selectedChat, onSelectChat }) => {
  return (
    <div className="space-y-2">
      {chatrooms.length > 0 ? (
        chatrooms.map((chatroom) => (
          <ChatroomItem key={chatroom.unique_code} chatroom={chatroom} selectedChat={selectedChat} onSelectChat={onSelectChat} />
        ))
      ) : (
        <p className="text-gray-500">No chatrooms available.</p>
      )}
    </div>
  );
};

export default ChatroomList;
