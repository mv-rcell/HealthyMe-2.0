import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Use this — no need to createClient here

const workoutPlan = [
  { day: 'Push', exercise: 'Bench Press', sets: 3, reps: 10 },
  { day: 'Push', exercise: 'Overhead Press', sets: 3, reps: 8 },
  { day: 'Pull', exercise: 'Deadlift', sets: 3, reps: 6 },
  { day: 'Pull', exercise: 'Barbell Row', sets: 4, reps: 8 },
  { day: 'Legs', exercise: 'Squat', sets: 4, reps: 6 },
  { day: 'Legs', exercise: 'Leg Press', sets: 3, reps: 10 },
  { day: 'Push', exercise: 'Incline Press', sets: 3, reps: 10 },
  { day: 'Push', exercise: 'Lateral Raise', sets: 3, reps: 12 }
];

const FitnessPage = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data, error } = await supabase.from('WorkoutPlans').select('*');
      if (error) console.error('Error fetching workouts:', error.message);
      else setWorkouts(data);
    };

    fetchWorkouts();
  }, []);

  const handleInsertPlan = async () => {
    const { error } = await supabase.from('WorkoutPlans').insert(workoutPlan);
    if (error) {
      console.error('Insert error:', error.message);
    } else {
      alert('Workout plan added!');
      const { data } = await supabase.from('WorkoutPlans').select('*');
      setWorkouts(data);
    }
  };

  return (
    <div>
      <h1>Fitness</h1>
      <p>Here are some recommended workout routines:</p>
      <button onClick={handleInsertPlan}>Add Default Workout Plan</button>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            <strong>{workout.exercise}</strong> ({workout.day}) – {workout.sets} sets × {workout.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FitnessPage;
