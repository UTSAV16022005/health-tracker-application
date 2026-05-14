import { useState, useRef } from "react";
import { mealService } from "../services/api";
import toast from "react-hot-toast";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

const STAT_COLORS = {
  calories: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", label: "Calories", unit: "kcal", icon: "🔥" },
  protein:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100",  label: "Protein",  unit: "g",    icon: "💪" },
  carbs:    { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100",   label: "Carbs",    unit: "g",    icon: "🌾" },
  fats:     { bg: "bg-pink-50",   text: "text-pink-800",   border: "border-pink-100",   label: "Fats",     unit: "g",    icon: "🥑" },
};

function MacroCard({ type, value }) {
  const c = STAT_COLORS[type];
  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-3 flex flex-col gap-1`}>
      <span className={`text-[11px] font-medium opacity-90 ${c.text}`}>
        {c.icon} {c.label}
      </span>
      <span className={`text-xl font-bold leading-tight ${c.text}`}>
        {value !== null && value !== undefined
          ? value
          : <span className="opacity-30 text-base">—</span>}
      </span>
      <span className={`text-[11px] opacity-70 ${c.text}`}>{c.unit}</span>
    </div>
  );
}

export default function MealLogger({ onMealLogged }) {
  const [mealName,   setMealName]   = useState("");
  const [quantity,   setQuantity]   = useState("");
  const [unit,       setUnit]       = useState("grams");
  const [mealType,   setMealType]   = useState("breakfast");
  const [macros,     setMacros]     = useState({ calories: null, protein: null, carbs: null, fats: null });
  const [aiNote,     setAiNote]     = useState("");
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const debounceRef = useRef(null);

  const estimateNutrition = async (name, qty, u) => {
    if (!name.trim() || !qty) return;
    setLoading(true);
    setError("");
    setAiNote("");
    try {
      const res = await mealService.calculateNutrition({
        mealName: name.trim(),
        portions: Number(qty),
        unit: u,
        mealType,
      });
      const data = res.data;
      setMacros({
        calories: data.calories ?? null,
        protein:  data.protein  ?? null,
        carbs:    data.carbs    ?? null,
        fats:     data.fats     ?? null,
      });
      setAiNote(data.note || (data.estimated ? "Using estimated nutrition values." : ""));
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Network error";
      console.error("Nutrition estimate failed:", msg, err);
      setError(`Couldn't estimate: ${msg}`);
      setMacros({ calories: null, protein: null, carbs: null, fats: null });
    } finally {
      setLoading(false);
    }
  };

  const triggerEstimate = (name, qty, u) => {
    clearTimeout(debounceRef.current);
    if (name.trim() && qty) {
      debounceRef.current = setTimeout(() => estimateNutrition(name, qty, u), 900);
    }
  };

  const handleNameChange  = (val) => { setMealName(val);  triggerEstimate(val, quantity, unit); };
  const handleQtyChange   = (val) => { setQuantity(val);  triggerEstimate(mealName, val, unit); };
  const handleUnitChange  = (val) => {
    setUnit(val);
    if (mealName.trim() && quantity) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => estimateNutrition(mealName, quantity, val), 300);
    }
  };

  const handleLog = async () => {
    if (!mealName.trim() || macros.calories === null) return;
    setSubmitting(true);
    try {
      await mealService.create({
        name:     mealName.trim(),
        type:     mealType,
        calories: macros.calories,
        protein:  macros.protein  ?? 0,
        carbs:    macros.carbs    ?? 0,
        fats:     macros.fats     ?? 0,
        portions: Number(quantity) || 0,
        date:     new Date(),
      });
      toast.success("🍽️ Meal logged successfully!");
      setMealName("");
      setQuantity("");
      setMacros({ calories: null, protein: null, carbs: null, fats: null });
      setAiNote("");
      setError("");
      if (onMealLogged) onMealLogged();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to log meal");
    } finally {
      setSubmitting(false);
    }
  };

  const canLog = mealName.trim() && macros.calories !== null && !loading && !submitting;

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5 md:p-6 shadow-soft relative overflow-hidden text-white">
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full mix-blend-screen filter blur-[60px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Card header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-2xl">🤖</span>
          <span className="text-lg font-bold">AI Meal Logger</span>
          <span className="ml-auto text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 rounded-full px-2.5 py-1">
            Powered by Claude
          </span>
        </div>

        {/* Meal name */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Meal name</label>
          <input
            value={mealName}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. Grilled chicken breast"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-500"
          />
        </div>

        {/* Quantity + Unit */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={e => handleQtyChange(e.target.value)}
              placeholder="e.g. 150"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-500"
            />
          </div>
          <div className="w-24 shrink-0">
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Unit</label>
            <select
              value={unit}
              onChange={e => handleUnitChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all cursor-pointer [&>option]:bg-gray-800"
            >
              <option value="grams">g</option>
              <option value="ml">ml</option>
              <option value="cups">cups</option>
              <option value="tbsp">tbsp</option>
              <option value="pieces">pcs</option>
              <option value="servings">srv</option>
            </select>
          </div>
        </div>

        {/* Meal type chips */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-400 mb-2">Meal type</label>
          <div className="flex flex-wrap gap-2">
            {MEAL_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setMealType(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${
                  mealType === t 
                    ? "border-orange-500/50 bg-orange-500/20 text-orange-400" 
                    : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Macro preview */}
        <div className="border-t border-white/10 pt-4 mb-5">
          {loading ? (
            <div className="flex items-center gap-2 py-2">
              <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-xs text-gray-400">Estimating nutrition…</span>
            </div>
          ) : error ? (
            <div className="text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2">
              {error}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(STAT_COLORS).map(k => (
                  <MacroCard key={k} type={k} value={macros[k]} />
                ))}
              </div>
              {aiNote && (
                <div className="text-[11px] text-gray-400 bg-white/5 rounded-xl px-3 py-2 border-l-2 border-orange-500/50">
                  💡 {aiNote}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Log button */}
        <button
          onClick={handleLog}
          disabled={!canLog}
          className={`w-full py-3.5 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
            canLog 
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
              : "bg-white/5 text-gray-500 cursor-not-allowed"
          }`}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logging…
            </>
          ) : loading ? "Estimating…" : "Log Meal →"}
        </button>
      </div>
    </div>
  );
}
