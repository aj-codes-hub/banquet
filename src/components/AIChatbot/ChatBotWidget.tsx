import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, ArrowRight, Minimize2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import type { ChatMessage } from '../../types';
import { INITIAL_CHAT_MESSAGE, getBotResponse } from './chatData';

export const ChatBotWidget: React.FC = () => {
  const { isChatbotOpen, toggleChatbot, openBookingModal, settings } = useBooking();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_CHAT_MESSAGE]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const responseData = getBotResponse(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickChips: responseData.quickChips,
        actionLink: responseData.actionLink
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionTrigger = (actionLink: any) => {
    if (actionLink.action === 'open_booking_hall') {
      openBookingModal(actionLink.payload);
    } else if (actionLink.action === 'open_booking') {
      openBookingModal();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isChatbotOpen && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-6 right-6 z-40 group p-4 rounded-full gold-gradient-bg text-slate-950 shadow-2xl shadow-[#D4AF37]/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-3 border border-white/20 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline">
            AI Event Concierge
          </span>
        </button>
      )}

      {/* Expanded Chat Widget Panel */}
      {isChatbotOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-[#0A0F1D]/95 backdrop-blur-2xl border border-[#D4AF37]/40 rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] border-b border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#997A15] to-[#FFF5C0] p-[1px]">
                <div className="w-full h-full bg-[#0A0F1D] rounded-full flex items-center justify-center text-[#D4AF37]">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-sm flex items-center gap-1.5">
                  Aura AI Concierge
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online •</span>
                  {settings ? settings.businessName : '…'}
                  <span>AI</span>
                </span>
              </div>
            </div>

            <button
              onClick={toggleChatbot}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl font-light leading-relaxed ${
                      msg.sender === 'user'
                        ? 'gold-gradient-bg text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900/90 text-gray-200 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <span className="text-[9px] opacity-60 block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Action Link Button */}
                  {msg.actionLink && (
                    <button
                      onClick={() => handleActionTrigger(msg.actionLink)}
                      className="w-full py-2 px-3 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#FFF5C0] font-bold text-[11px] flex items-center justify-between transition-colors shadow-sm cursor-pointer"
                    >
                      <span>{msg.actionLink.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Quick Chips */}
                  {msg.quickChips && msg.quickChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white text-[10px] border border-slate-700 transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-[10px] italic">
                <Bot className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
                <span>Aura is typing suggestions...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Aura about halls, pricing, dates..."
              className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:border-[#D4AF37] outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-xl gold-gradient-bg text-slate-950 hover:brightness-110 transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
