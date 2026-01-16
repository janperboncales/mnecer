import React from 'react';
import { SERVICES, ICON_MAP } from '../constants';
import { Service } from '../types';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center text-teal-800 mb-6">Choose a Service</h1>
      {SERVICES.map((service) => {
        const Icon = ICON_MAP[service.iconName];
        return (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group border border-transparent hover:border-teal-500"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${service.color} text-white`}>
                {Icon && <Icon size={24} />}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            </div>
            <ArrowRight className="text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        );
      })}
    </div>
  );
};

export default ServiceSelection;
