import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const suggestedQuestions = [
  "What's the age limit for NDA?",
  "How much does the civilian route cost?",
  "What is a Class 1 medical certificate?",
  "NDA vs civilian — which is better?",
];

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything about becoming a pilot in India — roadmap steps, costs, NDA vs civilian, flying schools, or exam basics.", sources: [] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const askSuggested = (question) => {
    setInput(question);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: userMessage });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer, sources: res.data.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Try again.", sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-cloud font-sans flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <h1 className="text-xl font-semibold">Aviation Knowledge Assistant</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-sm text-cloud/60 hover:text-alert transition"
          >
            Clear Chat
          </button>
          <button onClick={() => navigate("/dashboard")} className="text-sm text-cloud/60 hover:text-amber transition">
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-2xl w-full mx-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              m.role === "user" ? "bg-amber text-charcoal" : "bg-steel border border-white/10"
            }`}>
              <p className="text-sm whitespace-pre-wrap">{m.text}</p>
              {m.sources?.length > 0 && (
                <p className="text-xs text-cloud/50 mt-2 font-mono">Sources: {m.sources.join(", ")}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-steel border border-white/10 rounded-lg p-3">
              <p className="text-sm text-cloud/50 font-mono">Thinking...</p>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => askSuggested(q)}
                className="text-xs bg-steel border border-amber/30 text-amber/80 px-3 py-1.5 rounded-full hover:bg-amber/10 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-6 border-t border-white/10 max-w-2xl w-full mx-auto">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about NDA, costs, flying schools..."
            rows={1}
            className="flex-1 bg-steel border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-amber text-charcoal px-4 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-30"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;