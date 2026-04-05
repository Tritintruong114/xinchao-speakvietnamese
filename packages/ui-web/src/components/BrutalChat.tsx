"use client";

import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'app' | 'seller';
  delay: number;
  hasAudio?: boolean;
}

const MESSAGES: Message[] = [
  { id: 1, text: "Excuse me, how much is this phở?", sender: 'user', delay: 1000 },
  { id: 2, text: "Bao nhiêu tiền bát phở này?", sender: 'app', delay: 2000, hasAudio: true },
  { id: 3, text: "Ba mươi nghìn đồng em ơi!", sender: 'seller', delay: 2500 },
  { id: 4, text: "That's 30,000 VND (~$1.20). Cheap!", sender: 'app', delay: 2000 },
];

export const BrutalChat: React.FC = () => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < MESSAGES.length) {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, MESSAGES[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, MESSAGES[currentIndex].delay);

      return () => clearTimeout(timer);
    } else {
      // Loop after 5 seconds
      const loopTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 5000);
      return () => clearTimeout(loopTimer);
    }
  }, [currentIndex]);

  return (
    <div className="space-y-4 py-2">
      {visibleMessages.map((msg) => (
        <div 
          key={msg.id} 
          className={cn(
            "max-w-[85%] p-3 border-2 border-text-main rounded-xl brutal-shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
            msg.sender === 'user' && "bg-white self-start ml-2 mr-auto rounded-bl-none",
            msg.sender === 'app' && "bg-brand-yellow self-end mr-2 ml-auto rounded-br-none",
            msg.sender === 'seller' && "bg-brand-mint self-start ml-2 mr-auto rounded-bl-none italic"
          )}
        >
          <div className="text-sm font-black flex items-center gap-2">
             {msg.text}
             {msg.hasAudio && <Volume2 size={14} className="text-brand-red animate-pulse" />}
          </div>
        </div>
      ))}
    </div>
  );
};
