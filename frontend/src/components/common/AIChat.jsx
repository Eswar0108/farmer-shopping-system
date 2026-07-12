import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { Link } from 'react-router-dom';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your Farm Assistant. Ask me anything about our fresh harvest, fruits, grains, or dairy products!',
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await aiService.chat(userMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.message,
          products: res.products || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the service. Please try again later.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSuggest = (text) => {
    setInput(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition duration-200 cursor-pointer relative group border-0"
        >
          <MessageSquare size={24} />
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition duration-150 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md">
            Chat with Farm AI 🌾
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-200">
          {/* Header */}
          <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-700/60 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-100">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">Farm Assistant</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-ping" />
                  <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">AI Assistant Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-emerald-700/50 rounded-xl transition text-emerald-100 hover:text-white cursor-pointer border-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-white border border-gray-150 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Recommended Products cards inside assistant responses */}
                {msg.role === 'assistant' && msg.products && msg.products.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-2 w-full max-w-[90%]">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold ml-1">Matching Products:</p>
                    {msg.products.map((p) => (
                      <Link
                        to={`/products/${p.id}`}
                        key={p.id}
                        className="bg-white border border-gray-200 hover:border-emerald-500 rounded-xl p-2.5 flex items-center gap-3 transition shadow-sm hover:shadow-md no-underline"
                      >
                        <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="object-cover h-full w-full" />
                          ) : (
                            <span className="text-xl select-none">🌾</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-xs text-gray-850 truncate m-0">{p.name}</h5>
                          <p className="text-[10px] text-gray-400 font-semibold truncate m-0 mt-0.5">by {p.farmer}</p>
                          <span className="text-xs font-extrabold text-emerald-800 block mt-1">₹{p.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold pl-2">
                <Loader2 className="animate-spin" size={14} />
                <span>Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickSuggest("Suggest some fresh organic fruits")}
                className="px-2.5 py-1 bg-white border border-gray-200 hover:border-emerald-500 text-[11px] font-bold text-gray-650 hover:text-emerald-700 rounded-full transition shadow-sm cursor-pointer"
              >
                🍎 Organic fruits
              </button>
              <button
                onClick={() => handleQuickSuggest("Show me available dairy products")}
                className="px-2.5 py-1 bg-white border border-gray-200 hover:border-emerald-500 text-[11px] font-bold text-gray-650 hover:text-emerald-700 rounded-full transition shadow-sm cursor-pointer"
              >
                🥛 Fresh Dairy
              </button>
              <button
                onClick={() => handleQuickSuggest("Recommend premium grains")}
                className="px-2.5 py-1 bg-white border border-gray-200 hover:border-emerald-500 text-[11px] font-bold text-gray-650 hover:text-emerald-700 rounded-full transition shadow-sm cursor-pointer"
              >
                🌾 Premium Grains
              </button>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-150 bg-white flex items-center gap-2 m-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops, prices, stock..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-9 w-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
