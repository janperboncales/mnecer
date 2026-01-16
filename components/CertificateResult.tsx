import React, { useState } from 'react';
import { CertificateData, RecommendationType } from '../types';
import { Download, Edit2, Plus, FileImage, FileText, Loader2, Check, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  data: CertificateData;
  onEdit: () => void;
  onNew: () => void;
}

const CertificateResult: React.FC<Props> = ({ data, onEdit, onNew }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFile = async (type: 'png' | 'pdf') => {
    setIsGenerating(true);
    try {
      // Ensure fonts are loaded before capturing
      await document.fonts.ready;
      
      // Wait a tiny bit for layout stability
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = document.getElementById('certificate-content');
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 3, 
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('certificate-content');
            if (el) {
                // Flatten text colors for high contrast export
                const allText = el.querySelectorAll('*');
                allText.forEach((node) => {
                   if (node instanceof HTMLElement) {
                      // Preserve the specific stamp colors if possible, or map them to their computed values
                      // To ensure sharpness, we force standard text to black
                      if (!node.closest('.stamp-container')) {
                          node.style.color = '#000000';
                      }
                   }
                });
            }
        }
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const filename = `Medical_Certificate_${data.patientName.replace(/\s+/g, '_')}`;

      if (type === 'png') {
        const link = document.createElement('a');
        link.href = image;
        link.download = `${filename}.png`;
        link.click();
      } else {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgProps = pdf.getImageProperties(image);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
      }
    } catch (error) {
      console.error("Error generating file:", error);
      alert("Failed to generate file. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isChecked = (type: RecommendationType) => data.recommendations.includes(type);
  
  const CheckBox = ({ checked }: { checked: boolean }) => (
    <div className="w-6 h-6 border-[2px] border-black mr-4 flex items-center justify-center shrink-0 bg-white">
       {checked && <Check size={20} strokeWidth={4} className="text-black" />}
    </div>
  );

  const sigStyle = data.signatureConfig || {
    rotation: -5,
    scale: 1,
    xOffset: 0,
    yOffset: 0,
    fontVariant: 1,
    inkColor: '#000000'
  };

  const signatureFontClass = sigStyle.fontVariant === 2 ? 'font-signature-2' : 'font-signature-1';

  const FieldRow = ({ label, value }: { label: string, value: string }) => (
    <div className="grid grid-cols-[140px_1fr] items-end w-full mb-2 gap-4">
      <div className="font-bold text-black pb-1 leading-none text-lg">{label}</div>
      <div className="border-b border-dotted border-gray-400 text-black font-medium px-2 pb-1 leading-none -mb-[1px] text-lg">
        {value}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[210mm] mx-auto animate-fade-in-up mb-12">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 no-print">
        <button 
          onClick={() => generateFile('png')}
          disabled={isGenerating}
          className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileImage size={18} />}
          <span>Save as Image</span>
        </button>
        <button 
          onClick={() => generateFile('pdf')}
          disabled={isGenerating}
          className="flex-1 bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
          <span>Save as PDF</span>
        </button>
        <button 
          onClick={handlePrint}
          disabled={isGenerating}
          className="flex-1 bg-gray-800 hover:bg-black text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <Printer size={18} />
          <span>Print A4</span>
        </button>
      </div>

      <div className="flex gap-3 mb-8 no-print">
        <button 
          onClick={onEdit}
          disabled={isGenerating}
          className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Edit2 size={16} /> Edit Details
        </button>
         <button 
          onClick={onNew}
          disabled={isGenerating}
          className="flex-1 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Plus size={16} /> Create New
        </button>
      </div>

      {/* Certificate Container Wrapper */}
      <div className="shadow-2xl print:shadow-none">
        {/* Certificate Document (A4 Size: 210mm x 297mm) */}
        <div id="certificate-content" className="bg-white p-12 md:p-16 text-black relative min-h-[297mm] w-full mx-auto overflow-hidden flex flex-col box-border">
          
          {/* Header */}
          <div className="text-center font-serif-custom mb-14">
             <h1 className="text-5xl font-bold tracking-wide text-[#002060]">Agraan Medical Clinic</h1>
             <p className="text-base mt-2 text-gray-800 font-sans tracking-wide">Blk 11 Lot 4, 1-K Fatima Rd, Dasmariñas, 4115 Cavite</p>
          </div>

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold uppercase underline underline-offset-8 tracking-widest text-black border-b-2 border-black inline-block pb-2">MEDICAL CERTIFICATE</h2>
          </div>

          {/* Content Body */}
          <div className="font-serif-custom leading-loose text-base flex-grow px-2">
            
            {/* Patient Info Block */}
            <div className="mb-10 space-y-3">
               <FieldRow label="Name :" value={data.patientName} />
               <FieldRow label="Age/Gender :" value={`${data.age} / ${data.gender}`} />
               <FieldRow label="Date :" value={new Date(data.date).toLocaleDateString('en-US', {month:'numeric', day:'numeric', year:'numeric'})} />
            </div>

            <p className="text-justify mb-10 indent-12 leading-9 text-lg text-black">
              This is to certify that <span className="font-bold">{data.patientName}</span>, <span className="font-bold">{data.age}</span> years old, {data.gender}, 
              residing at Dasmariñas, Cavite, was examined as an outpatient in Agraan Medical Clinic on <span className="font-bold">{new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span> with the following:
            </p>

            {/* Medical Findings */}
            <div className="mb-10 space-y-6">
                <div className="grid grid-cols-[140px_1fr] items-start w-full gap-4">
                  <div className="font-bold text-black pt-1 text-lg">Diagnosis :</div>
                  <div className="font-bold text-xl text-black pt-1">
                    {data.diagnosis}
                  </div>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start w-full gap-4">
                  <div className="font-bold text-black pt-1 text-lg">Prescription :</div>
                  <div className="whitespace-pre-wrap leading-relaxed text-black pt-1 text-lg">
                    {data.prescription || 'N/A'}
                  </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="mt-10 pt-6 border-t border-dotted border-gray-300">
               <div className="font-bold mb-6 underline text-xl text-black">Recommendation / Certification:</div>
               <div className="space-y-4 pl-4 text-lg">
                  <div className="flex items-center">
                     <CheckBox checked={isChecked('REST')} />
                     <div className="flex items-baseline">
                       <span className="mr-2 text-black">Rest for</span>
                       <span className="border-b border-black min-w-[50px] text-center font-bold px-1 text-black">
                         {isChecked('REST') ? data.remarks : ''}
                       </span>
                       <span className="ml-2 text-black">day/s.</span>
                     </div>
                  </div>
                  <div className="flex items-center text-black">
                     <CheckBox checked={isChecked('FIT_TO_WORK')} />
                     <span>Fit to Work</span>
                  </div>
                  <div className="flex items-center text-black">
                     <CheckBox checked={isChecked('FIT_TO_TRAVEL')} />
                     <span>Fit to Travel</span>
                  </div>
                   <div className="flex items-center text-black">
                     <CheckBox checked={isChecked('EXCUSED_HEAVY')} />
                     <span>Excused to Lift Heavy Weight</span>
                  </div>
               </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-16 text-xs text-gray-500 font-sans italic leading-normal">
               <p className="mb-1">
                 <span className="font-bold not-italic text-gray-700">Disclaimer:</span> 
                 This medical certificate is issued upon the request of <span className="font-bold not-italic text-black">{data.patientName}</span> for whatever purpose it may serve.
               </p>
               <p>This is not intended for Medico Legal purposes.</p>
            </div>

          </div>

          {/* Footer / Signature Stamp - High Contrast */}
          <div className="mt-10 mb-8 stamp-container">
             <div className="relative inline-block">
                {/* Stamp Container - Darker Blue Border */}
                <div className="border-[3px] border-blue-900 w-80 rotate-[-1deg] relative bg-transparent z-10">
                   {/* Top: Name - Darkest Blue */}
                   <div className="border-b-[3px] border-blue-900 py-2 px-2 text-center">
                      <p className="font-bold text-blue-950 uppercase text-xl leading-tight tracking-wide font-sans">{data.physicianName}</p>
                   </div>
                   {/* Bottom: License & PTR - Dark Blue */}
                   <div className="flex text-sm font-bold text-blue-900 font-sans">
                      <div className="w-1/2 border-r-[3px] border-blue-900 p-1.5 pl-3">
                         License # {data.licenseNo}
                      </div>
                      <div className="w-1/2 p-1.5 pl-3">
                         PTR # {data.ptrNo}
                      </div>
                   </div>
                </div>
                
                {/* Signature Overlay - High Contrast Ink */}
                <div 
                   className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                   style={{
                     transform: `translate(${sigStyle.xOffset}px, ${sigStyle.yOffset}px)`
                   }}
                >
                   <p 
                      className={`${signatureFontClass} text-8xl`}
                      style={{ 
                         transform: `rotate(${sigStyle.rotation}deg) scale(${sigStyle.scale})`,
                         color: sigStyle.inkColor, // Forced to dark/black in UserDataForm
                         opacity: 0.95,
                         textShadow: '0 0 1px rgba(0,0,0,0.1)'
                      }}
                   >
                      {data.physicianName.split(',')[0].split(' ').pop()}
                   </p>
                </div>
             </div>

             {/* Designation */}
             <div className="mt-3 text-sm font-sans font-bold text-gray-800">
               <p>General and Occupational Medicine</p>
             </div>
          </div>
          
           {/* Bottom Footer */}
           <div className="text-center text-[10px] text-gray-400 border-t mx-10 pt-3 font-sans tracking-wide">
              <p>Agraan Medical Clinic &bull; Dasmariñas, Cavite</p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default CertificateResult;
