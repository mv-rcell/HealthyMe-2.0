import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppQuery } from '@/hooks/useAppQuery';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AppQueryAI = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your HealthyMe assistant. I can help you with questions about the app, its features, how to book appointments, find specialists, use AI recommendations, and more. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const { askQuestion, loading } = useAppQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');

    const response = await askQuestion(query);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Ask About HealthyMe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="max-h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-white border mr-auto'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white border rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                placeholder="Ask me anything about HealthyMe - features, appointments, specialists, AI recommendations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Quick Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery("How do I book an appointment with a specialist?")}
                className="text-left justify-start h-auto p-3"
              >
                How do I book an appointment?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery("What AI features are available in the app?")}
                className="text-left justify-start h-auto p-3"
              >
                What AI features are available?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery("How do I access my health dashboard?")}
                className="text-left justify-start h-auto p-3"
              >
                How do I access my dashboard?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery("What types of specialists are available?")}
                className="text-left justify-start h-auto p-3"
              >
                What specialists are available?
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppQueryAI;
