// client/src/App.tsx
import { useEffect, useRef, useState } from 'react';
const wsUrl = import.meta.env.VITE_WS_URL;
const appName = import.meta.env.VITE_APP_NAME;

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    console.log("clicking ", socketRef.current)
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, height: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <h2>🟢 {appName || "Chat-app"}</h2>

      <div style={{
        border: '1px solid #ccc',
        padding: 10,
        overflowY: 'auto',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        flexGrow: 1
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 5, backgroundColor: '#d2edec', padding: '6px 12px', borderRadius: 12, width: 'fit-content' }}>
            {msg}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
