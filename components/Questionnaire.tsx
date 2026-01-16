import React, { useState } from 'react';
import { Question, QuestionType, Answer, Disease } from '../types';

interface Props {
  disease: Disease;
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
  onBack: () => void;
}

const Questionnaire: React.FC<Props> = ({ disease, questions, onComplete, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(0);

  const QUESTIONS_PER_PAGE = 3;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  
  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE, 
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const handleAnswerChange = (qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      // Format answers for parent
      const formattedAnswers: Answer[] = questions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        answer: answers[q.id] || 'Not answered'
      }));
      onComplete(formattedAnswers);
    }
  };

  const isPageComplete = currentQuestions.every(q => answers[q.id] && answers[q.id].trim() !== '');

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{disease.name}</h1>
        <div className="flex items-center text-sm text-gray-500">
           <button onClick={onBack} className="hover:text-teal-600 underline">Home</button>
           <span className="mx-2">/</span>
           <span>Assessment</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-8">
          {currentQuestions.map((q) => (
            <div key={q.id} className="animate-fade-in">
              <h3 className="text-lg font-medium text-gray-800 mb-3">{q.text}</h3>
              
              {q.type === QuestionType.YES_NO && (
                <div className="flex gap-4">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? 'border-teal-500' : 'border-gray-300'}`}>
                         {answers[q.id] === opt && <div className="w-3 h-3 bg-teal-500 rounded-full" />}
                      </div>
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt} 
                        className="hidden" 
                        onChange={() => handleAnswerChange(q.id, opt)}
                        checked={answers[q.id] === opt}
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === QuestionType.TEXT && (
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  rows={3}
                  placeholder="Type your answer here..."
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}

              {q.type === QuestionType.DATE && (
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}

              {q.type === QuestionType.CHOICE && q.options && (
                 <div className="flex flex-col gap-2">
                    {q.options.map(opt => (
                       <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? 'border-teal-500' : 'border-gray-300'}`}>
                           {answers[q.id] === opt && <div className="w-3 h-3 bg-teal-500 rounded-full" />}
                        </div>
                        <input 
                          type="radio" 
                          name={q.id} 
                          value={opt} 
                          className="hidden" 
                          onChange={() => handleAnswerChange(q.id, opt)}
                          checked={answers[q.id] === opt}
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    ))}
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
             <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'w-8 bg-teal-500' : 'w-2 bg-gray-300'}`} />
          ))}
        </div>

        <button 
          onClick={handleNext}
          disabled={!isPageComplete}
          className={`px-8 py-3 rounded-full font-semibold text-white transition-all transform active:scale-95 ${
            isPageComplete ? 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-orange-200' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {currentPage === totalPages - 1 ? 'Finish Assessment' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
