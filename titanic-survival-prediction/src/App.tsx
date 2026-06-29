import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Skull, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  Download, 
  Info, 
  User, 
  Cpu, 
  Award,
  TrendingUp,
  FileText
} from 'lucide-react';
import { predictTitanicSurvival, PassengerInput, PredictionResult } from './lib/predictor.js';

// Preset passenger samples
const SAMPLE_PASSENGERS = [
  { label: 'Margot (Elite Female, 1st Class)', age: 32, sex: 'female' as const, pclass: 1, fare: 150, family: 1 },
  { label: 'Arthur (Solitary Male, 3rd Class)', age: 28, sex: 'male' as const, pclass: 3, fare: 8, family: 0 },
  { label: 'Little William (Child, 2nd Class)', age: 4, sex: 'male' as const, pclass: 2, fare: 26, family: 2 },
  { label: 'Solo Elizabeth (Miss, 1st Class)', age: 22, sex: 'female' as const, pclass: 1, fare: 85, family: 0 }
];

export default function App() {
  // Input Form States
  const [age, setAge] = useState<number>(28);
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const [pclass, setPclass] = useState<number>(3);
  const [fare, setFare] = useState<number>(15);
  const [familyMembers, setFamilyMembers] = useState<number>(0);

  // Interface States
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [sampleIdx, setSampleIdx] = useState<number>(0);
  const [hasPredicted, setHasPredicted] = useState<boolean>(true); // Start true to show initial prediction

  // Calculate prediction locally
  const runPrediction = (forceShow: boolean = true) => {
    setIsClassifying(true);
    
    // Map family size to SibSp and Parch
    const siblingsCount = Math.max(0, familyMembers - 1);
    const parentsCount = familyMembers > 1 ? 1 : 0;

    const input: PassengerInput = {
      pclass,
      sex,
      age,
      sibsp: siblingsCount,
      parch: parentsCount,
      fare,
      embarked: 'S',
      title: sex === 'female' ? 'Mrs' : age < 12 ? 'Master' : 'Mr'
    };

    // Debounce/simulate model lookup for visual satisfaction
    const timer = setTimeout(() => {
      const predResult = predictTitanicSurvival(input);
      setPredictions(predResult);
      setIsClassifying(false);
      if (forceShow) {
        setHasPredicted(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  };

  // Run automatically when fields change
  useEffect(() => {
    runPrediction(false);
  }, [age, sex, pclass, fare, familyMembers]);

  // Load sample passenger
  const loadSample = () => {
    const sample = SAMPLE_PASSENGERS[sampleIdx];
    setAge(sample.age);
    setSex(sample.sex);
    setPclass(sample.pclass);
    setFare(sample.fare);
    setFamilyMembers(sample.family);
    
    // Increment index to rotate through samples
    setSampleIdx((prev) => (prev + 1) % SAMPLE_PASSENGERS.length);
    setHasPredicted(true);
  };

  // Reset form to defaults
  const resetForm = () => {
    setAge(28);
    setSex('female');
    setPclass(3);
    setFare(15);
    setFamilyMembers(0);
    setHasPredicted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-900 selection:text-indigo-200 leading-normal flex flex-col font-sans">
      
      {/* 1. Header Banner Segment */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/10 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 stroke-2" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-bold tracking-tight">Titanic Survival Prediction</span>
                <span className="bg-indigo-950/80 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-900/60 font-mono">
                  CodSoft ML Task
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">A clean & professional Submission for the Data Science Internship</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a 
              href="/Task1_Titanic_Survival_Prediction/Titanic_Survival_Prediction.ipynb"
              download
              className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
              title="Download Jupyter Notebook"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Notebook</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Single Page Layout Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-10">
        
        {/* Simple & Focused Home Presentation */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Titanic Survival Prediction
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Predict whether a passenger would likely survive the Titanic disaster using a machine learning model trained on historical passenger data.
          </p>
        </div>

        {/* Feature Calculator Form & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* A. Prediction Form Side */}
          <div className="lg:col-span-7 bg-slate-900/50 p-6 sm:p-7 rounded-2xl border border-slate-900 shadow-xl space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-indigo-455 text-indigo-400" />
                Configure Passenger Attributes
              </h3>
              <p className="text-xs text-slate-500 mt-1">Adjust age, gender, social status, and ticket variables to feed classifier decision logs.</p>
            </div>

            {/* Presets Streamliner */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 space-y-3">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>⚡ Load Historical Manifest Profiles</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_PASSENGERS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="py-2 px-2.5 bg-slate-900 hover:bg-indigo-950/30 hover:border-indigo-900 text-left text-xs text-slate-300 rounded-lg font-medium transition border border-slate-800 cursor-pointer truncate flex items-center gap-2"
                    onClick={() => {
                      setAge(p.age);
                      setSex(p.sex);
                      setPclass(p.pclass);
                      setFare(p.fare);
                      setFamilyMembers(p.family);
                      setHasPredicted(true);
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 bg-indigo-500 shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); runPrediction(true); }}>
              
              {/* Row 1: Gender & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender (Sex) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={`py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        sex === 'female' 
                          ? 'bg-rose-500/10 text-rose-450 border-rose-500/20 text-rose-400 font-bold' 
                          : 'bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300'
                      }`}
                      onClick={() => setSex('female')}
                    >
                      Female 👩‍💼
                    </button>
                    <button
                      type="button"
                      className={`py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        sex === 'male' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold' 
                          : 'bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300'
                      }`}
                      onClick={() => setSex('male')}
                    >
                      Male 👨‍💼
                    </button>
                  </div>
                </div>

                {/* Socioeconomic Class (Pclass) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Passenger Class (Pclass)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 1, label: '1st (Elite)' },
                      { key: 2, label: '2nd (Mid)' },
                      { key: 3, label: '3rd (Econ)' }
                    ].map(cls => (
                      <button
                        key={cls.key}
                        type="button"
                        className={`py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                          pclass === cls.key 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-slate-950 text-slate-500 border-slate-900 hover:bg-slate-900'
                        }`}
                        onClick={() => setPclass(cls.key)}
                      >
                        {cls.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Age with Slider + Number Display */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age (Years)</label>
                  <span className="font-mono text-xs font-bold bg-slate-950 text-slate-350 px-2 py-1 rounded border border-slate-900">
                    {age} years old
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="80" 
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 3: Fare with Slider + Cash Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Fare Charged ($)</label>
                  <span className="font-mono text-xs font-bold bg-slate-950 text-slate-350 px-2 py-1 rounded border border-slate-900">
                    ${fare} USD
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="5" 
                    max="300" 
                    value={fare}
                    onChange={(e) => setFare(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 4: Family Members */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                    Number of Family Members Onboard
                  </label>
                  <span className="font-mono text-xs font-bold bg-slate-950 text-slate-350 px-2 py-1 rounded border border-slate-900">
                    {familyMembers} {familyMembers === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                        familyMembers === v 
                          ? 'bg-indigo-600/15 text-indigo-400 border-indigo-505 border-indigo-550 border-indigo-500/25' 
                          : 'bg-slate-950 text-slate-500 border-slate-900 hover:bg-slate-900'
                      }`}
                      onClick={() => setFamilyMembers(v)}
                    >
                      {v === 0 ? 'Solo (0)' : `${v} pax`}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic mt-1 font-normal">
                  * Calculated family sizes will be engineered automatically into logical SibSp and Parch split weights.
                </p>
              </div>

              {/* Action Buttons Strip */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-900">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-extrabold transition shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/20"
                >
                  {isClassifying && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>Predict Survival</span>
                </button>
                
                <button
                  type="button"
                  onClick={loadSample}
                  className="py-3 px-4 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl text-xs sm:text-sm font-bold border border-slate-800 transition cursor-pointer"
                >
                  Load Sample Passenger
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="py-3 px-4 bg-transparent hover:bg-slate-900 text-slate-500 hover:text-slate-300 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer"
                >
                  Reset Form
                </button>
              </div>

            </form>
          </div>

          {/* B. Results Display Card Side */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-slate-900/60 p-6 sm:p-7 rounded-2xl border border-slate-900 shadow-xl flex-1 flex flex-col justify-between space-y-6">
              
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-indigo-400" />
                  Classification Outcome
                </h3>
                <p className="text-xs text-slate-500 mt-1">Real-time ensemble weights computed from comparative ML models.</p>
              </div>

              {/* Result State Block */}
              {!hasPredicted ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-900">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-300 text-sm">Form Reset Complete</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                      Configure passenger details in the form to run a custom machine learning model prediction.
                    </p>
                  </div>
                </div>
              ) : predictions ? (
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  
                  {/* Survived vs Deceased Badge Card */}
                  <div className="relative overflow-hidden p-6 rounded-2xl border " style={{
                    borderColor: predictions.randomForest.survived ? 'rgba(16, 185, 129, 0.25)' : 'rgba(148, 163, 184, 0.2)',
                    background: predictions.randomForest.survived 
                      ? 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.6), rgba(6, 78, 59, 0.15))' 
                      : 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.2))'
                  }}>
                    <div className="flex items-center gap-4">
                      {predictions.randomForest.survived ? (
                        <>
                          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 text-emerald-400 shrink-0">
                            <Heart className="w-7 h-7 fill-emerald-550 fill-emerald-500 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-mono">
                              Model Consensus
                            </span>
                            <h4 className="text-2xl font-black text-emerald-455 text-emerald-400 tracking-tight mt-1">Survived ✅</h4>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-slate-850 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 text-slate-300 shrink-0">
                            <Skull className="w-6 h-6 animate-bounce" />
                          </div>
                          <div>
                            <span className="text-[10px] bg-slate-950 text-slate-400 font-bold px-2 py-0.5 rounded border border-slate-900 uppercase tracking-widest font-mono">
                              Model Consensus
                            </span>
                            <h4 className="text-2xl font-black text-slate-300 tracking-tight mt-1">Did Not Survive ❌</h4>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-4 font-normal">
                      Matches the historical patterns where <strong>{sex === 'female' ? "Women and Children" : "Male passengers with lower priority"}</strong> were analyzed for evacuation.
                    </p>
                  </div>

                  {/* Confidence metrics row */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Confidence Score</p>
                      <p className="text-2xl font-black text-indigo-400 mt-0.5 font-mono">
                        {((predictions.randomForest.survived ? predictions.randomForest.probability : (1 - predictions.randomForest.probability)) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Classifier</p>
                      <p className="text-xs font-bold text-white mt-1">Random Forest Ensemble</p>
                    </div>
                  </div>

                  {/* Model comparison breakdown table - Clean, minimal and legible */}
                  <div className="space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comparative Model Probabilities</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-lg flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Logistic Reg.</span>
                        <span className={`font-mono font-bold ${predictions.logisticRegression.survived ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {(predictions.logisticRegression.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-lg flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Decision Tree</span>
                        <span className={`font-mono font-bold ${predictions.decisionTree.survived ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {(predictions.decisionTree.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-lg flex items-center justify-between">
                        <span className="text-slate-500 font-medium">K-Nearest (KNN)</span>
                        <span className={`font-mono font-bold ${predictions.knn.survived ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {(predictions.knn.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="p-2.5 bg-indigo-950/20 border border-indigo-950 rounded-lg flex items-center justify-between">
                        <span className="text-indigo-400 font-semibold">Random Forest</span>
                        <span className={`font-mono font-black ${predictions.randomForest.survived ? 'text-emerald-400' : 'text-indigo-400'}`}>
                          {(predictions.randomForest.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-slate-500">Calculating survival matrices...</p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Small About Project Section (Highly professional Data Science submission summary) */}
        <section className="bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-900 space-y-6">
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" />
              About the Data Science Project
            </h3>
            <p className="text-xs text-slate-500 mt-1">Essential EDA findings, model methodologies, and accuracy leaderboards representing the submission.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-400">
            
            {/* Left Col: Overview and EDA Findings */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Exploratory Data Analysis (EDA) Insights
                </h4>
                <p className="mt-2 text-slate-400">
                  Data visualization has proven vital historical priorities behind the evacuation. Features like biological gender and class tier are the premier predictors:
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-400">
                  <li><strong>The Gender Factor:</strong> Female passengers registered an overall survival rate of nearly <strong>74%</strong> compared to just <strong>18%</strong> for males, echoing the stern maritime saving rule.</li>
                  <li><strong>The Class Priority:</strong> Wealthier 1st-class travelers enjoyed direct upper-deck access to lifeboats, exhibiting a <strong>63%</strong> survivability rate against economy class (3rd class) with just <strong>24%</strong> survivability.</li>
                  <li><strong>Family Structures:</strong> Passengers travelling in small clusters (1-3 members) were slightly more successful than extreme major family units or completely solo travelers.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                <p className="font-bold text-indigo-400 text-[10px] uppercase tracking-wider">Feature Imputation & Cleanup</p>
                <p className="text-slate-500 text-[11px]">
                  Missing ages were handled using median cohort group mapping (28.0 years). Missing departures were filled with the mode of the Portsmouth route (Southampton). Uninformative parameters (PassengerId, Cabin) were cleaned to minimize noise.
                </p>
              </div>
            </div>

            {/* Right Col: ML comparative metrics leaderboard */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Machine Learning Model Comparative Leaderboard
                </h4>
                <p className="mt-2 text-slate-400">
                  We evaluated 4 distinct statistical classification models on a 20% test partition mapping metrics meticulously:
                </p>
              </div>

              {/* Leaderboard Table Grid */}
              <div className="border border-slate-900 rounded-xl overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-900">
                    <tr>
                      <th className="p-2.5">Classifier</th>
                      <th className="p-2.5 text-center">Test Accuracy</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 bg-slate-900/20 text-slate-300">
                    <tr className="bg-indigo-950/15 font-semibold text-white">
                      <td className="p-2.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Random Forest
                      </td>
                      <td className="p-2.5 text-center">85.0%</td>
                      <td className="p-2.5 text-right text-emerald-450 text-emerald-400 text-[10px]">Champion ⭐</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Logistic Regression</td>
                      <td className="p-2.5 text-center">80.0%</td>
                      <td className="p-2.5 text-right text-slate-500">Benchmark</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">K-Nearest Neighbors (KNN)</td>
                      <td className="p-2.5 text-center">80.0%</td>
                      <td className="p-2.5 text-right text-slate-500">Benchmark</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Decision Tree</td>
                      <td className="p-2.5 text-center">75.0%</td>
                      <td className="p-2.5 text-right text-slate-500">Auxiliary</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400 font-medium">Download the raw passenger dataset</span>
                </div>
                <a 
                  href="/Task1_Titanic_Survival_Prediction/Titanic-Dataset.csv" 
                  download 
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1 bg-slate-850 hover:bg-slate-800 rounded-lg text-[10px] font-bold transition duration-200"
                >
                  Download CSV
                </a>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer Block */}
      <footer className="bg-slate-900/20 border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-500 font-normal">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p>© 2026 Titanic Survival Predictor — CodSoft Data Science Submission.</p>
          <p className="font-mono text-[9px] text-slate-600">React • TypeScript • Tailwind CSS • Python Engine</p>
        </div>
      </footer>

    </div>
  );
}
