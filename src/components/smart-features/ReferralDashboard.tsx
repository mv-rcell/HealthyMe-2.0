import React, { useEffect, useState } from 'react';
import { Users, Gift, Star, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { toast } from 'sonner';

const ReferralDashboard = () => {
  const [referralCode, setReferralCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  
  const { 
    stats, 
    loading, 
    generateReferralCode, 
    processReferral, 
    loadReferralStats,
    redeemPoints 
  } = useReferralSystem();

  useEffect(() => {
    loadReferralStats();
    loadReferralCode();
  }, []);

  const loadReferralCode = async () => {
    const code = await generateReferralCode();
    if (code) {
      setReferralCode(code);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const handleProcessReferral = async () => {
    if (!enteredCode.trim()) {
      toast.error('Please enter a referral code');
      return;
    }
    
    const success = await processReferral(enteredCode);
    if (success) {
      setEnteredCode('');
    }
  };

  const handleRedeemPoints = async (points: number) => {
    await redeemPoints(points);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">{stats.successfulReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
                <p className="text-2xl font-bold">{stats.pointsEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Available Credits</p>
                <p className="text-2xl font-bold">{stats.availableCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralCode} readOnly />
              <Button onClick={copyReferralCode} size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this code with friends. You both earn 50 points when they sign up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enter Referral Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter friend's referral code"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
              />
              <Button 
                onClick={handleProcessReferral}
                disabled={loading}
              >
                Apply
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Have a referral code? Enter it here to earn bonus points!
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Redeem Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">$5 Credit</h3>
                <Badge variant="secondary">500 points</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get $5 off your next appointment
              </p>
              <Button 
                size="sm" 
                className="w-full"
                disabled={stats.pointsEarned < 500 || loading}
                onClick={() => handleRedeemPoints(500)}
              >
                Redeem
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">$10 Credit</h3>
                <Badge variant="secondary">1000 points</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get $10 off your next appointment
              </p>
              <Button 
                size="sm" 
                className="w-full"
                disabled={stats.pointsEarned < 1000 || loading}
                onClick={() => handleRedeemPoints(1000)}
              >
                Redeem
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Free Consultation</h3>
                <Badge variant="secondary">2000 points</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get a free 30-minute consultation
              </p>
              <Button 
                size="sm" 
                className="w-full"
                disabled={stats.pointsEarned < 2000 || loading}
                onClick={() => handleRedeemPoints(2000)}
              >
                Redeem
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;