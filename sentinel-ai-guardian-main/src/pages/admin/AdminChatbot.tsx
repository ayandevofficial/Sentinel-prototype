import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Loader2, Moon, Sun, Shield } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import VerdictBadge from '@/components/VerdictBadge';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  securityScore?: number;
  verdict?: 'CLEAN' | 'BLOCKED';
  redactedEntities?: string[]; // ✅ FIX 1: Added missing field
}

const AdminChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to Sentinel AI Admin Console. Security monitoring is active.',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const callSentinelPipeline = async (prompt: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error('Sentinel Backend Unreachable');
    return res.json();
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await callSentinelPipeline(input);
      const isBlocked = result.blocked;

      // ✅ FIX 2: Extract redacted entities from API response
      const redactedList = result.meta?.scrub?.redactions
        ? Object.keys(result.meta.scrub.redactions).map(k => k.replace(/[[\]_\d]/g, ''))
        : [];

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: isBlocked 
            ? '⚠️ **Security Violation Detected**\n\nThis request has been blocked by the ML Shield.' 
            : result.output,
          timestamp: new Date(),
          securityScore: result.meta?.shield?.security_score,
          verdict: isBlocked ? 'BLOCKED' : 'CLEAN',
          redactedEntities: redactedList, // ✅ Save extracted entities
        },
      ]);
    } catch (err) {
      console.error('Pipeline Execution Error:', err);
      setMessages((prev) => [
        ...prev, 
        {
            id: Date.now().toString(),
            role: 'system',
            content: "⚠️ Error: Could not connect to Sentinel Backend.",
            timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="h-dvh md:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      
      <DashboardHeader title="AI Chatbot">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 md:gap-2 bg-muted/50 rounded-lg px-2 py-1 md:px-3 md:py-1.5">
            <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-28 md:w-48 h-8 md:h-10 text-[10px] md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Gemini Pro</SelectItem>
              <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
              <SelectItem value="claude">Claude 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DashboardHeader>

      <motion.div className="flex-1 sentinel-card flex flex-col overflow-hidden bg-card/50 backdrop-blur-md border rounded-t-2xl md:rounded-xl">
        
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex gap-2 md:gap-3 items-start',
                m.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {m.role !== 'user' && (
                <div className="hidden sm:flex w-8 h-8 bg-primary/10 rounded-lg items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}

              <div className={cn(
                "rounded-2xl p-3 md:p-4 text-sm shadow-sm transition-all",
                m.role === 'user' 
                  ? "bg-primary text-primary-foreground max-w-[85%] md:max-w-[70%]" 
                  : "bg-muted text-foreground max-w-[90%] md:max-w-[75%]"
              )}>
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

                {/* ✅ FIX 3: UI Logic to show Redacted Badge */}
                {m.redactedEntities && m.redactedEntities.length > 0 &&
