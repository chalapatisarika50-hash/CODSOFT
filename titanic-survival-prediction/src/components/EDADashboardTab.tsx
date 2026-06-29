import React, { useState, useEffect } from 'react';
import { Passenger } from '../types.js';
import { TITANIC_CSV_DATA } from '../data/titanicCSVData.js';
import { 
  BarChart, 
  Users, 
  Ship, 
  HelpCircle, 
  Search, 
  TrendingUp, 
  FileSpreadsheet,
  Layers,
  Heart,
  Skull,
  Anchor,
  DollarSign,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { extractTitle } from '../lib/predictor.js';

interface EDADashboardTabProps {
  passengers: Passenger[];
  isLoading: boolean;
}

export default function EDADashboardTab({ passengers: initialPassengers, isLoading }: EDADashboardTabProps) {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [classFilter, setClassFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [survivedFilter, setSurvivedFilter] = useState<'all' | '1' | '0'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (initialPassengers.length > 0) {
      setPassengers(initialPassengers);
    } else {
      // Fallback parsing from local import if API isn't ready
      const rows = TITANIC_CSV_DATA.trim().split('\n');
      const parsed: Passenger[] = rows.slice(1).map((row) => {
        const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
        const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());
        return {
          PassengerId: parseInt(cleanCols[0] || '0', 10),
          Survived: parseInt(cleanCols[1] || '0', 10),
          Pclass: parseInt(cleanCols[2] || '0', 10),
          Name: cleanCols[3] || '',
          Sex: (cleanCols[4] || 'male') as 'male' | 'female',
          Age: cleanCols[5] ? parseFloat(cleanCols[5]) : null,
          SibSp: parseInt(cleanCols[6] || '0', 10),
          Parch: parseInt(cleanCols[7] || '0', 10),
          Ticket: cleanCols[8] || '',
          Fare: parseFloat(cleanCols[9] || '0'),
          Cabin: cleanCols[10] || '',
          Embarked: (cleanCols[11] || 'S') as 'S' | 'C' | 'Q' | ''
        };
      });
      setPassengers(parsed);
    }
  }, [initialPassengers]);

  // Statistics Calculation
  const totalCount = passengers.length;
  const survived = passengers.filter(p => p.Survived === 1);
  const deceased = passengers.filter(p => p.Survived === 0);
  const survivedCount = survived.length;
  const survivalRate = totalCount > 0 ? (survivedCount / totalCount) * 100 : 0;
  
  // Female VS Male survival rate
  const femalePassengers = passengers.filter(p => p.Sex === 'female');
  const malePassengers = passengers.filter(p => p.Sex === 'male');
  const femaleSurvivalRate = femalePassengers.length > 0 
    ? (femalePassengers.filter(p => p.Survived === 1).length / femalePassengers.length) * 100 
    : 0;
  const maleSurvivalRate = malePassengers.length > 0 
    ? (malePassengers.filter(p => p.Survived === 1).length / malePassengers.length) * 100 
    : 0;

  // Passenger Class survival rate
  const classSurvivalRates = [1, 2, 3].map(cls => {
    const classPassengers = passengers.filter(p => p.Pclass === cls);
    const rate = classPassengers.length > 0 
      ? (classPassengers.filter(p => p.Survived === 1).length / classPassengers.length) * 100 
      : 0;
    return { class: cls, rate, total: classPassengers.length };
  });

  // Embarkation Port survival rates
  const ports = [
    { key: 'C', name: 'Cherbourg (France)', count: 0, survived: 0 },
    { key: 'Q', name: 'Queenstown (Ireland)', count: 0, survived: 0 },
    { key: 'S', name: 'Southampton (England)', count: 0, survived: 0 }
  ];
  
  passengers.forEach(p => {
    const port = ports.find(pObj => pObj.key === p.Embarked);
    if (port) {
      port.count++;
      if (p.Survived === 1) {
        port.survived++;
      }
    } else if (p.Embarked === '') {
      // Defer missing embarked to Southampton as common mode
      const sPort = ports.find(pObj => pObj.key === 'S')!;
      sPort.count++;
      if (p.Survived === 1) sPort.survived++;
    }
  });

  // Age Groups distribution
  const ageBands = [
    { label: 'Infants & Children (0-12)', min: 0, max: 12, count: 0, survived: 0 },
    { label: 'Adolescents (13-19)', min: 13, max: 19, count: 0, survived: 0 },
    { label: 'Young Adults (20-35)', min: 20, max: 35, count: 0, survived: 0 },
    { label: 'Middle Aged (36-55)', min: 36, max: 55, count: 0, survived: 0 },
    { label: 'Seniors (56+)', min: 56, max: 100, count: 0, survived: 0 }
  ];

  let sumSurvivedAge = 0;
  let countSurvivedAge = 0;
  let sumDeceasedAge = 0;
  let countDeceasedAge = 0;

  passengers.forEach(p => {
    if (p.Age !== null) {
      if (p.Survived === 1) {
        sumSurvivedAge += p.Age;
        countSurvivedAge++;
      } else {
        sumDeceasedAge += p.Age;
        countDeceasedAge++;
      }

      ageBands.forEach(band => {
        if (p.Age! >= band.min && p.Age! <= band.max) {
          band.count++;
          if (p.Survived === 1) band.survived++;
        }
      });
    }
  });

  const avgSurvivedAge = countSurvivedAge > 0 ? (sumSurvivedAge / countSurvivedAge) : 0;
  const avgDeceasedAge = countDeceasedAge > 0 ? (sumDeceasedAge / countDeceasedAge) : 0;

  // Fare bands survival rates
  const fareBands = [
    { label: 'Economy (< $10)', min: 0, max: 10, count: 0, survived: 0, color: 'bg-rose-500' },
    { label: 'Mid-Tier ($10 - $30)', min: 10, max: 30, count: 0, survived: 0, color: 'bg-amber-500' },
    { label: 'High Fare ($30 - $100)', min: 30, max: 100, count: 0, survived: 0, color: 'bg-indigo-500' },
    { label: 'Luxury Class (> $100)', min: 100, max: 1000, count: 0, survived: 0, color: 'bg-teal-500' }
  ];

  passengers.forEach(p => {
    fareBands.forEach(band => {
      if (p.Fare >= band.min && p.Fare < band.max) {
        band.count++;
        if (p.Survived === 1) band.survived++;
      }
    });
  });

  // Filter passengers
  const filtered = passengers.map(p => {
    // Inject engineered features in real-time on our sample explorer
    const titleExtracted = extractTitle(p.Name);
    const familySize = p.SibSp + p.Parch + 1;
    const isAlone = familySize === 1;
    return {
      ...p,
      Title: titleExtracted,
      FamilySize: familySize,
      IsAlone: isAlone
    };
  }).filter(p => {
    const matchesSearch = p.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.Ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.Title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === 'all' || p.Sex === genderFilter;
    const matchesClass = classFilter === 'all' || p.Pclass.toString() === classFilter;
    const matchesSurvived = survivedFilter === 'all' || p.Survived.toString() === survivedFilter;
    return matchesSearch && matchesGender && matchesClass && matchesSurvived;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-200 font-sans">
      
      {/* Overview Metric Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center space-x-4">
          <div className="bg-slate-850 p-3.5 rounded-xl text-indigo-400 border border-slate-800">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Training Logs</p>
            <p className="text-2xl font-bold text-white font-mono">{totalCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Core historical instances</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center space-x-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target Survival Rate</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{survivalRate.toFixed(1)}%</p>
            <p className="text-[10px] text-emerald-500 font-medium">{survivedCount} saved / {totalCount - survivedCount} victims</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center space-x-4">
          <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Female Survivability</p>
            <p className="text-2xl font-bold text-rose-500 font-mono">{femaleSurvivalRate.toFixed(1)}%</p>
            <p className="text-[10px] text-slate-500">Protocol "Women first" check</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center space-x-4">
          <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-amber-400">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">First-Class survival</p>
            {(() => {
              const r1 = classSurvivalRates.find(r => r.class === 1)?.rate ?? 0;
              return (
                <>
                  <p className="text-2xl font-bold text-amber-500 font-mono">{r1.toFixed(1)}%</p>
                  <p className="text-[10px] text-slate-500">Socioeconomic priority bias</p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Advanced Statistical Diagrams & Grid Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Survival Rates segmented by Gender and Class */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
          <div>
            <h3 className="font-bold text-slate-200 text-sm tracking-tight uppercase flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Socio-Demographic Stratification (Class & Gender)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Evaluating survival rates combined across physical sex and ticket class parameters.</p>
          </div>

          <div className="space-y-4 pt-2">
            
            {/* Gender breakdown progress bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800/80">
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Female Survival Profile (Mr/Miss/Mrs)</span>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-lg font-extrabold text-rose-450 text-rose-400 font-mono">{femaleSurvivalRate.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">({femalePassengers.filter(f => f.Survived === 1).length} / {femalePassengers.length} saved)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${femaleSurvivalRate}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Male Survival Profile (Mr/Master)</span>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-lg font-extrabold text-blue-450 text-blue-400 font-mono">{maleSurvivalRate.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">({malePassengers.filter(m => m.Survived === 1).length} / {malePassengers.length} saved)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${maleSurvivalRate}%` }} />
                </div>
              </div>
            </div>

            {/* Class-wise relative survival probabilities bar structure */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Survival Rate by Ticket Class tier</span>
              {classSurvivalRates.map(entry => (
                <div key={entry.class} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-405 text-slate-400">
                      {entry.class === 1 ? '1st Class (Upper Deck suite)' : entry.class === 2 ? '2nd Class (Middle Cabin level)' : '3rd Class (Lower Hull quarters)'}
                    </span>
                    <span className={`font-mono ${entry.class === 1 ? 'text-amber-450 text-amber-400' : 'text-slate-300'}`}>
                      {entry.rate.toFixed(1)}% survived <span className="text-slate-500 font-normal text-[10px]">({entry.total} pax)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-900">
                    <div 
                      className={`h-full rounded-full ${entry.class === 1 ? 'bg-amber-500' : entry.class === 2 ? 'bg-indigo-500' : 'bg-slate-650 bg-slate-600'}`}
                      style={{ width: `${entry.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Chart B: Embarkation Port and Survival rate (France, Ireland, UK) */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
          <div>
            <h3 className="font-bold text-slate-200 text-sm tracking-tight uppercase flex items-center gap-2">
              <Anchor className="w-4 h-4 text-emerald-400" />
              Embarkation Port Survival Distribution (Geography)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Comparing overall survival ratios across geographic departure points.</p>
          </div>

          <div className="space-y-4 pt-2">
            
            {ports.map(p => {
              const rate = p.count > 0 ? (p.survived / p.count) * 100 : 0;
              return (
                <div key={p.key} className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-850 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-300">{p.name}</span>
                    <p className="text-[10px] text-slate-500 font-normal">Departed: {p.count} passengers • {p.survived} rescued</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden sm:block w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900/50">
                      <div className="bg-emerald-400 h-full" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-950/50 border border-emerald-900/40 py-1 px-2.5 rounded-lg w-16 text-center">
                      {rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="p-3 bg-slate-950/20 rounded-xl border border-slate-850/60 text-[10px] text-slate-500 leading-relaxed italic">
              * Note: Cherbourg passengers yield a significantly elevated survival rate (~55%). This correlates closely with the high ratio of first-class tickets bought by continental passengers boarding at the French harbor.
            </div>
          </div>
        </div>

        {/* Chart C: Age distribution curves & stats */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div>
            <h3 className="font-bold text-slate-200 text-sm tracking-tight uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-400" />
              Hierarchical Age Distribution Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-1">Grouping survivability rates across customized life-stage cohorts.</p>
          </div>

          {/* Average Age Indicators */}
          <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-800/80">
            <div className="bg-slate-955 p-3 bg-slate-950/50 rounded-xl border border-slate-850 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase font-black">Average Rescued Age</span>
              <p className="text-base font-extrabold text-teal-400 mt-1 font-mono">{avgSurvivedAge.toFixed(1)} yrs</p>
              <span className="text-[9px] text-slate-550 text-slate-500 italic mt-0.5">Children & young mothers dominate</span>
            </div>
            <div className="bg-slate-955 p-3 bg-slate-950/50 rounded-xl border border-slate-850 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase font-black">Average Deceased Age</span>
              <p className="text-base font-extrabold text-slate-400 mt-1 font-mono">{avgDeceasedAge.toFixed(1)} yrs</p>
              <span className="text-[9px] text-slate-550 text-slate-500 italic mt-0.5">Adult men category bias</span>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {ageBands.map(band => {
              const survivorsPercent = band.count > 0 ? (band.survived / band.count) * 100 : 0;
              return (
                <div key={band.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400 text-[11px] font-medium">{band.label}</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {survivorsPercent.toFixed(1)}% survived <span className="text-slate-500 font-normal">({band.count} pax)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded overflow-hidden flex border border-slate-900/80">
                    <div 
                      className="bg-teal-500 h-full rounded-l transition-all duration-500" 
                      style={{ width: `${survivorsPercent}%` }}
                    />
                    <div 
                      className="bg-rose-500/30 h-full rounded-r transition-all duration-500" 
                      style={{ width: `${100 - survivorsPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-805 border-slate-800/80 pt-3 flex justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal-500 inline-block"></span> Survived Segment</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 inline-block text-rose-455 text-rose-550"></span> Deceased Segment</span>
          </div>
        </div>

        {/* Chart D: Financial Fare bands and Surving probabilities */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div>
            <h3 className="font-bold text-slate-200 text-sm tracking-tight uppercase flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              Fare Stratification Analysis (Wealth Bias)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Correlation of survival coefficients against commercial ticket prices paid.</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {fareBands.map(band => {
              const rate = band.count > 0 ? (band.survived / band.count) * 100 : 0;
              return (
                <div key={band.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 font-medium">{band.label}</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {rate.toFixed(1)}% survived <span className="text-slate-500">({band.count} pax)</span>
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden flex border border-slate-900">
                    <div 
                      className={`h-full ${band.color} rounded-full`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="p-3 bg-slate-955 bg-slate-950/30 rounded-xl border border-slate-850/60 text-[10px] text-slate-500 leading-relaxed italic">
              * Meticulous proof of "Wealth Bias": Luxury ticker holders paying over $100 saved themselves with a staggering success rate (~75%), compared to the sub-$10 economy passengers struggling at only ~15% survival.
            </div>
          </div>
        </div>

      </div>

      {/* Dataset Explorer Grid Block with fully enhanced parameters */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-850 border-b-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/20">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              Titanic Dataset Sample Explorer (With Engineered Fields)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Search, query, and analyze passenger listings, revealing extractedTitles and Family Metrics on the fly.</p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search Name / Title..." 
                className="pl-9 pr-4 py-1 bg-slate-955 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-900 text-slate-300 w-44"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <select 
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 cursor-pointer"
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value as any); setCurrentPage(1); }}
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select 
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 cursor-pointer"
              value={classFilter}
              onChange={(e) => { setClassFilter(e.target.value as any); setCurrentPage(1); }}
            >
              <option value="all">All Classes</option>
              <option value="1">1st Class</option>
              <option value="2">2nd Class</option>
              <option value="3">3rd Class</option>
            </select>

            <select 
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 cursor-pointer"
              value={survivedFilter}
              onChange={(e) => { setSurvivedFilter(e.target.value as any); setCurrentPage(1); }}
            >
              <option value="all">All Status</option>
              <option value="1">Survived</option>
              <option value="0">Deceased</option>
            </select>
          </div>
        </div>

        {/* Passengers Table representing the raw data and engineered features */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 font-medium text-xs">
            Loading CSV records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 font-medium text-xs">
            No passengers match your current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-955 bg-slate-950/40 border-b border-slate-800/80 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Passenger Name (Title Extracted)</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Class</th>
                  <th className="px-6 py-3.5">Age</th>
                  <th className="px-6 py-3.5">Engineered Family Size</th>
                  <th className="px-6 py-3.5">Is Alone?</th>
                  <th className="px-6 py-3.5 font-mono">Fare</th>
                  <th className="px-6 py-3.5">Embarked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300 bg-slate-900/10">
                {paginated.map(p => (
                  <tr key={p.PassengerId} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-6 py-3.5 text-slate-505 text-slate-500 font-bold font-mono text-[11px]">{p.PassengerId}</td>
                    
                    {/* Passenger name with extracted Title badge */}
                    <td className="px-6 py-3.5 font-semibold text-slate-200">
                      <div>
                        {p.Name}
                        <span className="ml-2 inline-block px-1.5 py-0.5 text-[9px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-900/40 rounded-md">
                          Title: {p.Title}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      {p.Survived === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Heart className="w-3 h-3 fill-emerald-500" /> Rescued
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-500 border border-slate-700">
                          <Skull className="w-3 h-3 text-slate-500" /> Deceased
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3.5">
                      {p.Pclass === 1 ? (
                        <span className="text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded text-[10px] uppercase border border-amber-500/20">1st Deck</span>
                      ) : p.Pclass === 2 ? (
                        <span className="text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded text-[10px] uppercase border border-sky-500/20">2nd Deck</span>
                      ) : (
                        <span className="text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase border border-slate-700">3rd Deck</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5 text-slate-400 font-mono">
                      {p.Age !== null ? `${p.Age} yrs` : <span className="text-red-400/85 italic font-sans text-[10px]">NaN (Imputed)</span>}
                    </td>

                    {/* Highly relevant engineered dimensions */}
                    <td className="px-6 py-3.5 font-mono text-slate-300">
                      {p.SibSp} Sib / {p.Parch} Par = <strong className="text-indigo-400 font-black">{p.FamilySize} pax</strong>
                    </td>

                    <td className="px-6 py-3.5">
                      {p.IsAlone ? (
                        <span className="text-[10px] bg-teal-950/30 text-teal-400 font-bold border border-teal-900/40 px-1.5 py-0.5 rounded">Alone</span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">With Family</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5 font-bold font-mono text-slate-350">
                      ${(p.Fare ?? 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-bold text-slate-400 uppercase border border-slate-800">
                        {p.Embarked === 'C' ? 'Cherbourg' : p.Embarked === 'Q' ? 'Queenstown' : 'Southampton'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination Bar */}
        <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] font-medium text-slate-500">
            Showing <span className="text-slate-400">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-slate-400">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of{' '}
            <span className="text-slate-400">{filtered.length}</span> entries
          </p>
          <div className="flex items-center space-x-1">
            <button 
              className="px-2.5 py-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none rounded font-medium text-xs transition cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`w-6 h-6 rounded text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  currentPage === page 
                    ? 'bg-indigo-600 text-white border border-indigo-505 border-indigo-500/50 shadow-md shadow-indigo-600/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="px-2.5 py-1 text-slate-505 text-slate-550 hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none rounded font-medium text-xs transition cursor-pointer"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
