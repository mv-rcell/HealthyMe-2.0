import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const normalizePhone = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.startsWith("0")) return "+254" + digits.slice(1);
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.startsWith("7") || digits.startsWith("1")) return "+254" + digits;
  return null;
};

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

const MembershipPage = () => {
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

  const handlePesaPalPayment = async () => {
    if (!user || !selectedPlan) {
      toast.error("Please select a membership plan");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number (e.g., 0712345678)");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      toast.error("Please enter a valid Kenyan phone number (e.g., 0712345678)");
      return;
    }

    try {
      setProcessingPayment(true);
      
      toast.info("Initiating PesaPal payment...");
      console.log('Initiating PesaPal payment for:', {
        amount: selectedPlan.price,
        phoneNumber,
        userId: user.id,
        membershipTier: selectedPlan.name
      });
      
      const { data, error } = await supabase.functions.invoke('pesapal-payment', {
        body: {
          amount: selectedPlan.price,
          phoneNumber: phoneNumber.trim(),
          userId: user.id,
          membershipTier: selectedPlan.name
        }
      });

      console.log('PesaPal payment response:', data);
      console.log('PesaPal payment error:', error);

      if (data?.success) {
        toast.success("Payment request initiated successfully!");
        toast.info("Redirecting to PesaPal to complete your payment...");
        
        // Small delay before redirect to allow user to see the success message
        setTimeout(() => {
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
          } else {
            toast.error("Redirect URL not provided");
          }
        }, 2000);
        
        setPaymentDialogOpen(false);
        setPhoneNumber("");
      } else {
        throw new Error(data?.error || 'Payment initialization failed');
      }
    } catch (error: any) {
      console.error('PesaPal payment error:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message.includes('Invalid phone number')) {
        errorMessage = 'Please enter a valid Kenyan phone number (e.g., 0712345678)';
      } else if (error.message.includes('configuration')) {
        errorMessage = 'Payment service is temporarily unavailable. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setProcessingPayment(false);
    }
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-sm font-medium text-primary mb-6">
                Membership Plans
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Find the Perfect Plan for Your Fitness Journey
              </h1>
              <p className="text-muted-foreground">
                Choose from our flexible membership options designed to fit your
                fitness goals, schedule, and budget.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {plans.map((plan) => {
                const isCurrentPlan = userMembership === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative rounded-2xl bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg",
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
                        disabled={isCurrentPlan || processingPayment}
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
                    
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
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
                    Complete your payment via PesaPal to activate your {selectedPlan?.name} membership. 
                    Supports M-Pesa, Airtel Money, Visa, and Mastercard.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold text-lg">{selectedPlan?.name}</h3>
                    <p className="text-2xl font-bold text-primary">{selectedPlan?.priceDisplay}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input
                      id="phone-number"
                      placeholder="0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mobile-input"
                      maxLength={13}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your phone number for mobile money payments (M-Pesa, Airtel Money, etc.)
                    </p>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPaymentDialogOpen(false);
                      setPhoneNumber("");
                    }}
                    className="w-full sm:w-auto"
                    disabled={processingPayment}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handlePesaPalPayment} 
                    disabled={processingPayment || !phoneNumber}
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
                            <div key={profile.id} className="border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                              <AspectRatio ratio={1/1} className="mb-3 relative overflow-hidden rounded-md bg-muted">
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
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
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
      </main>
      <Footer />
    </div>
  );
};

export default MembershipPage;