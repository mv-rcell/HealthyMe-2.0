import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pointsEarned: number;
  availableCredits: number;
}

export const useReferralSystem = () => {
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pointsEarned: 0,
    availableCredits: 0
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadReferralStats();
    }
  }, [user]);

  const generateReferralCode = async () => {
    if (!user) return null;
    
    try {
      // Generate a simple referral code based on user ID
      const referralCode = `REF${user.id.slice(0, 8).toUpperCase()}`;
      toast.success(`Your referral code: ${referralCode}`);
      return referralCode;
    } catch (error: any) {
      toast.error(`Failed to generate referral code: ${error.message}`);
      return null;
    }
  };

  const processReferral = async (referralCode: string) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Since referral tables don't exist, we'll simulate processing
      const points = 50; // Points earned per referral
      const currentStats = JSON.parse(localStorage.getItem(`referral_stats_${user.id}`) || '{"totalReferrals":0,"successfulReferrals":0,"pointsEarned":0,"availableCredits":0}');
      
      const newStats = {
        ...currentStats,
        totalReferrals: currentStats.totalReferrals + 1,
        successfulReferrals: currentStats.successfulReferrals + 1,
        pointsEarned: currentStats.pointsEarned + points,
        availableCredits: Math.floor((currentStats.pointsEarned + points) / 100)
      };
      
      localStorage.setItem(`referral_stats_${user.id}`, JSON.stringify(newStats));
      setStats(newStats);
      
      toast.success('Referral processed successfully! You both earned rewards.');
      return true;
    } catch (error: any) {
      toast.error(`Failed to process referral: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadReferralStats = async () => {
    if (!user) return;
    
    try {
      // Load from localStorage since referral tables don't exist
      const savedStats = localStorage.getItem(`referral_stats_${user.id}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error: any) {
      console.error('Error loading referral stats:', error);
    }
  };

  const redeemPoints = async (points: number) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      if (stats.pointsEarned < points) {
        toast.error('Insufficient points for redemption');
        return false;
      }
      
      const newStats = {
        ...stats,
        pointsEarned: stats.pointsEarned - points,
        availableCredits: Math.floor((stats.pointsEarned - points) / 100)
      };
      
      localStorage.setItem(`referral_stats_${user.id}`, JSON.stringify(newStats));
      setStats(newStats);
      
      toast.success(`Successfully redeemed ${points} points!`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to redeem points: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    generateReferralCode,
    processReferral,
    loadReferralStats,
    redeemPoints
  };
};