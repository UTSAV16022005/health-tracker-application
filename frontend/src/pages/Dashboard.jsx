import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    mealService, 
    waterService, 
    sleepService,
    weightService,
    activityService 
} from '../services/api';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
    Flame, 
    Droplets, 
    Footprints, 
    Moon, 
    Scale, 
    Activity as HeartBeat,
    CalendarDays,
    TrendingUp
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

// Mock data for charts
const weeklyActivityData = [
    { name: 'Mon', calories: 1800, steps: 6000 },
    { name: 'Tue', calories: 2200, steps: 8500 },
    { name: 'Wed', calories: 1950, steps: 7200 },
    { name: 'Thu', calories: 2400, steps: 10500 },
    { name: 'Fri', calories: 2100, steps: 8000 },
    { name: 'Sat', calories: 2800, steps: 12000 },
    { name: 'Sun', calories: 2300, steps: 9500 },
];

const sleepDataChart = [
    { day: 'M', hours: 7.5 },
    { day: 'T', hours: 6.8 },
    { day: 'W', hours: 8.1 },
    { day: 'T', hours: 7.2 },
    { day: 'F', hours: 6.5 },
    { day: 'S', hours: 9.0 },
    { day: 'S', hours: 8.5 },
];

const StatCard = ({ title, value, unit, icon: Icon, colorClass, progress, delay = 0, gradient = null }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
        className="relative overflow-hidden group"
    >
        {/* Gradient background with glow effect */}
        <div 
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
            style={{
                background: gradient ? `linear-gradient(135deg, ${gradient.from}40, ${gradient.to}40)` : 'transparent'
            }}
        />
        
        <div 
            className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 relative overflow-hidden"
            style={{
                borderTop: gradient ? `3px solid ${gradient.from}` : 'none'
            }}
        >
            {/* Gradient accent corner */}
            {gradient && (
                <div 
                    className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                    }}
                />
            )}
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div 
                    className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                        background: gradient ? `linear-gradient(135deg, ${gradient.from}20, ${gradient.to}20)` : `bg-opacity-10`
                    }}
                >
                    <Icon 
                        className="w-6 h-6"
                        style={{ color: gradient ? gradient.from : 'currentColor' }}
                    />
                </div>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800">{value}</span>
                    {unit && <span className="text-gray-400 font-medium text-sm">{unit}</span>}
                </div>
            </div>

            {/* Progress Bar with gradient */}
            {progress !== undefined && (
                <div className="mt-5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden relative z-10">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: delay + 0.3 }}
                        style={{
                            background: gradient ? `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` : 'rgb(139, 92, 246)'
                        }}
                        className="h-full rounded-full shadow-md"
                    />
                </div>
            )}
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        dailyCalories: 0,
        dailyWater: 0,
        dailySteps: 0,
        sleepHours: 0,
        weight: 0,
        bmi: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const today = format(new Date(), 'yyyy-MM-dd');

            const [
                mealSummary,
                waterData,
                activityData,
                sleepData,
                weightData
            ] = await Promise.all([
                mealService.getDailySummary(today).catch(() => ({ totalCalories: 0 })),
                waterService.getDailyIntake(today).catch(() => ({ totalAmount: 0 })),
                activityService.getDailyActivity(today).catch(() => ({ steps: 0 })),
                sleepService.getSleepByDate(today).catch(() => ({ duration: 0 })),
                weightService.getLatestWeight().catch(() => ({ weight: 0, bmi: 0 }))
            ]);

            setStats({
                dailyCalories: mealSummary.data?.totalCalories || mealSummary.totalCalories || 0,
                dailyWater: waterData.data?.totalAmount || waterData.totalAmount || 0,
                dailySteps: activityData.data?.steps || activityData?.steps || 0,
                sleepHours: sleepData.data?.duration || sleepData?.duration || 0,
                weight: weightData.data?.weight || weightData?.weight || 0,
                bmi: weightData.data?.bmi || weightData?.bmi || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full flex-center bg-background">
                <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const calorieGoal = user?.dailyCalorieGoal || 2500;
    const waterGoal = user?.dailyWaterGoal || 2500;
    const stepsGoal = user?.dailyStepsGoal || 10000;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2">
                        <CalendarDays size={18} />
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-accent-orange/10 flex-center">
                        <span className="text-xl">🔥</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Current Streak</p>
                        <p className="text-lg font-bold text-gray-800">12 Days</p>
                    </div>
                </div>
            </motion.div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Calories Burnt" 
                    value={Math.round(stats.dailyCalories)} 
                    unit={`/ ${calorieGoal} kcal`}
                    icon={Flame} 
                    colorClass="bg-accent-orange"
                    gradient={{ from: '#ff6b35', to: '#f7931e' }}
                    progress={(stats.dailyCalories / calorieGoal) * 100}
                    delay={0.1}
                />
                <StatCard 
                    title="Steps Walked" 
                    value={stats.dailySteps.toLocaleString()} 
                    unit={`/ ${(stepsGoal/1000).toFixed(1)}k`}
                    icon={Footprints}
                    colorClass="bg-accent-green"
                    gradient={{ from: '#00d084', to: '#00a86b' }}
                    progress={(stats.dailySteps / stepsGoal) * 100}
                    delay={0.2}
                />
                <StatCard 
                    title="Water Intake" 
                    value={Math.round(stats.dailyWater)} 
                    unit={`/ ${waterGoal} ml`}
                    icon={Droplets}
                    colorClass="bg-accent-blue"
                    gradient={{ from: '#00d4ff', to: '#0099ff' }}
                    progress={(stats.dailyWater / waterGoal) * 100}
                    delay={0.3}
                />
                <StatCard 
                    title="Heart Rate" 
                    value="72" 
                    unit="bpm avg"
                    icon={HeartBeat}
                    colorClass="bg-accent-rose"
                    gradient={{ from: '#ff10f0', to: '#ff006e' }}
                    delay={0.4}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Col - Charts (2/3 width) */}
                <div className="lg:col-span-2 space-y-6 min-w-0">
                    {/* Activity Chart */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-6 md:p-8 shadow-soft"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Activity Overview</h2>
                                <p className="text-sm text-gray-500">Your steps and calories this week</p>
                            </div>
                            <button className="text-accent-purple bg-accent-purple/10 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-purple/20 transition-colors">
                                Weekly
                            </button>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area yAxisId="left" type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSteps)" />
                                    <Area yAxisId="right" type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Lower grid inside left col */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard 
                            title="Current Weight" 
                            value={stats.weight || '--'} 
                            unit="kg"
                            icon={Scale}
                            colorClass="bg-accent-teal"
                            gradient={{ from: '#9d4edd', to: '#7209b7' }}
                            delay={0.5}
                        />
                        <StatCard 
                            title="BMI Score" 
                            value={stats.bmi || '--'} 
                            unit="kg/m²"
                            icon={TrendingUp}
                            colorClass="bg-accent-purple"
                            gradient={{ from: '#4361ee', to: '#3a0ca3' }}
                            delay={0.6}
                        />
                    </div>
                </div>

                {/* Right Col - Side widgets (1/3 width) */}
                <div className="space-y-6 min-w-0">
                    {/* Sleep Widget */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-900 text-white rounded-3xl p-6 md:p-8 shadow-soft relative overflow-hidden"
                    >
                        {/* Decorative blur blob */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-purple rounded-full mix-blend-screen filter blur-[50px] opacity-40"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="p-3 bg-white/10 rounded-2xl inline-block mb-4 backdrop-blur-md">
                                        <Moon className="w-6 h-6 text-indigo-300" />
                                    </div>
                                    <h3 className="text-gray-300 font-medium text-sm">Sleep Quality</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-4xl font-bold">{stats.sleepHours ? stats.sleepHours.toFixed(1) : '6.5'}</span>
                                        <span className="text-gray-400 font-medium">h</span>
                                    </div>
                                </div>
                                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                                    Good
                                </span>
                            </div>

                            <div className="h-[120px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sleepDataChart} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                        <Bar dataKey="hours" radius={[6, 6, 6, 6]}>
                                            {sleepDataChart.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === sleepDataChart.length - 1 ? '#8b5cf6' : '#4b5563'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>

                    {/* AI Coach Suggestion */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-3xl p-6 shadow-soft border border-gray-50"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src="https://ui-avatars.com/api/?name=AI+Coach&background=8b5cf6&color=fff" alt="AI Coach" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">AI Wellness Coach</h4>
                                <p className="text-xs text-gray-500">Personalized Insights</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed border border-gray-100 relative">
                            <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-50 border-t border-l border-gray-100 rotate-[-45deg] transform"></div>
                            "You're doing great! You hit your step goal 3 days in a row. Consider adding a 15-minute stretching session tonight to improve muscle recovery."
                        </div>
                        <button className="w-full mt-4 bg-accent-purple/10 text-accent-purple font-semibold py-3 rounded-xl hover:bg-accent-purple hover:text-white transition-colors duration-300">
                            View Workout Plan
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
