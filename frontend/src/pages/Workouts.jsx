import { useState, useEffect } from 'react';
import { workoutService } from '../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Flame, Trash2, Plus, ArrowRight, Trophy, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const workoutIcons = {
    cardio: <Activity className="w-5 h-5 text-accent-orange" />,
    strength: <Flame className="w-5 h-5 text-accent-purple" />,
    yoga: <span className="text-accent-teal text-xl">🧘</span>,
    running: <span className="text-accent-blue text-xl">🏃</span>,
    pilates: <span className="text-pink-500 text-xl">💪</span>,
    crossfit: <span className="text-red-500 text-xl">⚡</span>,
    swimming: <span className="text-blue-400 text-xl">🏊</span>,
    hiking: <span className="text-green-600 text-xl">🏔️</span>,
    dancing: <span className="text-pink-400 text-xl">💃</span>,
    basketball: <span className="text-orange-400 text-xl">🏀</span>,
    tennis: <span className="text-yellow-500 text-xl">🎾</span>,
    cycling: <span className="text-green-400 text-xl">🚴</span>,
    hiit: <span className="text-red-600 text-xl">🔥</span>,
    meditation: <span className="text-purple-400 text-xl">🧘‍♀️</span>,
    stretching: <span className="text-blue-300 text-xl">🤸</span>,
    climbing: <span className="text-amber-600 text-xl">🧗</span>,
    boxing: <span className="text-red-700 text-xl">🥊</span>,
    skateboarding: <span className="text-slate-700 text-xl">🛹</span>,
    surfing: <span className="text-cyan-500 text-xl">🏄</span>,
};

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [formData, setFormData] = useState({
        type: 'cardio',
        duration: '',
        intensity: 'moderate',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            setFetching(true);
            const response = await workoutService.getWorkouts();
            setWorkouts(response.data.workouts || response.data || []);
        } catch (err) {
            toast.error('Failed to fetch workouts');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await workoutService.create({
                ...formData,
                duration: parseInt(formData.duration),
                date: new Date()
            });
            toast.success('Workout logged successfully!');
            setFormData({
                type: 'cardio',
                duration: '',
                intensity: 'moderate',
                notes: ''
            });
            fetchWorkouts();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add workout');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await workoutService.delete(id);
            toast.success('Workout deleted');
            setWorkouts(prev => prev.filter(w => w._id !== id));
        } catch (err) {
            toast.error('Failed to delete workout');
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight">Workouts</h1>
                <p className="text-gray-500 font-medium mt-2">Log and track your fitness activities</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white rounded-3xl p-6 shadow-soft sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex-center">
                                <Plus className="text-accent-purple" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Log Activity</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Activity Type</label>
                                <select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all"
                                >
                                    <option value="cardio">Cardio</option>
                                    <option value="strength">Strength Training</option>
                                    <option value="yoga">Yoga</option>
                                    <option value="running">Running</option>
                                    <option value="pilates">Pilates</option>
                                    <option value="crossfit">CrossFit</option>
                                    <option value="swimming">Swimming</option>
                                    <option value="hiking">Hiking</option>
                                    <option value="dancing">Dancing</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="cycling">Cycling</option>
                                    <option value="hiit">HIIT</option>
                                    <option value="meditation">Meditation</option>
                                    <option value="stretching">Stretching</option>
                                    <option value="climbing">Rock Climbing</option>
                                    <option value="boxing">Boxing</option>
                                    <option value="skateboarding">Skateboarding</option>
                                    <option value="surfing">Surfing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Duration (mins)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    placeholder="e.g. 45"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Intensity</label>
                                <select 
                                    name="intensity" 
                                    value={formData.intensity} 
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all"
                                >
                                    <option value="low">Low</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Notes</label>
                                <textarea
                                    name="notes"
                                    placeholder="How did it feel?"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all placeholder:text-gray-400 resize-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full mt-4 bg-accent-purple text-white font-bold py-3.5 rounded-xl hover:bg-[#7c3aed] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Log Workout
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent History</h2>
                    </div>

                    {fetching ? (
                        <div className="flex-center py-20">
                            <span className="w-8 h-8 border-4 border-accent-purple border-t-transparent rounded-full animate-spin"></span>
                        </div>
                    ) : workouts.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/50 border border-gray-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex-center mb-4">
                                <Activity className="text-gray-400 w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">No workouts yet</h3>
                            <p className="text-gray-500 mt-1 max-w-sm">Log your first workout using the form to start tracking your progress.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {workouts.map((workout, idx) => (
                                    <motion.div 
                                        key={workout._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-soft transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex-center shrink-0 group-hover:bg-accent-purple/5 transition-colors">
                                                {workoutIcons[workout.type] || <Activity className="w-5 h-5 text-gray-400" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 capitalize flex items-center gap-2">
                                                    {workout.type}
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                        workout.intensity === 'high' ? 'bg-rose-100 text-rose-600' :
                                                        workout.intensity === 'moderate' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-green-100 text-green-600'
                                                    }`}>
                                                        {workout.intensity}
                                                    </span>
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                                    <span>{format(new Date(workout.date), 'MMM dd, yyyy')}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span className="flex items-center gap-1"><Clock size={14} /> {workout.duration}m</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs text-gray-400 font-semibold uppercase">Est. Burn</p>
                                                <p className="font-bold text-gray-800 flex items-center gap-1 sm:justify-end">
                                                    <Flame size={16} className="text-accent-orange" />
                                                    {workout.caloriesBurned || Math.round(workout.duration * 7.5)} kcal
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(workout._id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Delete workout"
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

            {/* Achievements & Stats Section */}
            {workouts.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Achievements</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Workouts */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 relative overflow-hidden group"
                        >
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex-center mb-3 group-hover:scale-110 transition-transform">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-gray-600 font-semibold text-sm mb-1">Total Workouts</h3>
                                <p className="text-3xl font-bold text-gray-800">{workouts.length}</p>
                                <p className="text-xs text-gray-500 mt-2">Keep crushing those goals! 🔥</p>
                            </div>
                        </motion.div>

                        {/* Total Minutes */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 relative overflow-hidden group"
                        >
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex-center mb-3 group-hover:scale-110 transition-transform">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-gray-600 font-semibold text-sm mb-1">Total Minutes</h3>
                                <p className="text-3xl font-bold text-gray-800">{workouts.reduce((acc, w) => acc + w.duration, 0)}</p>
                                <p className="text-xs text-gray-500 mt-2">{Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / 60)}h of fitness</p>
                            </div>
                        </motion.div>

                        {/* Calories Burned */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200 relative overflow-hidden group"
                        >
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-red-500 rounded-2xl flex-center mb-3 group-hover:scale-110 transition-transform">
                                    <Flame className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-gray-600 font-semibold text-sm mb-1">Est. Calories Burned</h3>
                                <p className="text-3xl font-bold text-gray-800">{workouts.reduce((acc, w) => acc + (w.caloriesBurned || Math.round(w.duration * 7.5)), 0)}</p>
                                <p className="text-xs text-gray-500 mt-2">Amazing effort! 💪</p>
                            </div>
                        </motion.div>

                        {/* Favorite Workout */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 relative overflow-hidden group"
                        >
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex-center mb-3 group-hover:scale-110 transition-transform">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-gray-600 font-semibold text-sm mb-1">Favorite Activity</h3>
                                <p className="text-2xl font-bold text-gray-800 capitalize">
                                    {workouts.length > 0 ? 
                                        Object.entries(workouts.reduce((acc, w) => {
                                            acc[w.type] = (acc[w.type] || 0) + 1;
                                            return acc;
                                        }, {})).sort((a, b) => b[1] - a[1])[0][0]
                                    : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">You rock this! 🌟</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Badges/Milestones */}
                    <div className="mt-8 bg-white rounded-3xl p-8 shadow-soft">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Milestones</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { unlocked: workouts.length >= 1, label: 'First Workout', icon: '🏁' },
                                { unlocked: workouts.length >= 5, label: '5 Workouts', icon: '🎯' },
                                { unlocked: workouts.length >= 10, label: '10 Workouts', icon: '🏆' },
                                { unlocked: workouts.reduce((acc, w) => acc + w.duration, 0) >= 300, label: '5 Hours', icon: '⚡' },
                                { unlocked: workouts.reduce((acc, w) => acc + w.duration, 0) >= 600, label: '10 Hours', icon: '🚀' },
                                { unlocked: workouts.reduce((acc, w) => acc + (w.caloriesBurned || Math.round(w.duration * 7.5)), 0) >= 2000, label: '2K Calories', icon: '🔥' },
                                { unlocked: Object.keys(workouts.reduce((acc, w) => { acc[w.type] = true; return acc; }, {})).length >= 5, label: '5 Types', icon: '🌈' },
                                { unlocked: workouts.some(w => w.intensity === 'high') && workouts.length >= 3, label: 'High Intensity', icon: '💥' },
                            ].map((milestone, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    className={`p-4 rounded-2xl text-center transition-all ${
                                        milestone.unlocked 
                                            ? 'bg-yellow-50 border-2 border-yellow-300 shadow-md' 
                                            : 'bg-gray-50 border-2 border-gray-200 opacity-50'
                                    }`}
                                >
                                    <div className="text-3xl mb-2">{milestone.icon}</div>
                                    <p className="text-sm font-bold text-gray-800">{milestone.label}</p>
                                    {!milestone.unlocked && <p className="text-xs text-gray-500 mt-1">Locked</p>}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Workouts;
