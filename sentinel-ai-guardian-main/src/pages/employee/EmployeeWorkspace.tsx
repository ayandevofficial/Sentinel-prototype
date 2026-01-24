import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ChevronDown, Shield, AlertTriangle, Moon, Sun } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  securityInfo?: {
    verdict: 'CLEAN' | 'BLOCKED';
    score: number;
    redactedEntities?: string[];
  };
}

const AI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
];

const EmployeeWorkspace: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hello! I'm your secure AI assistant. All your prompts are automatically protected by Sentinel AI. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // ✅ FIX 1: Unique ID for User Message
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // ✅ FIX 2: Vercel Environment Variable Logic
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
      
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: userMessage.content,
            model: selectedModel.id 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // ✅ FIX 3: Unique ID for Bot Message
      const botId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      if (data.blocked) {
        setMessages((prev) => [...prev, {
          id: botId,
          role: 'system',
          content: '🛡️ **Security Violation: Blocked by Sentinel**\n\n' + data.output,
          timestamp: new Date(),
          securityInfo: {
            verdict: 'BLOCKED',
            score: data.meta?.shield?.score || 0,
          },
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: botId,
          role: 'assistant',
          content: data.output,
          timestamp: new Date(),
          securityInfo: {
            verdict: 'CLEAN',
            score: data.meta?.shield?.score || 1,
            redactedEntities: data.meta?.scrub?.redactions 
                ? Object.keys(data.meta.scrub.redactions).map(k => k.replace(/[[\]_\d]/g, ''))
                : [],
          },
        }]);
      }
    } catch (error) {
      console.error('Connection Error:', error);
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: 'system',
        content: '⚠️ **Connection Error**: Could not reach the security orchestrator. Please check your internet or try again later.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <DashboardHeader title="AI Workspace">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            <Moon className="w-4 h-4 text-muted-foreground" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedModel.name} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {AI_MODELS.map((model) => (
                <DropdownMenuItem key={model.id} onClick={() => setSelectedModel(model)}>
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{model.provider}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DashboardHeader>

      <div className="flex-1 sentinel-card flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                // ✅ FIX 4: Better Layout Alignment
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Role Icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                    m.role === 'user' ? 'bg-primary text-white' : 
                    m.role === 'system' ? 'bg-destructive/10 text-destructive' : 'bg-muted border border-border'
                }`}>
                  {m.role === 'user' ? <User size={18}/> : m.role === 'system' ? <AlertTriangle size={18}/> : <Bot size={18}/>}
                </div>
<div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
  m.role === 'user' 
    ? 'bg-primary text-white rounded-tr-none' 
    : 'bg-muted text-foreground rounded-tl-none border border-border'
}`}>
               
