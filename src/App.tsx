import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // Load chat every time both IDs are set
  useEffect(() => {
    if (!currentUser || !receiverId) return;

    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/${receiverId}`, {
          headers: { "x-user-id": currentUser },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();

    // Auto refresh messages every 1.5 seconds
    const interval = setInterval(load, 1500);

    return () => clearInterval(interval);
  }, [currentUser, receiverId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await axios.post(
      `${API_URL}/chat/${receiverId}`,
      { text },
      { headers: { "x-user-id": currentUser } }
    );

    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">Simple Chat Test</h1>

      {/* Current User */}
      <div className="mb-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Current User ID"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        />
      </div>

      {/* Receiver */}
      <div className="mb-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Chat With (Receiver ID)"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
      </div>

      {/* Chat Box */}
      <div className="mt-4 border rounded p-4 h-80 overflow-y-scroll bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${
              msg.senderId === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.senderId === currentUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input message */}
      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
