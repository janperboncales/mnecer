import React from 'react';
import { SYMPTOMS, ICON_MAP } from '../constants';
import { Disease } from '../types';

interface Props {
  onSelect: (disease: Disease) => void;
  isLoading: boolean;
}

const SymptomSelection: React.FC<Props> = ({ onSelect, isLoading }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-center text-teal-500 font-semibold mb-2">Type of Disease</h2>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Choose Your Symptoms</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
           <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
           <p className="mt-4 text-gray-500 animate-pulse">Consulting AI for questionnaire...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {SYMPTOMS.map((symptom) => {
            const Icon = ICON_MAP[symptom.iconName];
            return (
              <button
                key={symptom.id}
                onClick={() => onSelect(symptom)}
                className="flex flex-col items-center gap-4 group"
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${symptom.color}`}>
                   {Icon && <Icon size={40} strokeWidth={1.5} />}
                </div>
                <span className="text-gray-700 font-medium group-hover:text-teal-600">
                  {symptom.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SymptomSelection;
