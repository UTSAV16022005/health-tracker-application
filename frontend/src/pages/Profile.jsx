import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Target, Activity, Flame, Droplet, 
    Footprints, Ruler, Scale, Heart, Save, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

const BMI_CATEGORIES = [
    { max: 18.5, label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-50' },
    { max: 25,   label: 'Normal',      color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { max: 30,   label: 'Overweight',  color: 'text-amber-500', bg: 'bg-amber-50' },
    { max: Infinity, label: 'Obese',   color: 'text-rose-500', bg: 'bg-rose-50' },
];

const getBmiInfo = (bmi) => {
    return BMI_CATEGORIES.find(c => bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
};

const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        height: '',
        targetWeight: '',
        dailyCalorieGoal: 2000,
        dailyWaterGoal: 2000,
        dailyStepsGoal: 10000,
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                age: user.age || '',
                gender: user.gender || '',
                height: user.height || '',
                targetWeight: user.targetWeight || '',
                dailyCalorieGoal: user.dailyCalorieGoal || 2000,
                dailyWaterGoal: user.dailyWaterGoal || 2000,
                dailyStepsGoal: user.dailyStepsGoal || 10000,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully! 🎉');
            setIsEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const bmi = user?.height && user?.targetWeight
        ? +(user.targetWeight / ((user.height / 100) ** 2)).toFixed(1)
        : null;
    const bmiInfo = bmi ? getBmiInfo(bmi) : null;

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header section with gradient background */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2rem] overflow-hidden bg-white shadow-soft"
            >
                <div className="h-32 md:h-48 bg-gradient-to-r from-accent-purple via-indigo-500 to-accent-blue opacity-90"></div>
                
                <div className="px-6 md:px-10 pb-8 relative">
                    <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 md:-mt-20 mb-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-md flex-center overflow-hidden shrink-0">
                            <div className="w-full h-full bg-gradient-to-tr from-gray-100 to-gray-50 flex-center">
                                <span className="text-4xl md:text-5xl font-black text-gray-300 tracking-tighter">
                                    {getInitials(user?.name) || <User size={48} />}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight">{user?.name || 'Your Profile'}</h1>
                            <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                                {user?.email}
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                {user?.age ? `${user.age} years old` : 'Age not set'}
                            </p>
                        </div>

                        {bmi && (
                            <div className={`px-5 py-3 rounded-2xl ${bmiInfo.bg} ${bmiInfo.color} flex flex-col items-center justify-center min-w-[120px]`}>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Target BMI</span>
                                <span className="text-2xl font-black">{bmi}</span>
                                <span className="text-xs font-semibold mt-0.5">{bmiInfo.label}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-gray-600">
                            <Ruler size={16} className="text-gray-400" />
                            {user?.height ? `${user.height} cm` : 'Height not set'}
                        </div>
                        <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-gray-600">
                            <Scale size={16} className="text-gray-400" />
                            {user?.targetWeight ? `Target: ${user.targetWeight} kg` : 'Target weight not set'}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white rounded-3xl p-5 shadow-soft flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:scale-110 transition-transform"><Flame size={100}/></div>
                    <p className="text-xs text-accent-orange font-bold uppercase tracking-wider mb-1">Calories</p>
                    <p className="text-2xl font-black text-gray-800">{user?.dailyCalorieGoal || 2000} <span className="text-sm font-medium text-gray-400">kcal</span></p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-white rounded-3xl p-5 shadow-soft flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:scale-110 transition-transform"><Droplet size={100}/></div>
                    <p className="text-xs text-accent-blue font-bold uppercase tracking-wider mb-1">Water</p>
                    <p className="text-2xl font-black text-gray-800">{user?.dailyWaterGoal || 2000} <span className="text-sm font-medium text-gray-400">ml</span></p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-white rounded-3xl p-5 shadow-soft flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:scale-110 transition-transform"><Footprints size={100}/></div>
                    <p className="text-xs text-accent-green font-bold uppercase tracking-wider mb-1">Steps</p>
                    <p className="text-2xl font-black text-gray-800">{user?.dailyStepsGoal || 10000}</p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="bg-white rounded-3xl p-5 shadow-soft flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:scale-110 transition-transform"><Activity size={100}/></div>
                    <p className="text-xs text-accent-purple font-bold uppercase tracking-wider mb-1">Status</p>
                    <p className="text-2xl font-black text-gray-800 flex items-center gap-2">Active <Heart className="text-accent-rose fill-accent-rose animate-pulse" size={18} /></p>
                </motion.div>
            </div>

            {/* Settings Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[2rem] shadow-soft overflow-hidden"
            >
                <div className="flex border-b border-gray-100">
                    <button
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'info' ? 'text-accent-purple border-b-2 border-accent-purple bg-accent-purple/5' : 'text-gray-400 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Personal Info
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'goals' ? 'text-accent-purple border-b-2 border-accent-purple bg-accent-purple/5' : 'text-gray-400 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('goals')}
                    >
                        Daily Goals
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {activeTab === 'info' ? 'Personal Details' : 'Fitness Targets'}
                        </h3>
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-sm font-semibold text-accent-purple bg-accent-purple/10 px-4 py-2 rounded-xl hover:bg-accent-purple/20 transition-colors"
                            >
                                <Edit3 size={16} /> Edit
                            </button>
                        ) : null}
                    </div>

                    <form onSubmit={handleSubmit} className={isEditing ? 'opacity-100' : 'opacity-70 pointer-events-none'}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'info' && (
                                <motion.div 
                                    key="info"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Gender</label>
                                        <select 
                                            name="gender" 
                                            value={formData.gender} 
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all font-medium"
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Height (cm)</label>
                                            <input
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Target (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                name="targetWeight"
                                                value={formData.targetWeight}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'goals' && (
                                <motion.div 
                                    key="goals"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                >
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex-center">
                                                <Flame className="text-accent-orange" size={20} />
                                            </div>
                                            <label className="text-sm font-bold text-gray-700">Calories Goal</label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="dailyCalorieGoal"
                                                value={formData.dailyCalorieGoal}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all font-bold text-xl"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">kcal</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex-center">
                                                <Droplet className="text-accent-blue" size={20} />
                                            </div>
                                            <label className="text-sm font-bold text-gray-700">Water Goal</label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="dailyWaterGoal"
                                                value={formData.dailyWaterGoal}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all font-bold text-xl"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">ml</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex-center">
                                                <Footprints className="text-accent-green" size={20} />
                                            </div>
                                            <label className="text-sm font-bold text-gray-700">Steps Goal</label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="dailyStepsGoal"
                                                value={formData.dailyStepsGoal}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-all font-bold text-xl"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">steps</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isEditing && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 flex gap-4 pt-6 border-t border-gray-100"
                            >
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 bg-accent-purple text-white font-bold py-3.5 rounded-xl hover:bg-[#7c3aed] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form
                                        setFormData({
                                            name: user?.name || '',
                                            age: user?.age || '',
                                            gender: user?.gender || '',
                                            height: user?.height || '',
                                            targetWeight: user?.targetWeight || '',
                                            dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
                                            dailyWaterGoal: user?.dailyWaterGoal || 2000,
                                            dailyStepsGoal: user?.dailyStepsGoal || 10000,
                                        });
                                    }}
                                    className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
