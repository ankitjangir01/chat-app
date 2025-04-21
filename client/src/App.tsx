// client/src/App.tsx
import { useEffect, useRef, useState } from 'react';
const wsUrl = import.meta.env.VITE_WS_URL;
const appName = import.meta.env.VITE_APP_NAME;

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
const [visibleHeight, setVisibleHeight] = useState(window.innerHeight);

useEffect(() => {
  const updateHeight = () => {
    const viewport = window.visualViewport;
    setVisibleHeight(viewport ? viewport.height : window.innerHeight);
  };

  updateHeight();

  window.visualViewport?.addEventListener("resize", updateHeight);
  window.addEventListener("resize", updateHeight); // fallback

  return () => {
    window.visualViewport?.removeEventListener("resize", updateHeight);
    window.removeEventListener("resize", updateHeight);
  };
}, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // useEffect(() => {
  //   const preventScroll = (e: TouchEvent) => {
  //     if (e.target === document.body || e.target === document.documentElement) {
  //       e.preventDefault();
  //     }
  //   };
  
  //   document.body.addEventListener("touchmove", preventScroll, { passive: false });
  //   return () => {
  //     document.body.removeEventListener("touchmove", preventScroll);
  //   };
  // }, []);
  

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
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
      setInput('');
    }
    // 👇 Refocus the input to keep keyboard open
  // setTimeout(() => {
  //   inputRef.current?.focus();
  // }, 0);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, height: visibleHeight, overflow: 'hidden', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{marginTop: 0}}>🟢 {appName || "Chat-app"}</h2>

      <div style={{
        border: '1px solid #ccc',
        padding: 10,
        overflowY: 'auto',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        flexGrow: 1,
        flexShrink: 1,
        minHeight: 0,
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 5, backgroundColor: '#d2edec', padding: '6px 12px', borderRadius: 12, width: 'fit-content' }}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message"
          style={{ flex: 1, padding: 10 }}
          ref={inputRef}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }} onMouseDown={(e) => e.preventDefault()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
