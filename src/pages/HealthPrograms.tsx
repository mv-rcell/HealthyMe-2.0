import React, { useState } from 'react';
import { Trophy, Users, Target, Calendar, Activity, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const HealthProgramsPage = () => {
  const [joinedPrograms, setJoinedPrograms] = useState<string[]>([]);
  const { toast } = useToast();

  const programs = [
    {
      id: 'fitness21',
      name: '21-Day Fitness Challenge',
      description: 'Build healthy exercise habits with daily workouts',
      duration: '21 days',
      participants: 1247,
      progress: 65,
      rewards: 'Fitness tracker, Premium subscription'
    },
    {
      id: 'detox14',
      name: '14-Day Detox Program',
      description: 'Cleanse your body with guided nutrition plans',
      duration: '14 days',
      participants: 892,
      progress: 0,
      rewards: 'Nutrition consultation, Recipe book'
    },
    {
      id: 'stress30',
      name: '30-Day Stress Relief',
      description: 'Mindfulness and meditation practices',
      duration: '30 days',
      participants: 654,
      progress: 0,
      rewards: 'Meditation app, Wellness kit'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', points: 2450 },
    { rank: 2, name: 'Maria Rodriguez', points: 2380 },
    { rank: 3, name: 'You', points: 2150 },
    { rank: 4, name: 'David Kim', points: 2020 },
    { rank: 5, name: 'Sarah Wilson', points: 1950 }
  ];

  const handleJoinProgram = (programId: string) => {
    if (joinedPrograms.includes(programId)) {
      toast({
        title: "Already Joined",
        description: "You're already part of this program!",
        status: "info"
      });
      return;
    }

    setJoinedPrograms([...joinedPrograms, programId]);
    toast({
      title: "Program Joined!",
      description: "Welcome to your health journey. Check-ins start tomorrow.",
      status: "success"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Health Programs</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Join community-driven health challenges and track your progress towards better wellness
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>2,793 active participants</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>15+ rewards available</span>
            </div>
          </div>
        </header>
        
        <main>
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Available Programs</h3>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {program.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {program.participants} participants
                          </div>
                        </div>
                        
                        {joinedPrograms.includes(program.id) && program.progress > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{program.progress}%</span>
                            </div>
                            <Progress value={program.progress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <span className="font-medium">Rewards: </span>
                          {program.rewards}
                        </div>
                        
                        <Button
                          onClick={() => handleJoinProgram(program.id)}
                          className="w-full"
                          variant={joinedPrograms.includes(program.id) ? "secondary" : "default"}
                        >
                          {joinedPrograms.includes(program.id) ? 'Joined' : 'Join Program'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Community Leaderboard</h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Top Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard.map((user) => (
                        <div
                          key={user.rank}
                          className={`flex items-center justify-between p-2 rounded ${
                            user.name === 'You' ? 'bg-primary/10 border border-primary/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              user.rank <= 3 ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                            }`}>
                              {user.rank}
                            </div>
                            <span className={user.name === 'You' ? 'font-medium' : ''}>{user.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="font-medium">{user.points}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HealthProgramsPage;