import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletter } from '@/hooks/useNewsletter';
import { CheckCircle, Mail, Bell, Heart } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { loading, subscribe } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    console.log('Subscribing email:', email);
    const success = await subscribe(email);
    console.log('Subscription result:', success);
    
    if (success) {
      setEmail('');
      setIsSubscribed(true);
      
      // Reset the success message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
            <h2 className="text-3xl font-bold text-green-600">Successfully Subscribed!</h2>
          </div>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Thank you for subscribing to our newsletter! You'll receive:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Health Tips</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">New Features</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Updates</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Wellness Insights</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Check your email for a welcome message with more details!
          </p>
          <Button 
            onClick={() => setIsSubscribed(false)}
            variant="outline"
          >
            Subscribe Another Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated with Health Tips</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest health insights, wellness tips, platform updates, and exclusive content delivered directly to your inbox.
        </p>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Health Insights</h4>
            <p className="text-xs text-muted-foreground">Evidence-based tips and research</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">New Features</h4>
            <p className="text-xs text-muted-foreground">First to know about updates</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Specialist Spotlights</h4>
            <p className="text-xs text-muted-foreground">Meet our healthcare experts</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Wellness Tips</h4>
            <p className="text-xs text-muted-foreground">Practical health advice</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !email.trim()}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          You'll receive a welcome email immediately after subscribing. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
