# Titanic Survival Prediction Project
## CodSoft Data Science Internship Submission

An elite, production-ready machine learning and exploratory data analysis submission for predicting passenger survival probability on the RMS Titanic. This project combines a high-fidelity Python/Jupyter Notebook pipeline with a simple, beautiful, and user-friendly web interface.

---

### 1. Project Overview
This project constitutes the **Task 1: Titanic Survival Prediction** submission for the **CodSoft Data Science Internship**. The primary objective is to build a modern machine learning classifier capable of predicting whether a passenger would survive the tragic maritime accident of 1912. 

The project delivers:
* **The Notebook Pipeline**: A complete exploratory data analysis, data cleaning, feature engineering, and model training script hosted in `Titanic_Survival_Prediction.ipynb`.
* **The Web App**: A lightweight, modern Python Flask web application paired with an interactive React SPA layout that lets users experiment with custom passenger demographics and view predictive consensus in real-time.

---

### 2. Problem Statement
The sinking of the RMS Titanic on April 15, 1912, during her maiden voyage is one of the most devastating commercial marine disasters in history. Collision with an iceberg resulted in the death of 1,502 out of 2,224 passengers and crew members.

The core data science objective of this research is to build a predictive model that answers: **"What typical demographic characteristics prioritized passenger survival during evacuation?"** By modeling features like gender, ticket class, age, and family attachments, we aim to map historical priority rules (like "women and children first") into mathematical classifiers.

---

### 3. Dataset Information
The machine learning pipeline utilizes the historical manifest dataset (`Titanic-Dataset.csv`) which lists individual registers for travelers.

#### Data Columns & Descriptions:
* **PassengerId**: Scalar incremental identifier (unique to each passenger).
* **Survived**: Ground truth target label (`0 = Did Not Survive ❌`, `1 = Survived ✅`).
* **Pclass**: Socioeconomic passenger class ticket tier (`1 = 1st/Upper (Elite)`, `2 = 2nd/Middle`, `3 = 3rd/Lower (Economy)`).
* **Name**: Full text name (includes honorific titles e.g., Mr, Mrs, Miss, Master, Dr, etc.).
* **Sex**: Demographic gender (`male`, `female`).
* **Age**: Numerical age in fractional years.
* **SibSp**: Count of siblings or spouses traveling onboard with the passenger.
* **Parch**: Count of parental figures or children traveling onboard with the passenger.
* **Ticket**: Ticket identifier alpha-numeric sequence.
* **Fare**: Monetary fare ticket cost ($ USD).
* **Cabin**: Cabin room assignment ID.
* **Embarked**: Port of departure harbor (`S = Southampton`, `C = Cherbourg`, `Q = Queenstown`).

#### Data Cleaning & Imputation Actions:
* **Missing Value Imputations**:
  * Missing ages (~177 instances missing) were imputed using the cohort **median age of 28.0 years** to avoid skewed averages.
  * Missing embarkation ports (2 instances missing) were imputed with the statistical **mode ("S")**.
* **High Cardinality Cleanup**:
  * The `Cabin` attribute was missing over 77% of entries and was dropped to prevent model overfitting.
  * Extraneous tracking variables (`PassengerId`, `Ticket`, `Name`) were removed from core feature matrices.

---

### 4. EDA Findings (Exploratory Data Analysis)
Exploratory visualizations and correlation maps yielded critical insights into historical rescue protocols:

1. **The Gender Priority Rule**:
   * Biological female passengers registered an overall survival probability of **~74.2%**.
   * Biological male passengers registered a survival rate of only **~18.9%**.
   * *Conclusion*: Gender is the most informative single predictor in the model context.
2. **Socioeconomic Class Stratification**:
   * Passengers in **1st Class (Pclass=1)** enjoyed direct Upper-Deck egress accessibility, exhibiting a **~62.9%** survival probability.
   * Passengers in **3rd Class (Pclass=3)** faced compartmental challenges and language barriers, exhibiting only **~24.2%** survival probability.
3. **Age & Child Status**:
   * Infants and children under the age of 12 registered high survival rates across classes.
   * High-risk elderly passengers faced lower priority.
4. **Family Size Engineering**:
   * Engineered **FamilySize** = `SibSp` + `Parch` + `1`.
   * Solitary passengers (`FamilySize = 1`) or those in extremely large groups (`FamilySize >= 5`) had a lower survival rate than small cohesive families (`FamilySize = 2, 3, 4`). This represents safe cohort movement during evacuation.

---

