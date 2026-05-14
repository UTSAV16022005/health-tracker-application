import { useState, useEffect } from 'react';
import { weightService } from '../services/api';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, TrendingDown, TrendingUp, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Weight = () => {
    const [weightRecords, setWeightRecords] = useState([]);
    const [progress, setProgress] = useState(null);
    const [formData, setFormData] = useState({
        weight: '',
        unit: 'kg'
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchWeightData();
    }, []);

    const fetchWeightData = async () => {
        try {
            setFetching(true);
            const endDate = new Date();
            const startDate = subDays(endDate, 30);

            const [recordsRes, progressRes] = await Promise.all([
                weightService.getWeightByDateRange(
                    format(startDate, 'yyyy-MM-dd'),
                    format(endDate, 'yyyy-MM-dd')
                ),
                weightService.getProgress()
            ]);

            setWeightRecords(recordsRes.data.records || recordsRes.data || []);
            setProgress(progressRes.data);
        } catch (err) {
            toast.error('Failed to fetch weight data');
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
            await weightService.addWeight({
                weight: parseFloat(formData.weight),
                unit: formData.unit,
                date: new Date()
            });
            toast.success('Weight record added!');
            setFormData({
                weight: '',
                unit: 'kg'
            });
            fetchWeightData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add weight');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await weightService.deleteWeight(id);
            toast.success('Record deleted');
            fetchWeightData();
        } catch (err) {
            toast.error('Failed to delete record');
        }
    };

    const chartData = weightRecords.map(record => ({
        date: format(new Date(record.date), 'MMM dd'),
        weight: record.weight,
        bmi: record.bmi || 0
    })).reverse();

    const isLosingWeight = progress?.weightChange < 0;
    const TrendIcon = isLosingWeight ? TrendingDown : (progress?.weightChange > 0 ? TrendingUp : Minus);
    const trendColor = isLosingWeight ? 'text-emerald-500 bg-emerald-50' : (progress?.weightChange > 0 ? 'text-rose-500 bg-rose-50' : 'text-gray-500 bg-gray-50');

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight">Weight Progress</h1>
                    <p className="text-gray-500 font-medium mt-2">Track your weight and BMI changes</p>
                </div>
            </motion.div>

            {/* Progress Summary Cards */}
            {progress && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 shadow-soft">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Initial Weight</p>
                        <p className="text-3xl font-black text-gray-800">{progress.initialWeight} <span className="text-lg font-medium text-gray-400">kg</span></p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 shadow-soft relative overflow-hidden">
                        <p className="text-xs text-accent-teal font-bold uppercase tracking-wider mb-2">Current Weight</p>
                        <p className="text-3xl font-black text-gray-800 relative z-10">{progress.currentWeight} <span className="text-lg font-medium text-gray-400">kg</span></p>
                        <div className="absolute -right-6 -bottom-6 opacity-5">
                            <Scale size={100} />
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 shadow-soft flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Total Change</p>
                            <p className="text-3xl font-black text-gray-800 flex items-baseline gap-1">
                                {progress.weightChange > 0 ? '+' : ''}{progress.weightChange} <span className="text-lg font-medium text-gray-400">kg</span>
                            </p>
                        </div>
                        <div className={`p-4 rounded-2xl ${trendColor}`}>
                            <TrendIcon size={32} />
                        </div>
                    </motion.div>
                </div>
            )}

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
                            <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex-center">
                                <Plus className="text-accent-teal" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Log Weight</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Weight</label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="weight"
                                        placeholder="0.0"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal transition-all placeholder:text-gray-400 text-xl font-bold"
                                    />
                                    <select 
                                        name="unit" 
                                        value={formData.unit} 
                                        onChange={handleChange} 
                                        className="w-24 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal transition-all font-semibold"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="lbs">lbs</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full mt-6 bg-accent-teal text-white font-bold py-3.5 rounded-xl hover:bg-[#0d9488] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Save Entry
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8 min-w-0">
                    
                    {/* Chart Card */}
                    {chartData.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-6 md:p-8 shadow-soft"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-6">30-Day Trend</h2>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="weight" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}

                    {/* History List */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">History Log</h2>
                        
                        {fetching ? (
                            <div className="flex-center py-10">
                                <span className="w-8 h-8 border-4 border-accent-teal border-t-transparent rounded-full animate-spin"></span>
                            </div>
                        ) : weightRecords.length === 0 ? (
                            <div className="bg-gray-50 border border-gray-100 border-dashed rounded-2xl p-8 text-center">
                                <Scale className="mx-auto text-gray-400 mb-2 w-8 h-8" />
                                <p className="text-gray-500 font-medium">No weight logs found.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {weightRecords.map((record, idx) => (
                                        <motion.div 
                                            key={record._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-teal-50 text-accent-teal flex-center shrink-0">
                                                    <Scale size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-lg">{record.weight} <span className="text-sm font-medium text-gray-500">{record.unit}</span></p>
                                                    <p className="text-xs text-gray-400 font-medium">
                                                        {format(new Date(record.date), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                {record.bmi && (
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-xs text-gray-400 font-semibold uppercase">BMI</p>
                                                        <p className="font-bold text-gray-700">{record.bmi}</p>
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(record._id)}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    title="Delete record"
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
        </div>
    );
};

export default Weight;
