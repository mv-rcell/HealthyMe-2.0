import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
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
  updated_at?: string;
  metadata?: any;
}

const Payments = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get('plan');
  const initialAmount = queryParams.get('amount') ? parseInt(queryParams.get('amount')!) : 1000;

  const [amount, setAmount] = useState<number>(initialAmount);
  const [paymentMethod, setPaymentMethod] = useState<string>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(!!planId);

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

  const getPlanName = (id: string | null) => {
    if (!id) return '';
    const plan = {
      'starter': 'Starter Membership',
      'pro': 'Pro Membership',
      'elite': 'Elite Membership'
    }[id.toLowerCase()];
    return plan || '';
  };

  // Poll payment status for real-time updates
  const pollPaymentStatus = (transactionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const { data: payment, error } = await supabase
          .from('payments')
          .select('payment_status')
          .eq('transaction_id', transactionId)
          .single();

        if (error) {
          console.error('Polling error:', error);
          return;
        }

        if (payment.payment_status === 'successful') {
          toast.success('Payment completed successfully!');
          queryClient.invalidateQueries({ queryKey: ['payments', user?.id] });
          clearInterval(pollInterval);
        } else if (payment.payment_status === 'failed') {
          toast.error('Payment failed. Please try again.');
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    setTimeout(() => clearInterval(pollInterval), 120000); // Stop after 2 minutes
  };

  // 🔹 Handle M-Pesa payment
  const handleMpesaPayment = async () => {
    if (!user) return toast.error('You must be logged in');

    if (!phoneNumber || phoneNumber.length < 10)
      return toast.error('Enter a valid phone number');

    if (amount < 1) return toast.error('Amount must be at least 1 KES');

    try {
      setProcessingPayment(true);
      toast.info('Initiating M-Pesa payment...');

      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          amount,
          phoneNumber,
          userId: user.id,
          membershipTier: planId ? getPlanName(planId) : null,
        },
      });

      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error || 'Payment failed');

      toast.success('Payment request sent! Check your phone for prompt');
      pollPaymentStatus(data.checkoutRequestId);
      queryClient.invalidateQueries({ queryKey: ['payments', user.id] });
      setDialogOpen(false);
    } catch (err: any) {
      console.error('M-Pesa payment error:', err);
      toast.error(`Payment failed: ${err.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  // 🔹 Handle PesaPal payment
  const handlePesaPalPayment = async () => {
    if (!user) return toast.error('You must be logged in');

    try {
      setProcessingPayment(true);
      toast.info('Redirecting to PesaPal...');

      const { data, error } = await supabase.functions.invoke('pesapal-payment', {
        body: {
          amount,
          userId: user.id,
          membershipTier: planId ? getPlanName(planId) : null,
        },
      });

      if (error) throw new Error(error.message);
      if (!data.checkoutUrl) throw new Error('PesaPal initialization failed');

      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error('PesaPal payment error:', err);
      toast.error(`Payment failed: ${err.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  // 🔹 Unified handler based on selected tab
  const handlePayment = async () => {
    if (paymentMethod === 'mpesa') await handleMpesaPayment();
    else if (paymentMethod === 'pesapal') await handlePesaPalPayment();
    else toast.error('Payment method not supported');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col mobile-safe-area">
        <Navbar />
        <div className="container mx-auto mobile-padding py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mobile-safe-area">
      <Navbar />
      <div className="container mx-auto mobile-padding py-8 sm:py-16 flex-grow">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground mt-1">Make secure payments with M-Pesa or PesaPal</p>
          </div>

          {/* Payment Dialog with Tabs */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="flex justify-center">
              <DialogTrigger asChild>
                <Button className="mobile-button w-full sm:w-auto">
                  {planId ? `Pay for ${getPlanName(planId)}` : 'Make a Payment'}
                </Button>
              </DialogTrigger>
            </div>

            <DialogContent className="payment-modal-content">
              <DialogHeader>
                <DialogTitle className="text-center">
                  {planId ? `Pay for ${getPlanName(planId)}` : 'Select Payment Method'}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {planId
                    ? `You're paying for ${getPlanName(planId)} plan`
                    : 'Choose your preferred payment method'}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <TabsList className="justify-center">
                  <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
                  <TabsTrigger value="pesapal">PesaPal</TabsTrigger>
                </TabsList>

                {/* M-Pesa Tab */}
                <TabsContent value="mpesa" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      disabled={!!planId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">M-Pesa Phone Number</Label>
                    <Input
                      id="phone-number"
                      placeholder="07XXXXXXXX or 254XXXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your M-Pesa registered phone number
                    </p>
                  </div>
                </TabsContent>

                {/* PesaPal Tab */}
                <TabsContent value="pesapal" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount-pesapal">Amount (KES)</Label>
                    <Input
                      id="amount-pesapal"
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      disabled={!!planId}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You will be redirected to PesaPal to complete your payment.
                  </p>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="mobile-button w-full sm:w-auto"
                  disabled={processingPayment}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="mobile-button w-full sm:w-auto"
                >
                  {processingPayment ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay KES ${amount}`
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Payment History */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPayments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading payment history...</p>
                </div>
              ) : !payments || payments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No payment history yet</p>
                  <Button variant="link" onClick={() => setDialogOpen(true)}>
                    Make your first payment
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Mobile-friendly */}
                  <div className="space-y-4 sm:hidden">
                    {payments.map((payment) => (
                      <Card key={payment.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">KES {payment.amount}</span>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              payment.payment_status === 'successful' 
                                ? 'bg-green-100 text-green-800' 
                                : payment.payment_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.payment_status}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>{new Date(payment.created_at).toLocaleDateString()}</p>
                            <p>{payment.payment_method.toUpperCase()} Payment</p>
                            {payment.transaction_id && (
                              <p className="text-xs">ID: {payment.transaction_id}</p>
                            )}
                            {payment.membership_plan && (
                              <p className="text-xs">Plan: {getPlanName(payment.membership_plan)}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <table className="w-full border-collapse hidden sm:table">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Method</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Plan</th>
                        <th className="text-left py-2">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-muted/50">
                          <td className="py-3">{new Date(payment.created_at).toLocaleDateString()}</td>
                          <td className="py-3">KES {payment.amount}</td>
                          <td className="py-3">{payment.payment_method.toUpperCase()}</td>
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
                          <td className="py-3 text-sm text-muted-foreground">
                            {payment.membership_plan ? getPlanName(payment.membership_plan) : 'N/A'}
                          </td>
                          <td className="py-3 text-xs text-muted-foreground">
                            {payment.transaction_id || 'N/A'}
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
