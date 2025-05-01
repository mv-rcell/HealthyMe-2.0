// services/foodService.js
import { supabase } from './supabaseClient';

export const fetchFoods = async () => {
  const { data, error } = await supabase.from('foods').select('*');
  if (error) throw error;
  return data;
};

export const addFood = async (food) => {
  const { data, error } = await supabase.from('foods').insert([food]);
  if (error) throw error;
  return data;
};
