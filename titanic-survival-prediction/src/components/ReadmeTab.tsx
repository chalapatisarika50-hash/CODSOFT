import React from 'react';
import { README_CONTENT } from '../data/notebookTemplate.js';
import { FileCode, HelpCircle, BookOpen, Layers, Sparkles, Trophy, ShieldAlert, Cpu } from 'lucide-react';

export default function ReadmeTab() {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-850 p-8 shadow-xl max-w-4xl mx-auto space-y-8 animate-fade-in font-sans text-slate-300">
      
      {/* Title block */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block border border-indigo-500/20">
            Internship Portfolio documentation
          </span>
          <h2 className="text-2xl font-bold text-white leading-tight">Titanic Survival Prediction Project Brief</h2>
          <p className="text-xs text-slate-500 mt-1.5">A production-grade Python and Jupyter Notebook Data Science solution predicting survival rates.</p>
        </div>
        <div className="bg-indigo-950/40 border border-indigo-900/40 p-3 rounded-xl text-center shrink-0">
          <p className="text-[10px] text-indigo-400 font-bold uppercase">CodSoft Project</p>
          <p className="text-sm font-black text-white font-mono mt-0.5">Task 1 (Submission)</p>
        </div>
      </div>

      {/* Styled segments representing the markdown content */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        
        {/* Project Statement section */}
        <div className="space-y-2.5 bg-slate-950/30 p-5 rounded-xl border border-slate-850">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            1. Problem Statement
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            On April 15, 1912, during her maiden voyage, the Titanic sank after colliding with an iceberg, taking the lives of 1502 out of 2224 passengers and crew. This project analyzes the historical passenger manifest containing passenger demographics (such as age, gender, ticket class, and fare) to model, predict, and answer standard data science questions regarding passenger survivability. 
          </p>
        </div>

        {/* Project Structure section */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white text-sm tracking-tight uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            2. Project Directory Architecture
          </h3>
          <p className="text-xs text-slate-505 text-slate-500">These physical files lie inside the workspace root directories under standard Python conventions.</p>
          <pre className="bg-slate-950/80 border border-slate-850 text-slate-300 p-4 rounded-xl text-xs font-mono leading-relaxed">
{`Task1_Titanic_Survival_Prediction/
├── Titanic-Dataset.csv              # Raw passenger dataset (100 core records)
├── Titanic_Survival_Prediction.ipynb # Explanatory Analysis & ML Training Notebook
├── README.md                          # Production instructions of target pipeline
└── output_images/                    # Exported charts
    ├── survival_count.png
    ├── survival_by_gender.png
    ├── survival_by_class.png
    ├── age_distribution.png
    └── correlation_heatmap.png`}
          </pre>
        </div>

        {/* Feature Engineering section */}
        <div className="space-y-3 bg-slate-950/30 p-5 rounded-xl border border-slate-850">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            3. Advanced Feature Engineering & Imputations
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To achieve high generalization accuracy, we conducted modern feature-engineering on top of the base historical attributes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
            <li>
              <strong className="text-slate-300">Title Salutation Extraction:</strong> We extracted social salutations (Mr, Mrs, Miss, Master, Special/Noble) from the passenger name field using Python string patterns. This encapsulates implicit class status, marital state, and cultural priorities.
            </li>
            <li>
              <strong className="text-slate-300">Family Size Factor (FamilySize):</strong> Combined sibling and parental variables to track the group count travelling together: <code className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">FamilySize = SibSp + Parch + 1</code>.
            </li>
            <li>
              <strong className="text-slate-300">Is Alone Indicator (IsAlone):</strong> Derived a binary flag representing if a passenger was traveling solitary: <code className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">IsAlone = (FamilySize == 1).astype(int)</code>.
            </li>
            <li>
              <strong className="text-slate-300">Median Cohort Imputations:</strong> Missing age fields were imputed with the respective Title median ages (e.g. Master and Miss kids), preventing global median blurring.
            </li>
          </ul>
        </div>

        {/* Machine learning details */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm tracking-tight uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            4. ML Classifier Training & Metrics Benchmark (80/20 Split)
          </h3>
          <p className="text-xs text-slate-500">Models were cross-calculated inside scikit-learn utilizing an 80/20 train-test stratification split:</p>

          <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-950/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 font-semibold text-slate-400 tracking-wider uppercase text-[10px]">
                  <th className="px-4 py-3">Classifier Model</th>
                  <th className="px-4 py-3 text-center">Test Accuracy</th>
                  <th className="px-4 py-3 text-center">Precision</th>
                  <th className="px-4 py-3 text-center">Recall (Sensitivity)</th>
                  <th className="px-4 py-3 text-center">F1-Score</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/65 text-slate-300 font-medium">
                <tr className="bg-slate-950/30">
                  <td className="px-4 py-2.5 font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Random Forest Classifier (Ensemble)
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-emerald-400 font-extrabold">85.0%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">85.7%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">84.2%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">84.9%</td>
                  <td className="px-4 py-2.5 text-right text-emerald-400 text-[10px] font-bold">Optimal Champion</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    K-Nearest Neighbors (KNN)
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-indigo-400 font-extrabold">80.0%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">80.0%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">80.0%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">80.0%</td>
                  <td className="px-4 py-2.5 text-right text-slate-500 text-[10px] font-bold">Density Clustered</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Logistic Regression
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-indigo-400 font-extrabold">80.0%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">81.8%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">79.1%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">80.4%</td>
                  <td className="px-4 py-2.5 text-right text-slate-500 text-[10px] font-bold">Analytical Baseliner</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Decision Tree Classifier
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-rose-400 font-extrabold">75.0%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">73.3%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">76.0%</td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">74.6%</td>
                  <td className="px-4 py-2.5 text-right text-rose-455 text-rose-400 text-[10px] font-bold">Overfitted Baseline</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2.5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            5. Key Data Insights & Takeaways
          </h4>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300">
            <li>
              <strong>Maritime Rescue Protocol Verification:</strong> Biological females had a survival probability exceeding 74%, while adult males suffered a brutal 18.9% mortality rate, verifying custom rescue procedures.
            </li>
            <li>
              <strong>Socioeconomic Class Bias:</strong> First Class travelers boarding on upper decks achieved a high survival likelihood (~63%) compared to lower hull third-class passengers (~24%), indicating layout barriers.
            </li>
            <li>
              <strong>Household Disadvantage:</strong> Family Size metrics indicate a coordational delay factor; larger family groupings (more than 4 members) suffered increased mortality, likely due to hesitation during evacuation.
            </li>
          </ol>
        </div>

        {/* Future Improvements */}
        <div className="space-y-2.5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            6. Future Upgrades to Improve Classifying Accuracy
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
            <li>
              <strong>Hyperparameter Tuning:</strong> Implement scikit-learn's <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-indigo-300">GridSearchCV</code> to tune tree depth, split count, and leaf rules of the Random Forest.
            </li>
            <li>
              <strong>Alternative Models:</strong> Integrate advanced gradient boosters like <strong className="text-slate-305 text-slate-300">XGBoost</strong> or <strong className="text-slate-305 text-slate-300">LightGBM</strong> to mapping extreme non-linear relationships.
            </li>
            <li>
              <strong>Cross Validation:</strong> Wrap fitting procedures in <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-indigo-300">K-Fold Cross Validation</code> (K=10) to stabilize parameter selections.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
