export interface Passenger {
  PassengerId: number;
  Survived: number;
  Pclass: number;
  Name: string;
  Sex: 'male' | 'female';
  Age: number | null;
  SibSp: number;
  Parch: number;
  Ticket: string;
  Fare: number;
  Cabin?: string;
  Embarked: 'S' | 'C' | 'Q' | '';
}

export type ActiveTab = 'eda' | 'notebook' | 'predictor' | 'readme';
