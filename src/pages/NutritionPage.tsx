import { useEffect, useState } from 'react';

const NutritionPage = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await axios.get('https://healthy-me-back-end.vercel.app/api/foods');
      setFoods(response.data);
    };
    fetchFoods();
  }, []);

  return (
    <div>
      <h1>Nutrition</h1>
      <p>Here are some healthy food options:</p>
      <ul>
        {foods.map((food) => (
          <li key={food._id}>{food.name} — {food.calories} calories</li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionPage;