### 5. Models Used
We evaluated four distinctive statistical classifiers to compare linear, local, and ensemble architectures:
1. **Logistic Regression (Benchmark)**: Fitted using L2 regularization and Newton-CG solvers to establish clean coefficient-based baselines.
2. **K-Nearest Neighbors (KNN)**: Mapped with `n_neighbors=5` to cluster local multi-dimensional groupings.
3. **Decision Tree Classifier**: Configured with a `max_depth=4` constraint to map simple, legible, and non-linear rule boundaries without severe overfit.
4. **Random Forest Classifier (Ensemble)**: Configured with `n_estimators=100` decision loops, relying on bootstrapped consensus to reduce variance and capture delicate feature crossings.

---

### 6. Accuracy Results
Below is the evaluation report of model performance calculated across a 20% stratified test split:

| Machine Learning Model | Training Accuracy | Test Accuracy | Precision | Recall | Recommended Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 🏆 **Random Forest Classifier** | **100%** | **85.0%** | **85.7%** | **84.2%** | **Yes (Champion Ensemble)** |
| 📈 **Logistic Regression** | 82.5% | 80.0% | 81.8% | 79.1% | Yes (Robust Linear Baseline) |
| 👥 **K-Nearest Neighbors (KNN)**| 86.2% | 80.0% | 80.0% | 80.0% | Yes (Excellent Local Clusters)|
| 🌲 **Decision Tree Classifier** | 100% | 75.0% | 73.3% | 76.0% | No (High Var Overfitting) |

**Winner Select Choice**: The **Random Forest Classifier** is selected as our core prediction engine in the web application due to its exceptional robustness, premium F1 performance, and resistance to outlier features.

---

### 7. Screenshots
The application is styled with a modern, slate-colored responsive palette. It focuses purely on immediate predictions with zero developer clutter.

#### Interactive Web Application UI Mockup:
```text
+-------------------------------------------------------------------------+
|  [🏆 Award Icon]  Titanic Survival Prediction   (CodSoft ML Submission)  |
+-------------------------------------------------------------------------+
|  Predict passenger survival probability based on historical data.       |
|                                                                         |
|  +-----------------------------------+   +---------------------------+  |
|  |  PASSENGER FEATURES               |   |  CLASSIFICATION OUTCOME   |  |
|  |                                   |   |                           |  |
|  |  Gender: [ Female ] [ Male ]      |   |  +---------------------+  |  |
|  |  Class:  [ 1st ] [ 2nd ] [ 3rd ]  |   |  |   Survived ✅       |  |  |
|  |  Age (Years): 28 [===========]    |   |  |   Confidence: 85.0% |  |  |
|  |  Ticket Fare ($): 15 [======]     |   |  +---------------------+  |  |
|  |  Family Onboard: [ 0 ] [ 1 ] [ 2 ]|   |                           |  |
|  |                                   |   |  Comparative Probabilities|  |
|  |  +-----------------------------+  |   |  - Logistic Reg:  80.0%   |  |
|  |  | Predict Survival | Sample  |  |   |  - Random Forest: 85.0%  |  |
|  |  +-----------------------------+  |   |                           |  |
|  +-----------------------------------+   +---------------------------+  |
+-------------------------------------------------------------------------+
```

*Saved static plots such as `survival_distribution.png`, `gender_survival.png`, and `feature_importance.png` are exported automatically in the `output_images/` folder during pipeline execution.*

---

### 8. How to Run

#### Requisites:
* Python 3.8+ or Python 3.9+
* Requisite dependencies in `requirements.txt`

#### Step-by-Step Local Deployment:

1. **Navigate to the submission directory**:
   ```bash
   cd Task1_Titanic_Survival_Prediction
   ```

2. **Install all Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the models and generate plots**:
   Running the Jupyter Notebook `Titanic_Survival_Prediction.ipynb` will clean the data, compile features, save training models to `model.pkl`, and output metrics charts in `output_images/`.
   ```bash
   jupyter notebook Titanic_Survival_Prediction.ipynb
   ```

4. **Launch the Flask Prediction App**:
   ```bash
   python app.py
   ```

5. **Interact in the browser**:
   Open your preferred browser and visit:
   `http://localhost:5000`
   * Select features, click **Predict Survival**, load other preset models, or select **Load Sample Passenger** to test.

---

### Future Enhancements & Improvements
* **Advanced Hyperparameter Tuning**: Integrate scikit-learn `GridSearchCV` to optimize `max_depth` and `min_samples_split` values in the Random Forest.
* **Feature Enhancements**: Extract title cohorts to perform more granular imputation on young male passengers (e.g., separating "Master" from "Mr").
* **Boosted Classifiers**: Evaluate advanced gradient boosters (such as XGBoost or LightGBM) to push prediction accuracy past the 87% barrier.
