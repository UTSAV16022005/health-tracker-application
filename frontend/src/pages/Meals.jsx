import { useState, useEffect } from 'react';
import { mealService } from '../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MealLogger from '../components/MealLogger';

const mealIcons = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍝',
    snack: '🍎'
};

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const [summary, setSummary] = useState({ totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 });
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            setFetching(true);
            const today = format(new Date(), 'yyyy-MM-dd');
            const [mealsRes, summaryRes] = await Promise.all([
                mealService.getMealsByDate(today),
                mealService.getDailySummary(today)
            ]);
            const rawMeals = mealsRes.data;
            setMeals(Array.isArray(rawMeals) ? rawMeals : (rawMeals.meals || []));
            setSummary(summaryRes.data || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 });
        } catch (err) {
            toast.error('Failed to fetch meals');
        } finally {
            setFetching(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await mealService.delete(id);
            toast.success('Meal deleted');
            fetchMeals();
        } catch (err) {
            toast.error('Failed to delete meal');
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight">Nutrition Tracker</h1>
                <p className="text-gray-500 font-medium mt-2">Log your meals and track your macros</p>
            </motion.div>

            {/* Top Macros Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Calories</p>
                    <p className="text-2xl font-black text-gray-800">{summary.totalCalories} <span className="text-sm font-medium text-gray-400">kcal</span></p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col justify-center">
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Protein</p>
                    <p className="text-2xl font-black text-gray-800">{summary.totalProtein} <span className="text-sm font-medium text-gray-400">g</span></p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col justify-center">
                    <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Carbs</p>
                    <p className="text-2xl font-black text-gray-800">{summary.totalCarbs} <span className="text-sm font-medium text-gray-400">g</span></p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col justify-center">
                    <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Fats</p>
                    <p className="text-2xl font-black text-gray-800">{summary.totalFats} <span className="text-sm font-medium text-gray-400">g</span></p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Meal Logger Column */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="sticky top-6">
                        <MealLogger onMealLogged={fetchMeals} />
                    </div>
                </motion.div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Today's Meals</h2>
                    </div>

                    {fetching ? (
                        <div className="flex-center py-20">
                            <span className="w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full animate-spin"></span>
                        </div>
                    ) : meals.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/50 border border-gray-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex-center mb-4">
                                <Utensils className="text-gray-400 w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">No meals logged today</h3>
                            <p className="text-gray-500 mt-1 max-w-sm">Keep track of your nutrition by logging your meals.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {meals.map((meal, idx) => (
                                    <motion.div 
                                        key={meal._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-soft transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex-center shrink-0 text-2xl group-hover:bg-accent-orange/10 transition-colors">
                                                {mealIcons[meal.type] || '🍽️'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{meal.name}</h3>
                                                <p className="text-sm text-gray-500 mt-0.5 capitalize font-medium">{meal.type}</p>
                                                
                                                <div className="flex gap-3 mt-2 text-xs font-semibold">
                                                    <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">P: {meal.protein}g</span>
                                                    <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded-full">C: {meal.carbs}g</span>
                                                    <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">F: {meal.fats}g</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                                            <div className="text-left sm:text-right">
                                                <p className="text-2xl font-black text-gray-800">{meal.calories}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Kcal</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(meal._id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Delete meal"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Meals;
