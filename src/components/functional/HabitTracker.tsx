import React, { useState } from 'react';
import { Check, Plus, Droplets, Moon, Apple } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: number;
  name: string;
  icon: React.ReactNode;
  completed: boolean;
  target: number;
  current: number;
  unit: string;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: "Drink Water",
      icon: <Droplets className="h-4 w-4" />,
      completed: false,
      target: 8,
      current: 3,
      unit: "glasses"
    },
    {
      id: 2,
      name: "Sleep",
      icon: <Moon className="h-4 w-4" />,
      completed: true,
      target: 8,
      current: 8,
      unit: "hours"
    },
    {
      id: 3,
      name: "Eat Fruits",
      icon: <Apple className="h-4 w-4" />,
      completed: false,
      target: 3,
      current: 1,
      unit: "servings"
    }
  ]);

  const { toast } = useToast();

  const toggleHabit = (id: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed, current: habit.completed ? habit.current - 1 : habit.current + 1 }
        : habit
    ));

    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: habit.completed ? "Habit Unchecked" : "Great Progress!",
        description: `${habit.name} ${habit.completed ? 'unchecked' : 'completed'} for today.`,
        status: "success"
      });
    }
  };

  const addProgress = (id: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id && habit.current < habit.target
        ? { ...habit, current: habit.current + 1, completed: habit.current + 1 >= habit.target }
        : habit
    ));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Daily Habits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {habit.icon}
                <span className="font-medium">{habit.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {habit.current}/{habit.target} {habit.unit}
                </span>
                <Button
                  size="sm"
                  variant={habit.completed ? "default" : "outline"}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Progress 
                value={(habit.current / habit.target) * 100} 
                className="h-2"
              />
              <div className="flex justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addProgress(habit.id)}
                  disabled={habit.current >= habit.target}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Progress
                </Button>
                {habit.completed && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default HabitTracker;