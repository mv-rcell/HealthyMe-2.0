import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import  Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  created_at: string;
  membership_plan?: string | null;
}

const Payments = () => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Parse URL params
  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get('plan');
  const initialAmount = queryParams.get('amount') ? parseInt(queryParams.get('amount')!) : 1000;
  
  const [amount, setAmount] = useState<number>(initialAmount);
  const [paymentMethod, setPaymentMethod] = useState<string>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(!!planId); // Open dialog automatically if plan is specified

  // Fetch user's payments
  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ['payments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Get plan name
  const getPlanName = (id: string | null) => {
    if (!id) return '';
    const plan = {
      'starter': 'Starter Membership',
      'pro': 'Pro Membership',
      'elite': 'Elite Membership'
    }[id.toLowerCase()];
    return plan || '';
  };

  // Simulate payment processing
  const handlePayment = async () => {
    if (!user) {
      toast.error('You must be logged in to make a payment');
      return;
    }
    
    try {
      setProcessingPayment(true);
      
      // In a real implementation, you would call your payment API endpoint here
      // This is a simulation for demonstration purposes
      
      // Simulated successful payment
      const newPayment = {
        user_id: user.id,
        amount,
        currency: 'KES',
        payment_method: paymentMethod,
        payment_status: 'successful',
        transaction_id: `SIM_${Math.random().toString(36).substr(2, 9)}`,
        membership_plan: planId,
      };
      
      const { data, error } = await supabase
        .from('payments')
        .insert(newPayment)
        .select()
        .single();
        
      if (error) throw error;

      // If this is a membership payment, update the user's profile
      if (planId && user.id) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ membership_tier: planId })
          .eq('id', user.id);
          
        if (updateError) {
          console.error('Error updating membership tier:', updateError);
          // Continue with success message but log the error
        }
      }
      
      toast.success(`Payment of ${amount/100} KES processed successfully`);
      queryClient.invalidateQueries({ queryKey: ['payments', user.id] });
      setDialogOpen(false);
      
      // After successful payment for membership, redirect to memberships page
      if (planId) {
        setTimeout(() => {
          navigate('/memberships');
          toast.success(`You are now a ${getPlanName(planId)} member!`);
        }, 1500);
      }
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Format amount for display
  const formatAmount = (amount: number) => {
    return (amount/100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Payments</h1>
              <p className="text-gray-600">Manage your payment methods and view payment history</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">Make a Payment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {planId 
                      ? `Complete your ${getPlanName(planId)} payment`
                      : 'Make a Payment'
                    }
                  </DialogTitle>
                  <DialogDescription>
                    {planId 
                      ? `You're about to pay for the ${getPlanName(planId)} plan.`
                      : 'Choose your payment method and enter the details below'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="100"
                      value={amount / 100}
                      onChange={(e) => setAmount(Number(e.target.value) * 100)}
                      disabled={!!planId}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Tabs defaultValue="mpesa" onValueChange={setPaymentMethod} className="w-full">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
                        <TabsTrigger value="card">Card</TabsTrigger>
                        <TabsTrigger value="bank">Bank</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="mpesa" className="pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone-number">Phone Number</Label>
                          <Input
                            id="phone-number"
                            placeholder="254712345678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="card" className="pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="bank" className="pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input id="account-number" placeholder="12345678" />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handlePayment} disabled={processingPayment}>
                    {processingPayment ? 'Processing...' : `Pay ${formatAmount(amount)} KES`}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your previous transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPayments ? (
                <p>Loading payment history...</p>
              ) : !payments || payments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payment history yet</p>
                  <Button variant="link" onClick={() => setDialogOpen(true)}>
                    Make your first payment
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Method</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            {formatAmount(payment.amount)} {payment.currency}
                          </td>
                          <td className="py-3 capitalize">{payment.payment_method}</td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              payment.payment_status === 'successful' 
                                ? 'bg-green-100 text-green-800' 
                                : payment.payment_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.payment_status}
                            </span>
                          </td>
                          <td className="py-3">
                            {payment.membership_plan && (
                              <span className="text-sm text-gray-600">
                                {getPlanName(payment.membership_plan)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
