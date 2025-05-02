
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ChevronDown, ChevronUp } from 'lucide-react';

const demoImages = {
  'Bench Press': 'https://via.placeholder.com/100?text=Bench+Press',
  'Overhead Press': 'https://via.placeholder.com/100?text=OHP',
  'Deadlift': 'https://via.placeholder.com/100?text=Deadlift',
  'Barbell Row': 'https://via.placeholder.com/100?text=Row',
  'Squat': 'https://via.placeholder.com/100?text=Squat',
  'Leg Press': 'https://via.placeholder.com/100?text=Leg+Press',
  'Incline Press': 'https://via.placeholder.com/100?text=Incline',
  'Lateral Raise': 'https://via.placeholder.com/100?text=Raise',
};

const FitnessPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDays, setOpenDays] = useState({});

  const fetchWorkouts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('WorkoutPlans').select('*');
    if (!error) setWorkouts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleInsertPlan = async () => {
    const { data: existing } = await supabase.from('WorkoutPlans').select('exercise');
    const existingExercises = existing?.map((w) => w.exercise) || [];

    const newPlans = workoutPlan.filter(plan => !existingExercises.includes(plan.exercise));
    if (newPlans.length === 0) return alert('Workout plan already exists.');

    const { error } = await supabase.from('WorkoutPlans').insert(newPlans);
    if (!error) {
      alert('Workout plan added!');
      fetchWorkouts();
    }
  };

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

  const grouped = workouts.reduce((acc, curr) => {
    acc[curr.day] = [...(acc[curr.day] || []), curr];
    return acc;
  }, {});

  const toggleDay = (day) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">🏋️‍♂️ Fitness Plans</h1>
      <p className="text-center text-gray-600 mb-8">
        Structured routines with visual demos for guidance.
      </p>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleInsertPlan}
          className="bg-primary text-white px-6 py-2 rounded-xl shadow hover:bg-primary/90 transition"
        >
          Add Default Workout Plan
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading workouts...</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([day, exercises]) => (
            <div key={day} className="bg-white rounded-xl shadow p-4">
              <button
                onClick={() => toggleDay(day)}
                className="flex justify-between items-center w-full text-left text-lg font-semibold text-primary"
              >
                {day} Day
                {openDays[day] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {openDays[day] && (
                <ul className="mt-4 space-y-3 transition-all">
                  {exercises.map((ex) => (
                    <li key={ex.id} className="flex items-center gap-4 border-b pb-2">
                      <img
                        src={demoImages[ex.exercise] || 'https://via.placeholder.com/100'}
                        alt={ex.exercise}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{ex.exercise}</span>
                        <span className="text-sm text-gray-600">{ex.sets} × {ex.reps}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FitnessPage;