import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, sendMessage, clearMessages } from "../../redux/slices/aiSlice";
import chatIcon from "../../../assets/chat-icon.png";

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messages = useSelector((state) => state.ai.messages);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(sendMessage(input));
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-40 right-4 lg:right-6 z-50">

      {/* NÚT MỞ CHAT*/}
      <button
        onClick={() => setOpen(!open)}
        className="group relative w-12 h-12 lg:w-16 lg:h-16 rounded-full shadow-xl 
                   bg-gradient-to-br from-blue-500 to-purple-600 p-1 
                   hover:scale-110 hover:shadow-purple-500/50 
                   transition-all duration-300 
                   flex items-center justify-center 
                   overflow-hidden 
                   animate-bounce"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-full" />

        {/* Đèn xanh lan tỏa */}
        <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-75 group-hover:opacity-90"></span>

        {/* Icon AI */}
        <img
          src={chatIcon}
          alt="AI Chat"
          className="relative z-10 w-full h-full rounded-full object-cover p-2 bg-white"
        />
      </button>

      {/* POPUP CHAT */}
      {open && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 animate-in fade-in zoom-in-95 duration-300 origin-bottom-right">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Trợ lý AI</h3>
                    <p className="text-xs opacity-90">Luôn sẵn sàng hỗ trợ bạn</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tin nhắn */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm italic py-8">
                  <p>Chào bạn! Hỏi mình về sản phẩm, bảo quản, hoặc liên hệ shop nhé</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} animate-fade`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${
                        m.from === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="font-medium mb-1 opacity-80">
                        {m.from === "user" ? "Bạn" : "Shop AI"}
                      </p>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi về quần áo, bảo quản, liên hệ shop..."
                  className="flex-1  px-2 py-2 lg:px-4 lg:py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                             rounded-xl hover:from-blue-600 hover:to-purple-700 
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Gửi
                </button>
              </div>

              <button
                onClick={() => dispatch(clearMessages())}
                className="mt-3 w-full text-xs lg:text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Xóa toàn bộ tin nhắn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;