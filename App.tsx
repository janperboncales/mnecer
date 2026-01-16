import React, { useState } from 'react';
import { Screen, CertificateData, Service, Disease, Question, Answer } from './types';
import { generateQuestionsForSymptom, generateCertificateText } from './services/geminiService';

// Components
import ServiceSelection from './components/ServiceSelection';
import SymptomSelection from './components/SymptomSelection';
import Questionnaire from './components/Questionnaire';
import UserDataForm from './components/UserDataForm';
import CertificateResult from './components/CertificateResult';
import { Plus, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [isLoading, setIsLoading] = useState(false);
  
  // Flow State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  
  // Certificate Data
  const [data, setData] = useState<CertificateData | null>(null);

  // --- Handlers ---

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // For now, we assume all services lead to the symptom checker for the demo
    setCurrentScreen(Screen.SYMPTOM_SELECTION);
  };

  const handleSymptomSelect = async (disease: Disease) => {
    setSelectedDisease(disease);
    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuestionsForSymptom(disease.name);
      setQuestions(generatedQuestions);
      setCurrentScreen(Screen.QUESTIONNAIRE);
    } catch (error) {
      console.error("Failed to generate questions", error);
      alert("Something went wrong connecting to the AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionnaireComplete = async (collectedAnswers: Answer[]) => {
    setAnswers(collectedAnswers);
    setIsLoading(true);
    
    // We create a temporary user object for the prompt, though we don't have the real name yet.
    // The form will allow the user to input their actual name.
    try {
      const generatedText = await generateCertificateText(
        { fullName: '[Patient Name]', dob: '[Date]' }, 
        selectedDisease?.name || 'Condition', 
        collectedAnswers
      );

      // Pre-fill the form data with AI results
      setData({
        patientName: '',
        age: '',
        gender: 'Male',
        date: new Date().toISOString().split('T')[0],
        diagnosis: selectedDisease?.name || '',
        prescription: 'N/A', // AI could technically generate this too
        remarks: '1-2', // Default recommendation usually
        physicianName: 'Sheryll Perez, MD',
        licenseNo: '0674256',
        ptrNo: '2233445',
        recommendations: ['REST'],
        // We will inject the generated text as a "Prescription" or "Diagnosis" detail if needed, 
        // but for now we map Diagnosis to the disease name and Prescription to N/A.
        // If you wanted the generated text to appear in remarks or description, you could map it here.
      });

      setCurrentScreen(Screen.FORM);
    } catch (error) {
       console.error("Error generating text", error);
       setCurrentScreen(Screen.FORM);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (formData: CertificateData) => {
    setData(formData);
    setCurrentScreen(Screen.RESULT);
  };

  const handleEdit = () => {
    setCurrentScreen(Screen.FORM);
  };

  const handleNew = () => {
    setData(null);
    setSelectedService(null);
    setSelectedDisease(null);
    setQuestions([]);
    setAnswers([]);
    setCurrentScreen(Screen.HOME);
  };

  const handleBack = () => {
    switch (currentScreen) {
      case Screen.SYMPTOM_SELECTION:
        setCurrentScreen(Screen.HOME);
        break;
      case Screen.QUESTIONNAIRE:
        setCurrentScreen(Screen.SYMPTOM_SELECTION);
        break;
      case Screen.FORM:
        setCurrentScreen(Screen.QUESTIONNAIRE);
        break;
      case Screen.RESULT:
        setCurrentScreen(Screen.FORM);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleNew}>
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-md">
               <Plus size={20} strokeWidth={3} />
             </div>
             <span className="text-xl font-bold text-slate-800 tracking-tight">Agraan Medical</span>
          </div>
          {currentScreen !== Screen.HOME && (
            <button onClick={handleBack} className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
               <ArrowLeft size={16} /> Back
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 w-full">
        <div className="animate-fade-in">
          
          {currentScreen === Screen.HOME && (
            <ServiceSelection onSelect={handleServiceSelect} />
          )}

          {currentScreen === Screen.SYMPTOM_SELECTION && (
            <SymptomSelection 
              onSelect={handleSymptomSelect} 
              isLoading={isLoading} 
            />
          )}

          {currentScreen === Screen.QUESTIONNAIRE && selectedDisease && (
            <Questionnaire 
              disease={selectedDisease} 
              questions={questions} 
              onComplete={handleQuestionnaireComplete}
              onBack={handleBack}
            />
          )}

          {currentScreen === Screen.FORM && (
            <UserDataForm 
              initialData={data}
              onSubmit={handleFormSubmit} 
            />
          )}

          {currentScreen === Screen.RESULT && data && (
            <CertificateResult 
              data={data}
              onEdit={handleEdit}
              onNew={handleNew}
            />
          )}
          
        </div>
      </main>
    </div>
  );
};

export default App;