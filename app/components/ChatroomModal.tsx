import React, { useState } from "react";

interface ChatroomModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

const ChatroomModal: React.FC<ChatroomModalProps> = ({ onClose, onCreate }) => {
  const [chatroomName, setChatroomName] = useState("");

  const handleCreate = () => {
    if (chatroomName.trim()) {
      onCreate(chatroomName);
      setChatroomName("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Chatroom</h2>
        <input
          type="text"
          className="border p-2 w-full rounded-md"
          value={chatroomName}
          onChange={(e) => setChatroomName(e.target.value)}
          placeholder="Enter chatroom name..."
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleCreate} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatroomModal;
