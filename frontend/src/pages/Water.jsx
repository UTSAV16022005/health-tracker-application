import { useState, useEffect } from 'react';
import { waterService } from '../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Plus, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Water = () => {
    const [waterEntries, setWaterEntries] = useState([]);
    const [dailyIntake, setDailyIntake] = useState(0);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const dailyGoal = 2500; // Ideally from user context
    const percentage = Math.min((dailyIntake / dailyGoal) * 100, 100);

    useEffect(() => {
        fetchWaterData();
    }, []);

    const fetchWaterData = async () => {
        try {
            setFetching(true);
            const today = format(new Date(), 'yyyy-MM-dd');
            const response = await waterService.getDailyIntake(today);
            setWaterEntries(response.data.entries || response.data || []);
            setDailyIntake(response.data.totalAmount || 0);
        } catch (err) {
            toast.error('Failed to fetch water data');
        } finally {
            setFetching(false);
        }
    };

    const handleQuickAdd = async (val) => {
        setAmount(val.toString());
        // Auto submit for quick add
        submitWater(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) return;
        submitWater(parseInt(amount));
    };

    const submitWater = async (amt) => {
        setLoading(true);
        try {
            await waterService.addWater({
                amount: amt,
                unit: 'ml',
                timestamp: new Date()
            });
            toast.success(`${amt}ml water logged! 💧`);
            setAmount('');
            fetchWaterData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add water');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await waterService.deleteEntry(id);
            toast.success('Entry removed');
            fetchWaterData();
        } catch (err) {
            toast.error('Failed to delete entry');
        }
    };

    // Circular Progress calculations
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight">Hydration Tracker</h1>
                <p className="text-gray-500 font-medium mt-2">Log your water intake and stay hydrated</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tracker Overview & Form */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Ring Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-soft flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Droplet size={100} />
                        </div>
                        
                        <h2 className="text-lg font-bold text-gray-800 self-start mb-6 w-full">Today's Goal</h2>
                        
                        <div className="relative flex-center mb-6">
                            {/* SVG Ring */}
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                <motion.circle
                                    cx="96"
                                    cy="96"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="text-accent-blue drop-shadow-md"
                                    strokeLinecap="round"
                                />
                            </svg>
                            {/* Inner Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Droplet className="text-accent-blue mb-1" size={24} />
                                <span className="text-3xl font-black text-gray-800">{dailyIntake}</span>
                                <span className="text-sm font-semibold text-gray-400">/ {dailyGoal} ml</span>
                            </div>
                        </div>

                        <p className="text-center text-sm font-medium text-gray-500">
                            You've reached <span className="text-accent-blue font-bold">{Math.round(percentage)}%</span> of your daily goal.
                        </p>
                    </div>

                    {/* Quick Add Form */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Add</h2>
                        
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[250, 500, 750, 1000].map(val => (
                                <button
                                    key={val}
                                    onClick={() => handleQuickAdd(val)}
                                    disabled={loading}
                                    className="bg-blue-50 hover:bg-blue-100 text-accent-blue border border-blue-100 font-bold py-3 rounded-xl transition-all flex-center gap-1 active:scale-95 disabled:opacity-50"
                                >
                                    <Plus size={16} /> {val}ml
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="flex gap-3">
                            <input
                                type="number"
                                placeholder="Custom amount (ml)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all"
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !amount}
                                className="bg-accent-blue text-white px-5 rounded-xl hover:bg-blue-600 transition-colors font-bold disabled:opacity-50"
                            >
                                Add
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Log List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft h-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Today's Log</h2>

                        {fetching ? (
                            <div className="flex-center py-20">
                                <span className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></span>
                            </div>
                        ) : waterEntries.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-blue-50/50 border border-blue-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex-center mb-4">
                                    <Droplet className="text-accent-blue w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-700">No water logged today</h3>
                                <p className="text-gray-500 mt-1 max-w-sm">Use the quick add buttons to log your first glass of water.</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {waterEntries.map((entry, idx) => (
                                        <motion.div 
                                            key={entry._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-soft border border-transparent hover:border-gray-100 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-100/50 text-accent-blue flex-center shrink-0">
                                                    <Droplet size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-lg">{entry.amount} ml</p>
                                                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                                        <Clock size={12} />
                                                        {format(new Date(entry.timestamp), 'hh:mm a')}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleDelete(entry._id)}
                                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Delete entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Water;
