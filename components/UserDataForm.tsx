import React, { useState, useEffect } from 'react';
import { CertificateData, RecommendationType, SignatureConfig } from '../types';
import { Calendar, User, FileText, Activity, Stethoscope, CheckSquare } from 'lucide-react';

interface Props {
  initialData: CertificateData | null;
  onSubmit: (data: CertificateData) => void;
}

const UserDataForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<CertificateData>({
    patientName: '',
    age: '',
    gender: 'Male',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    prescription: '',
    remarks: '2',
    physicianName: 'Sheryll Perez, MD',
    licenseNo: '0674256',
    ptrNo: '2233445',
    recommendations: ['REST']
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateSignatureConfig = (): SignatureConfig => {
    // Generate random values to make signature look natural and different every time
    const rotation = -15 + Math.random() * 20; // -15 to +5 degrees
    const scale = 0.8 + Math.random() * 0.25;   // 0.8 to 1.05 scale
    const xOffset = -5 + Math.random() * 10;  // -5px to +5px x-shift
    const yOffset = -2 + Math.random() * 6;   // -2px to +4px y-shift
    const fontVariant = Math.random() > 0.5 ? 1 : 2; // Switch between two fonts
    
    // High Contrast Colors: Strictly Black or Very Dark Blue
    const colors = ['#000000', '#020617', '#0f172a'];
    const inkColor = colors[Math.floor(Math.random() * colors.length)];

    return { rotation, scale, xOffset, yOffset, fontVariant, inkColor };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Inject a new random signature config on submit
    const finalData = {
      ...form,
      signatureConfig: generateSignatureConfig()
    };
    onSubmit(finalData);
  };

  const toggleRecommendation = (type: RecommendationType) => {
    setForm(prev => {
      const current = prev.recommendations;
      if (current.includes(type)) {
        return { ...prev, recommendations: current.filter(t => t !== type) };
      } else {
        return { ...prev, recommendations: [...current, type] };
      }
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-900 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText />
            Certificate Details
          </h1>
          <p className="opacity-90 mt-1">Fill in the patient and medical details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Patient Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <User size={18} className="text-blue-900" />
              Patient Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Patient Name</label>
                <input
                  required
                  name="patientName"
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={form.patientName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Age</label>
                  <input
                    required
                    name="age"
                    type="number"
                    placeholder="25"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Consultation Date</label>
              <div className="relative">
                <input
                  required
                  name="date"
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.date}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Medical Info Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Activity size={18} className="text-blue-900" />
              Medical Details
            </h3>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Diagnosis</label>
              <input
                required
                name="diagnosis"
                type="text"
                placeholder="e.g. Acute Upper Respiratory Infection"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.diagnosis}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Prescription</label>
              <textarea
                name="prescription"
                rows={2}
                placeholder="e.g. N/A"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.prescription}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Recommendation (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'REST', label: 'Recommended Rest' },
                  { id: 'FIT_TO_WORK', label: 'Fit to Work' },
                  { id: 'FIT_TO_TRAVEL', label: 'Fit to Travel' },
                  { id: 'EXCUSED_HEAVY', label: 'Excused to Lift Heavy Weight' },
                ].map((type) => {
                   const isSelected = form.recommendations.includes(type.id as RecommendationType);
                   return (
                     <div 
                        key={type.id}
                        onClick={() => toggleRecommendation(type.id as RecommendationType)}
                        className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all select-none ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-400'}`}
                     >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`}>
                           {isSelected && <CheckSquare size={14} className="text-white" />}
                        </div>
                        <span className="font-medium text-sm">{type.label}</span>
                     </div>
                   );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Rest Duration (Days) / Remarks</label>
              <textarea
                name="remarks"
                rows={2}
                placeholder="e.g. 2"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.remarks}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">Note: Enter the number of days for rest, or specific remarks.</p>
            </div>
          </div>

           {/* Physician Info Section */}
           <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Stethoscope size={18} className="text-blue-900" />
              Physician Information
            </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Physician Name</label>
                  <input
                    required
                    name="physicianName"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.physicianName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">License No.</label>
                    <input
                      required
                      name="licenseNo"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={form.licenseNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">PTR No.</label>
                    <input
                      required
                      name="ptrNo"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={form.ptrNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
             </div>
           </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] flex justify-center items-center gap-2"
            >
              Generate Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDataForm;