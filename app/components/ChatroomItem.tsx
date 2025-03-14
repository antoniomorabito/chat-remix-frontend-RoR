import React from "react";

interface ChatroomItemProps {
  chatroom: { unique_code: string; name: string };
  selectedChat: string | null;
  onSelectChat: (chatroomId: string) => void;
}

const ChatroomItem: React.FC<ChatroomItemProps> = ({ chatroom, selectedChat, onSelectChat }) => {
  return (
    <button
      onClick={() => onSelectChat(chatroom.unique_code)}
      className={`w-full text-left p-3 rounded-lg text-gray-800 hover:bg-blue-100 ${
        selectedChat === chatroom.unique_code ? "bg-blue-500 text-white" : ""
      }`}
    >
      {chatroom.name}
    </button>
  );
};

export default ChatroomItem;
