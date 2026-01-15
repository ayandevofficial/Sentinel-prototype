import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Shield, Loader2, Moon, Sun } from 'lucide-react';
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
}

const AdminChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content:
        'Welcome to Sentinel AI Admin Console. You have full access to security monitoring and system configuration. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------------- THE REAL BACKEND CALL ---------------- */
  const callSentinelPipeline = async (prompt: string) => {
    const res = await fetch('http://localhost:9000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error('Failed to reach Sentinel backend');
    }

    return res.json();
  };

  /* ---------------- UI HELPERS ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ---------------- SUBMIT HANDLER ---------------- */
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

      if (result.blocked) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content:
              '⚠️ **Security Violation Detected**\n\nThis request has been blocked by the ML-powered Shield.',
            timestamp: new Date(),
            securityScore: result.meta?.shield?.security_score,
            verdict: 'BLOCKED',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: result.output, // ✅ REAL GEMINI RESPONSE
            timestamp: new Date(),
            securityScore: result.meta?.shield?.security_score,
            verdict: 'CLEAN',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
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

  /* ---------------- JSX ---------------- */
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <DashboardHeader title="AI Chatbot">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
            <Sun className="w-4 h-4" />
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            <Moon className="w-4 h-4" />
          </div>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="gpt4">OpenAI GPT-4</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DashboardHeader>

      <motion.div className="flex-1 sentinel-card flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex gap-3',
                m.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {m.role !== 'user' && (
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className="bg-muted rounded-lg p-4 max-w-[70%]">
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>

                {m.verdict && (
                  <div className="flex gap-3 mt-2 pt-2 border-t">
                    <VerdictBadge verdict={m.verdict} />
                    {m.securityScore !== undefined && (
                      <span className="text-xs opacity-70">
                        Score: {m.securityScore.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Loader2 className="animate-spin" />
              <span>Processing…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex gap-3 border-t">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something…"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send />
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminChatbot;
