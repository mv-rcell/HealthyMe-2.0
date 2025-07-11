import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ClientProfile {
  id: string;
  full_name: string | null;
  membership_tier: string | null;
  profile_picture_url: string | null;
  bio: string | null;
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for beginners and casual fitness enthusiasts.",
    price: 1999,
    priceDisplay: "KES 1,999",
    features: [
      "General fitness assessment",
      "Access to basic workout equipment",
      "2 group classes per month",
      "Basic fitness tracking",
    ],
    color: "border-primary/20",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for dedicated fitness enthusiasts ready to level up.",
    price: 3999,
    priceDisplay: "KES 3,999",
    features: [
      "Comprehensive fitness assessment",
      "Full gym access 24/7",
      "10 group classes per month",
      "1 personal training session",
      "Advanced fitness tracking",
      "Nutrition consultation",
    ],
    color: "border-primary",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    description: "The ultimate fitness experience for maximum results.",
    price: 7999,
    priceDisplay: "KES 7,999",
    features: [
      "Expert fitness assessment",
      "VIP gym access 24/7",
      "Unlimited group classes",
      "4 personal training sessions",
      "Premium fitness tracking",
      "Personalized nutrition plan",
      "Recovery services",
      "Priority booking",
    ],
    color: "border-primary/20",
    popular: false,
  },
];

