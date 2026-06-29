import React, { useState } from 'react';
import { NOTEBOOK_JSON } from '../data/notebookTemplate.js';
import { Play, RotateCcw, AlertTriangle, FileCode, CheckCircle, Flame } from 'lucide-react';

export default function NotebookTab() {
  const [activeCellOutputs, setActiveCellOutputs] = useState<Record<number, any>>({});
  const [cellRunningStates, setCellRunningStates] = useState<Record<number, boolean>>({});
  const [executionCount, setExecutionCount] = useState(1);

  // Define mock rich data structure outputs for execution simulation
  const mockOutputs: Record<number, any> = {
    1: {
      text: '[PASSENGER_CORE_ACTIVE] Node environment ready. Matplotlib/Seaborn layouts initialized.\nLibraries successfully imported!',
      visual: null
    },
    3: {
      text: `Success: Loaded 'Titanic-Dataset.csv' dataset.
Dimensions: 100 rows, 12 columns.
Target class label 'Survived' found.`,
      visual: null
    },
    5: {
      text: `--- FIRST 5 ROWS ---
   PassengerId  Survived  Pclass                                               Name     Sex   Age  SibSp  Parch            Ticket     Fare Cabin Embarked
0            1         0       3                            Braund, Mr. Owen Harris    male  22.0      1      0         A/5 21171   7.2500   NaN        S
1            2         1       1  Cumings, Mrs. John Bradley (Florence Briggs Th...  female  38.0      1      0          PC 17599  71.2833   C85        C
2            3         1       3                             Heikkinen, Miss. Laina  female  26.0      0      0  STON/O2. 3101282   7.9250   NaN        S
3            4         1       1       Futrelle, Mrs. Jacques Heath (Lily May Peel)  female  35.0      1      0            113803  53.1000  C123        S
4            5         0       3                           Allen, Mr. William Henry    male  35.0      0      0            373450   8.0500   NaN        S

--- DATASET SHAPE ---
Rows: 100 | Columns: 12

--- INFO SUMMARY ---
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 100 entries, 0 to 99
Data columns (total 12 columns):
 #   Column       Non-Null Count  Dtype  
---  ------       --------------  -----  
 0   PassengerId  100 non-null    int64  
 1   Survived     100 non-null    int64  
 2   Pclass       100 non-null    int64  
 3   Name         100 non-null    object 
 4   Sex          100 non-null    object 
 5   Age          78 non-null     float64
 6   SibSp        100 non-null    int64  
 7   Parch        100 non-null    int64  
 8   Ticket       100 non-null    object 
 9   Fare         100 non-null    float64
 10  Cabin        20 non-null     object 
 11  Embarked     100 non-null    object 
dtypes: float64(2), int64(5), object(5)
memory usage: 9.5+ KB

--- MISSING VALUE RATIO ---
Age      22
Cabin    80
dtype: int64

--- STATISTICAL SUMMARY ---
       PassengerId    Survived      Pclass         Age       SibSp       Parch        Fare
count   100.000000  100.000000  100.000000   78.000000  100.000000  100.000000  100.000000
mean     50.500000    0.410000    2.400000   27.561923    0.730000    0.440000   28.461125
std      29.011492    0.494311    0.816497   15.539301    1.184539    0.967346   32.067341
min       1.000000    0.000000    1.000000    0.830000    0.000000    0.000000    6.495800
25%      25.750000    0.000000    2.000000   18.250000    0.000000    0.000000    8.050000
50%      50.500000    0.000000    3.000000   26.000000    0.000000    0.000000   15.675000
75%      75.250000    1.000000    3.000000   36.750000    1.000000    0.000000   31.275000
max     100.000000    1.000000    3.000000   71.000000    5.000000    5.000000  263.000000`,
      visual: null
    },
    7: {
      text: 'Creating the directory "output_images/" if it does not exist.\nGenerating and exporting plots...',
      visual: 'plots'
    },
    9: {
      text: `Cleaned Dataset Overview:
   Pclass  Sex   Age  SibSp  Parch     Fare  Embarked
0       3    0  22.0      1      0   7.2500         0
1       1    1  38.0      1      0  71.2833         1
2       3    1  26.0      0      0   7.9250         0
3       1    1  35.0      1      0  53.1000         0
4       3    0  35.0      0      0   8.0500         0

Remaining missing values: 0`,
      visual: null
    },
    11: {
      text: 'Plotting preprocessed correlation matrix...',
      visual: 'heatmap'
    },
    13: {
      text: 'Training instances count: 80 | Validation instances: 20',
      visual: null
    },
    15: {
      text: `Training Models...
Logistic Regression Test Accuracy: 80.00%
Decision Tree Test Accuracy: 75.00%
Random Forest Test Accuracy: 85.00%

Validation Accuracy Leaderboard directly compared:
1. Random Forest: 85.00%
2. Logistic Regression: 80.00%
3. Decision Tree: 75.00%`,
      visual: null
    },
    17: {
      text: `Selected Optimal Classifier: Random Forest

--- CLASSIFICATION REPORT FOR WINNER ---
              precision    recall  f1-score   support

           0       0.85      0.92      0.88        12
           1       0.86      0.75      0.80         8

    accuracy                           0.85        20
   macro avg       0.85      0.83      0.84        20
weighted avg       0.85      0.85      0.85        20


--- CONFUSION MATRIX ---
[[11  1]
 [ 2  6]]

True Negative (Deceased correctly identified): 11
False Positive (Deceased labeled as survived): 1
False Negative (Survived labeled as deceased): 2
True Positive (Survived correctly identified): 6`,
      visual: null
    },
    19: {
      text: `Passenger 1 prediction: DECEASED with confidence 85.4%
Passenger 2 prediction: SURVIVED with confidence 94.2%`,
      visual: null
    }
  };

  const handleRunCell = (idx: number) => {
    setCellRunningStates(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setCellRunningStates(prev => ({ ...prev, [idx]: false }));
      setActiveCellOutputs(prev => ({
        ...prev,
        [idx]: {
          count: executionCount,
          data: mockOutputs[idx] || { text: 'Cell executed successfully with exit code 0.' }
        }
      }));
      setExecutionCount(prev => prev + 1);
    }, 850);
  };

  const handleRunAll = () => {
    NOTEBOOK_JSON.cells.forEach((cell, idx) => {
      if (cell.cell_type === 'code') {
        const timeoutDelay = idx * 250;
        setTimeout(() => {
          setCellRunningStates(prev => ({ ...prev, [idx]: true }));
          setTimeout(() => {
            setCellRunningStates(prev => ({ ...prev, [idx]: false }));
            setActiveCellOutputs(prev => ({
              ...prev,
              [idx]: {
                count: executionCount + idx,
                data: mockOutputs[idx] || { text: 'Cell executed successfully.' }
              }
            }));
          }, 450);
        }, timeoutDelay);
      }
    });
    setExecutionCount(prev => prev + NOTEBOOK_JSON.cells.length);
  };

  const handleClearAll = () => {
    setActiveCellOutputs({});
    setCellRunningStates({});
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-fade-in font-sans">
      
      {/* Jupyter Toolbar */}
      <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-600 p-2 rounded text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-600/20">IPY</div>
          <div>
            <h3 className="font-bold text-slate-200 text-sm tracking-tight flex items-center gap-2">
              Titanic_Survival_Prediction.ipynb 
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-1.5 py-0.5">Python 3 (ipykernel)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Interactive virtual runtime workspace for Jupyter Notebook cells.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRunAll} 
            className="flex items-center space-x-1.5 bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run All Cells</span>
          </button>
          <button 
            onClick={handleClearAll} 
            className="flex items-center space-x-1.5 bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs px-3 py-2 rounded-lg hover:bg-slate-750 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Kernel</span>
          </button>
        </div>
      </div>

      {/* Notebook Body */}
      <div className="p-6 space-y-6">
        {NOTEBOOK_JSON.cells.map((cell, idx) => {
          const isCode = cell.cell_type === 'code';
          const outputs = activeCellOutputs[idx];
          const isRunning = cellRunningStates[idx];

          if (!isCode) {
            // Render Markdown Cell
            return (
              <div key={idx} className="group relative pl-16 pr-6 py-3 hover:bg-slate-800/30 rounded-lg transition-colors border-l-4 border-transparent hover:border-slate-705">
                <span className="absolute left-3 top-4 text-[10px] text-indigo-400/80 font-mono select-none font-bold">Markdown</span>
                <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed space-y-1">
                  {cell.source.map((line, lIdx) => {
                    const isHeading = line.startsWith('#');
                    const isBold = line.startsWith('**');
                    if (isHeading) {
                      const level = line.match(/^#+/)?.[0].length || 1;
                      const text = line.replace(/^#+\s*/, '').trim();
                      if (level === 1) return <h1 key={lIdx} className="text-xl font-bold text-white mt-2 mb-1">{text}</h1>;
                      if (level === 2) return <h2 key={lIdx} className="text-lg font-bold text-slate-200 mt-2 mb-1">{text}</h2>;
                      return <h3 key={lIdx} className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-2 mb-1">{text}</h3>;
                    }
                    return <p key={lIdx} className="text-xs text-slate-400">{line.replace(/\\`/g, '`')}</p>;
                  })}
                </div>
              </div>
            );
          }

          // Code Cell Markup
          return (
            <div key={idx} className="group relative flex flex-col space-y-2">
              <div className="flex">
                {/* Input Number Indicator */}
                <div className="w-14 shrink-0 pt-3 pr-2 text-right">
                  <span className="font-mono text-[10px] font-bold text-slate-550 select-none">
                    {isRunning ? 'In [*]:' : outputs ? `In [${outputs.count}]:` : 'In [ ]:'}
                  </span>
                </div>

                {/* Code Container */}
                <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden group-hover:border-slate-800 transition shadow-sm relative">
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      title="Execute Cell"
                      disabled={isRunning}
                      onClick={() => handleRunCell(idx)}
                      className="p-1 text-slate-400 hover:text-emerald-400 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 disabled:opacity-50 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-350">
                    <code>
                      {cell.source.join('')}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Cell Output Segment */}
              {outputs && (
                <div className="flex">
                  <div className="w-13 shrink-0 text-right pr-2 pt-1 font-mono text-[9px] font-bold text-rose-500/70 select-none">
                    Out [{outputs.count}]:
                  </div>
                  <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-[11px] text-slate-300 leading-normal space-y-4 shadow-inner overflow-x-auto">
                    
                    {/* Raw Text Output Log */}
                    <pre className="whitespace-pre text-slate-300">{outputs.data.text}</pre>
                    
                    {/* Visual Charts Injected inside Jupyter */}
                    {outputs.data.visual === 'plots' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850 pt-4 mt-2">
                        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg flex flex-col items-center">
                          <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">survival_count.png</p>
                          <div className="w-full bg-slate-950/80 h-44 rounded border border-slate-850 flex items-center justify-center p-4">
                            {/* SVG mockup of countplot */}
                            <svg viewBox="0 0 200 120" className="w-full max-w-xs h-full">
                              <rect x="30" y="20" width="40" height="80" rx="4" fill="#475569" />
                              <rect x="110" y="50" width="40" height="50" rx="4" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
                              <text x="50" y="112" fontSize="9" textAnchor="middle" fill="#64748b" fontWeight="bold">0 (Deceased)</text>
                              <text x="130" y="112" fontSize="9" textAnchor="middle" fill="#818cf8" fontWeight="bold">1 (Survived)</text>
                              <text x="50" y="15" fontSize="10" textAnchor="middle" fill="#94a3b8" fontWeight="bold">590 pax</text>
                              <text x="130" y="45" fontSize="10" textAnchor="middle" fill="#a5b4fc" fontWeight="bold">301 pax</text>
                            </svg>
                          </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg flex flex-col items-center">
                          <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">survival_by_gender.png</p>
                          <div className="w-full bg-slate-950/80 h-44 rounded border border-slate-850 flex items-center justify-center p-4">
                            {/* SVG mockup of gender analysis */}
                            <svg viewBox="0 0 200 120" className="w-full max-w-xs h-full">
                              <line x1="10" y1="90" x2="190" y2="90" stroke="#334155" />
                              {/* Male bar: 18.89% */}
                              <rect x="35" y="73" width="35" height="17" rx="3" fill="#64748b" />
                              {/* Female bar: 74.2% */}
                              <rect x="115" y="20" width="35" height="70" rx="3" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
                              <text x="52" y="105" fontSize="9" textAnchor="middle" fill="#64748b" fontWeight="bold">male</text>
                              <text x="132" y="105" fontSize="9" textAnchor="middle" fill="#fb7185" fontWeight="bold">female</text>
                              <text x="52" y="66" fontSize="10" textAnchor="middle" fill="#94a3b8" fontWeight="bold">18.9%</text>
                              <text x="132" y="14" fontSize="10" textAnchor="middle" fill="#fda4af" fontWeight="bold">74.2%</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {outputs.data.visual === 'heatmap' && (
                      <div className="border-t border-slate-855 border-slate-800 pt-4 mt-2">
                        <div className="bg-slate-900/60 border border-slate-805 border-slate-800/60 p-4 rounded-lg flex flex-col items-center">
                          <p className="text-[10px] uppercase font-bold text-slate-505 text-slate-500 mb-2">correlation_heatmap.png</p>
                          <div className="w-full bg-slate-950/80 max-w-sm h-48 rounded border border-slate-850 flex items-center justify-center p-4">
                            {/* SVG mockup of correlation matrix heatmap */}
                            <svg viewBox="0 0 200 120" className="w-full h-full font-mono">
                              <rect x="10" y="10" width="40" height="20" fill="#be123c" rx="2" />
                              <rect x="55" y="10" width="40" height="20" fill="#78350f" rx="2" />
                              <rect x="100" y="10" width="40" height="20" fill="#334155" rx="2" />
                              <rect x="145" y="10" width="40" height="20" fill="#1e3a8a" rx="2" />

                              <rect x="10" y="35" width="40" height="20" fill="#78350f" rx="2" />
                              <rect x="55" y="35" width="40" height="20" fill="#be123c" rx="2" />
                              <rect x="100" y="35" width="40" height="20" fill="#1e3a8a" rx="2" />
                              <rect x="145" y="35" width="40" height="20" fill="#334155" rx="2" />

                              <rect x="10" y="60" width="40" height="20" fill="#334155" rx="2" />
                              <rect x="55" y="60" width="40" height="20" fill="#1e3a8a" rx="2" />
                              <rect x="100" y="60" width="40" height="20" fill="#be123c" rx="2" />
                              <rect x="145" y="60" width="40" height="20" fill="#78350f" rx="2" />

                              {/* Labels */}
                              <text x="30" y="23" fontSize="8" textAnchor="middle" fill="#fff" fontWeight="bold">1.00</text>
                              <text x="75" y="23" fontSize="8" textAnchor="middle" fill="#f59e0b" fontWeight="bold">0.42</text>
                              <text x="120" y="23" fontSize="8" textAnchor="middle" fill="#94a3b8" fontWeight="bold">0.05</text>
                              <text x="165" y="23" fontSize="8" textAnchor="middle" fill="#60a5fa" fontWeight="bold">-0.54</text>

                              {/* Row Labels */}
                              <text x="30" y="94" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">Survived</text>
                              <text x="75" y="94" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">Pclass</text>
                              <text x="120" y="94" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">Age</text>
                              <text x="165" y="94" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">Gender</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
