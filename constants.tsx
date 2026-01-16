import { Disease, Service } from './types';
import { 
  Stethoscope, 
  FileText, 
  Activity, 
  Heart, 
  Home, 
  Syringe,
  Thermometer,
  CloudRain,
  User,
  Zap,
  Frown,
  MoveHorizontal,
  AlertCircle
} from 'lucide-react';
import React from 'react';

export const SERVICES: Service[] = [
  {
    id: 'consultation',
    title: 'Doctor Consultation',
    description: 'Chat with certified doctor',
    iconName: 'Stethoscope',
    color: 'bg-teal-500'
  },
  {
    id: 'certificate',
    title: 'Medical Certificate',
    description: 'Simply from home, ready within 15 minutes',
    iconName: 'FileText',
    color: 'bg-teal-500'
  },
  {
    id: 'healthcheck',
    title: 'Health Check',
    description: 'Check your health personally',
    iconName: 'Activity',
    color: 'bg-teal-500'
  },
  {
    id: 'homevisit',
    title: 'Home Visit Doctor',
    description: '24 hours doctor is available to visit your home',
    iconName: 'Heart',
    color: 'bg-teal-500'
  },
  {
    id: 'vitamin',
    title: 'Vitamin C Injection at Home',
    description: 'Get your immune booster safely from home',
    iconName: 'Home',
    color: 'bg-teal-500'
  },
  {
    id: 'vaccine',
    title: 'Request for Vaccination at Home',
    description: 'Get your vaccines safely, fast & easy from home',
    iconName: 'Syringe',
    color: 'bg-teal-500'
  }
];

export const SYMPTOMS: Disease[] = [
  { id: 'fever', name: 'Fever', iconName: 'Thermometer', color: 'bg-red-100 text-red-600' },
  { id: 'cold', name: 'Cold', iconName: 'CloudRain', color: 'bg-blue-100 text-blue-600' },
  { id: 'bladder', name: 'Bladder Infection', iconName: 'User', color: 'bg-orange-100 text-orange-600' },
  { id: 'vaccine_symptom', name: 'Post Vaccination', iconName: 'Syringe', color: 'bg-purple-100 text-purple-600' },
  { id: 'migraine', name: 'Migraine', iconName: 'Zap', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'period', name: 'Period Pain', iconName: 'Activity', color: 'bg-pink-100 text-pink-600' },
  { id: 'back_pain', name: 'Back Pain', iconName: 'Frown', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'stomach', name: 'Stomach Ache', iconName: 'MoveHorizontal', color: 'bg-green-100 text-green-600' },
  { id: 'stress', name: 'Stress', iconName: 'AlertCircle', color: 'bg-gray-100 text-gray-600' },
];

export const ICON_MAP: Record<string, React.FC<any>> = {
  Stethoscope, FileText, Activity, Heart, Home, Syringe,
  Thermometer, CloudRain, User, Zap, Frown, MoveHorizontal, AlertCircle
};
