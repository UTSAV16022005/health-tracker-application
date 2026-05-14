import { useState, useEffect } from 'react';
import { sleepService } from '../services/api';
import { format, differenceInHours } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sunrise, Sunset, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const qualityColors = {
    poor: 'text-rose-500 bg-rose-50',
    normal: 'text-orange-500 bg-orange-50',
    good: 'text-blue-500 bg-blue-50',
    excellent: 'text-emerald-500 bg-emerald-50'
};

const qualityEmojis = {
    poor: '😫',
    normal: '😐',
    good: '😌',
    excellent: '🤩'
};

const Sleep = () => {
    const [sleepRecords, setSleepRecords] = useState([]);
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        quality: 'normal'
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchSleepData();
    }, []);

    const fetchSleepData = async () => {
        try {
            setFetching(true);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            
            const response = await sleepService.getSleepByDateRange(
                format(startDate, 'yyyy-MM-dd'),
                format(endDate, 'yyyy-MM-dd')
            );
            setSleepRecords(response.data.records || response.data || []);
        } catch (err) {
            toast.error('Failed to fetch sleep data');
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
            await sleepService.recordSleep({
                startTime: formData.startTime,
                endTime: formData.endTime,
                quality: formData.quality
            });
            toast.success('Sleep record saved! 🌙');
            setFormData({
                startTime: '',
                endTime: '',
                quality: 'normal'
            });
            fetchSleepData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to record sleep');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await sleepService.deleteSleep(id);
            toast.success('Sleep record removed');
            fetchSleepData();
        } catch (err) {
            toast.error('Failed to delete sleep record');
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight">Sleep Tracking</h1>
                <p className="text-gray-500 font-medium mt-2">Monitor your sleep patterns and quality</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-[#111827] text-white rounded-3xl p-6 shadow-soft relative overflow-hidden sticky top-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex-center backdrop-blur-sm">
                                    <Moon className="text-indigo-300" size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-100">Log Sleep</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-1.5 flex items-center gap-2">
                                        <Sunset size={14} className="text-indigo-400" />
                                        Fell Asleep
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-500 custom-time-input"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-1.5 flex items-center gap-2">
                                        <Sunrise size={14} className="text-orange-400" />
                                        Woke Up
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-500 custom-time-input"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-1.5 mt-2">Sleep Quality</label>
                                    <select 
                                        name="quality" 
                                        value={formData.quality} 
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [&>option]:bg-gray-800"
                                    >
                                        <option value="poor">Poor 😫</option>
                                        <option value="normal">Normal 😐</option>
                                        <option value="good">Good 😌</option>
                                        <option value="excellent">Excellent 🤩</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full mt-6 bg-indigo-500 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Save Record
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Sleep Logs</h2>
                    </div>

                    {fetching ? (
                        <div className="flex-center py-20">
                            <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                        </div>
                    ) : sleepRecords.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-indigo-50 border border-indigo-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex-center mb-4">
                                <Moon className="text-indigo-400 w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">No sleep records yet</h3>
                            <p className="text-gray-500 mt-1 max-w-sm">Log your sleep times to start tracking your rest quality.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {sleepRecords.map((record, idx) => {
                                    // Use duration if provided, otherwise estimate from times
                                    const hrs = record.duration || (record.startTime && record.endTime ? 
                                        Math.abs(differenceInHours(new Date(record.endTime), new Date(record.startTime))) : 0);
                                        
                                    return (
                                        <motion.div 
                                            key={record._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-soft transition-all group relative"
                                        >
                                            <button 
                                                onClick={() => handleDelete(record._id)}
                                                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Delete record"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <p className="text-xs font-semibold text-gray-400 mb-1">
                                                {record.date ? format(new Date(record.date), 'EEEE, MMM dd') : 'Unknown Date'}
                                            </p>
                                            
                                            <div className="flex items-end gap-1 mb-4">
                                                <span className="text-3xl font-black text-gray-800">{hrs.toFixed(1)}</span>
                                                <span className="text-gray-500 font-medium mb-1">hours</span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-400 mb-0.5">Bedtime</p>
                                                    <p className="font-semibold">{format(new Date(record.startTime), 'hh:mm a')}</p>
                                                </div>
                                                <div className="w-px h-8 bg-gray-200"></div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-400 mb-0.5">Wake up</p>
                                                    <p className="font-semibold">{format(new Date(record.endTime), 'hh:mm a')}</p>
                                                </div>
                                            </div>

                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${qualityColors[record.quality] || qualityColors.normal}`}>
                                                <span>{qualityEmojis[record.quality]}</span>
                                                {record.quality}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sleep;
