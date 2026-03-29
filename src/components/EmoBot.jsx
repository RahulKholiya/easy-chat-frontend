import { useState } from "react";
import { Copy, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const EmoBot = () => {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: `Hi 👋 I am EMO, your AI assistant.

I can help you with:
• Answering your questions  
• Fixing grammar mistakes  
• Improving conversations  
• Chat suggestions  

Ask me anything `,
        },
    ]);
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
  if (!question.trim()) return;

  const userMsg = { role: "user", text: question };
  setMessages((prev) => [...prev, userMsg]);
  setQuestion("");
  setLoading(true);

  try {
    const res = await axios.post("/api/ai", {
      prompt: question,
    });

    const botMsg = {
      role: "bot",
      text: res.data.answer || "No response",
    };

    setMessages((prev) => [...prev, botMsg]);
  } catch (err) {
    console.log(err.response?.data || err.message);

    const botMsg = {
      role: "bot",
      text: "⚠️ AI is currently unavailable",
    };

    setMessages((prev) => [...prev, botMsg]);
  } finally {
    setLoading(false);
  }
};

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied!");
    };

    return (
        <>
            {/*  FLOATING EMO */}
            <div
                className="fixed top-8 right-10 cursor-pointer z-50"
                onClick={() => setOpen(true)}
            >
                <img
                    src="/emo.png"
                    alt="emo"
                    onClick={() => setOpen(true)}
                    className="w-24 md:w-28 emo-animate cursor-pointer hover:scale-110 transition drop-shadow-2xl"
                />

                {/*DEFAULT  */}
                {!open && (
                    <span className="text-xs mt-1 bg-base-200 px-2 py-1 rounded-lg shadow">
                        Ask EMO
                    </span>
                )}
            </div>
            {/* CHAT BOX */}
            {open && (
                <div className="fixed top-40 right-6 w-80 bg-base-100 shadow-2xl rounded-xl flex flex-col z-50">

                    {/* HEADER */}
                    <div className="flex justify-between items-center p-3 border-b">
                        <span className="font-semibold">EMO </span>
                        <X
                            className="cursor-pointer"
                            onClick={() => setOpen(false)}
                        />
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-2">
                        {messages?.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg text-sm ${msg.role === "user"
                                    ? "bg-primary text-white self-end"
                                    : "bg-base-200"
                                    }`}
                            >
                                {msg.text}

                                {/* COPY BUTTON */}
                                {msg.role === "bot" && (
                                    <div className="flex justify-end mt-1">
                                        <Copy
                                            size={14}
                                            className="cursor-pointer"
                                            onClick={() => copyText(msg.text)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="text-sm opacity-60">Typing...</div>
                        )}
                    </div>

                    {/* INPUT */}
                    <div className="p-2 border-t flex gap-2">
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask EMO..."
                            className="input input-sm input-bordered w-full"
                        />
                        <button
                            onClick={askAI}
                            className="btn btn-sm btn-primary"
                        >
                            Ask
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmoBot;