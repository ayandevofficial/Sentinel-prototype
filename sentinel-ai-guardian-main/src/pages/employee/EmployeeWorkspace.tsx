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
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your secure AI assistant. All your prompts are automatically protected by Sentinel AI. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('what is python');
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
      const response = await fetch('http://localhost:9000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: input,
            model: selectedModel.id 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();

      if (data.blocked) {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
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
          id: Date.now().toString(),
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
        id: Date.now().toString(),
        role: 'system',
        content: '⚠️ **Connection Error**: Could not reach the security orchestrator.',
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.role === 'user' ? 'bg-primary' : m.role === 'system' ? 'bg-destructive/10 text-destructive' : 'bg-muted'}`}>
                  {m.role === 'user' ? <User size={16}/> : m.role === 'system' ? <AlertTriangle size={16}/> : <Bot size={16}/>}
                </div>
                <div className={`flex-1 max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  </div>
                  {m.securityInfo && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield size={12} />
                      <span>
                        {(m.securityInfo.score * 100).toFixed(0)}% • 
                        <span className={m.securityInfo.verdict === 'CLEAN' ? 'text-green-500' : 'text-red-500'}> {m.securityInfo.verdict}</span>
                        {m.securityInfo.redactedEntities?.length! > 0 && ` • Redacted: ${m.securityInfo.redactedEntities?.join(', ')}`}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && <div className="text-sm text-muted-foreground animate-pulse">Sentinel is processing your request...</div>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-3">
            <Textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask anything..." 
              className="min-h-[50px] resize-none"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}><Send size={16}/></Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeWorkspace;