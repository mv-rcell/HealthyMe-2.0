
import React, { useState } from 'react';
import { MessageSquare, Send, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppQuery } from '@/hooks/useAppQuery';

const AppQueryAI = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const { askQuestion, loading, error } = useAppQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = query;
    setQuery('');
    
    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', message: userMessage }]);
    
    try {
      const response = await askQuestion(userMessage);
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { type: 'ai', message: response }]);
    } catch (err) {
      console.error('Query error:', err);
      setConversation(prev => [...prev, { 
        type: 'ai', 
        message: 'I apologize, but I encountered an error processing your question. Please try again.' 
      }]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Ask About Our App
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversation History */}
        <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-muted/30">
          {conversation.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Ask me anything about our health platform - features, services, how to use specific tools, or anything else!
            </p>
          ) : (
            conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground ml-4' 
                    : 'bg-background border mr-4'
                }`}>
                  <div className="flex items-start gap-2">
                    {msg.type === 'ai' && <Bot className="h-4 w-4 mt-0.5 text-primary" />}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-background border mr-4 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about features, services, how to book appointments..."
            disabled={loading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={loading || !query.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        {/* Example Questions */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "How do I book a lab test?",
              "What specialists are available?",
              "How does the AI health dashboard work?",
              "What membership plans do you offer?"
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setQuery(example)}
                disabled={loading}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppQueryAI;