const Membership = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientProfiles, setClientProfiles] = useState<{
    starter: ClientProfile[];
    pro: ClientProfile[];
    elite: ClientProfile[];
  }>({
    starter: [],
    pro: [],
    elite: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [userMembership, setUserMembership] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientProfiles = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, membership_tier, profile_picture_url, bio")
          .eq("role", "client")
          .not("membership_tier", "is", null);

        if (error) {
          console.error("Error fetching client profiles:", error);
          return;
        }

        const profiles = data as ClientProfile[];
        const groupedProfiles = {
          starter: profiles.filter((profile) => profile.membership_tier?.toLowerCase() === "starter"),
          pro: profiles.filter((profile) => profile.membership_tier?.toLowerCase() === "pro"),
          elite: profiles.filter((profile) => profile.membership_tier?.toLowerCase() === "elite"),
        };
        
        setClientProfiles(groupedProfiles);
      } catch (error) {
        console.error("Error in fetching client profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientProfiles();
  }, []);

  // Fetch user's current membership
  useEffect(() => {
    const fetchUserMembership = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("membership_tier")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user membership:", error);
          return;
        }

        setUserMembership(data?.membership_tier?.toLowerCase() || null);
      } catch (error) {
        console.error("Error fetching user membership:", error);
      }
    };

    fetchUserMembership();
  }, [user]);

  const handlePlanSelection = (plan: typeof plans[0]) => {
    if (!user) {
      toast.error("Please log in to subscribe to a membership plan");
      navigate("/auth");
      return;
    }

    // Check if user already has this plan
    if (userMembership === plan.id) {
      toast.info("You already have this membership plan");
      return;
    }

    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };

  const handleMpesaPayment = async () => {
    if (!user || !selectedPlan) {
      toast.error("Please select a membership plan");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number (e.g., 0712345678)");
      return;
    }

    try {
      setProcessingPayment(true);
      
      toast.info("Initiating M-Pesa payment...");
      console.log('Initiating payment for:', {
        amount: selectedPlan.price,
        phoneNumber,
        userId: user.id,
        membershipTier: selectedPlan.name
      });
      
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          amount: selectedPlan.price,
          phoneNumber: phoneNumber,
          userId: user.id,
          membershipTier: selectedPlan.name
        }
      });

      console.log('M-Pesa payment response:', data);
      console.log('M-Pesa payment error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Payment function error');
      }

      if (data && data.success) {
        toast.success("Payment request sent successfully!");
        toast.info("Please check your phone for the M-Pesa prompt and enter your PIN");
        
        // Start polling for payment status
        pollPaymentStatus(data.checkoutRequestId, selectedPlan.id);
        setPaymentDialogOpen(false);
        setPhoneNumber(""); // Clear phone number
      } else {
        throw new Error(data?.error || 'Payment failed - invalid response');
      }
    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  const pollPaymentStatus = (checkoutRequestId: string, membershipTier: string) => {
    let pollCount = 0;
    const maxPolls = 40; // 2 minutes with 3-second intervals
    
    const pollInterval = setInterval(async () => {
      try {
        pollCount++;
        console.log(`Polling payment status (${pollCount}/${maxPolls}) for:`, checkoutRequestId);
        
        const { data: payments, error } = await supabase
          .from('payments')
          .select('payment_status')
          .eq('transaction_id', checkoutRequestId)
          .single();

        if (error) {
          console.error('Error polling payment status:', error);
          return;
        }

        console.log('Payment status:', payments.payment_status);

        if (payments.payment_status === 'successful') {
          toast.success('🎉 Payment completed successfully! Your membership has been activated.');
          
          // Update local state
          setUserMembership(membershipTier);
          clearInterval(pollInterval);
          
          // Refresh the page to show updated membership
          window.location.reload();
        } else if (payments.payment_status === 'failed') {
          toast.error('❌ Payment failed. Please try again or contact support.');
          clearInterval(pollInterval);
        } else if (pollCount >= maxPolls) {
          toast.warning('⏰ Payment is taking longer than expected. Please check your M-Pesa messages or try again.');
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
        }
      }
    }, 3000);
  };

  // Function to get initials from name
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section id="membership" className="py-24 sm:py-32 bg-slate-50/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-sm font-medium text-primary mb-6">
            Membership Plans
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Find the Perfect Plan for Your Fitness Journey
          </h2>
          <p className="text-muted-foreground">
            Choose from our flexible membership options designed to fit your
            fitness goals, schedule, and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = userMembership === plan.id;
            
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg",
                  "border-2",
                  plan.color,
                  plan.popular && "md:scale-105 z-10",
                  isCurrentPlan && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-8 translate-y-[-50%] bg-primary text-white text-sm font-medium py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                )}

                {isCurrentPlan && (
                  <span className="absolute top-0 left-8 translate-y-[-50%] bg-green-500 text-white text-sm font-medium py-1 px-3 rounded-full">
                    Your Plan
                  </span>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl md:text-4xl font-bold">
                      {plan.priceDisplay}
                    </span>
                    <span className="text-muted-foreground ml-2">/ month</span>
                  </div>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      plan.popular && "bg-primary text-white hover:bg-primary/90",
                      isCurrentPlan && "bg-green-500 hover:bg-green-600"
                    )}
                    onClick={() => handlePlanSelection(plan)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? "Current Plan" : `Choose ${plan.name}`}
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    WHAT'S INCLUDED
                  </h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Client Profiles Section */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-sm font-medium mb-4">
                    {plan.name.toUpperCase()} MEMBERS
                  </h4>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clientProfiles[plan.id.toLowerCase() as keyof typeof clientProfiles].length > 0 ? (
                        clientProfiles[plan.id.toLowerCase() as keyof typeof clientProfiles].map((profile) => (
                          <div key={profile.id} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.profile_picture_url || undefined} alt={profile.full_name || ""} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(profile.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{profile.full_name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No members yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                Subscribe to {selectedPlan?.name} Plan
              </DialogTitle>
              <DialogDescription className="text-center">
                Complete your M-Pesa payment to activate your {selectedPlan?.name} membership
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold text-lg">{selectedPlan?.name}</h3>
                <p className="text-2xl font-bold text-primary">{selectedPlan?.priceDisplay}</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone-number">M-Pesa Phone Number</Label>
                <Input
                  id="phone-number"
                  placeholder="07XXXXXXXX or 254XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mobile-input"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your M-Pesa registered phone number
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPaymentDialogOpen(false)}
                className="w-full sm:w-auto"
                disabled={processingPayment}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMpesaPayment} 
                disabled={processingPayment}
                className="w-full sm:w-auto"
              >
                {processingPayment ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ${selectedPlan?.priceDisplay}`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Members Showcase */}
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Our Member Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {Object.entries(clientProfiles).map(([tier, profiles]) => (
              <div key={tier} className="space-y-6">
                <h3 className="text-xl font-bold text-center capitalize mb-6">{tier} Members</h3>
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <AspectRatio ratio={1/1} className="mb-3">
                          <Skeleton className="h-full w-full rounded-md" />
                        </AspectRatio>
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3 mt-1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {profiles.length > 0 ? (
                      profiles.map((profile) => (
                        <div key={profile.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <AspectRatio ratio={1/1} className="mb-3 relative overflow-hidden rounded-md bg-gray-100">
                            {profile.profile_picture_url ? (
                              <img 
                                src={profile.profile_picture_url} 
                                alt={profile.full_name || "Member"} 
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-primary/10">
                                <span className="text-3xl font-bold text-primary">
                                  {getInitials(profile.full_name)}
                                </span>
                              </div>
                            )}
                          </AspectRatio>
                          <h4 className="font-semibold truncate">{profile.full_name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {profile.bio || "No bio available."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center col-span-2 py-8 text-muted-foreground">
                        No {tier} members yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;
