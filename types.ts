export enum Screen {
  HOME = 'HOME',
  SYMPTOM_SELECTION = 'SYMPTOM_SELECTION',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  FORM = 'FORM',
  RESULT = 'RESULT',
}

export type RecommendationType = 'REST' | 'FIT_TO_WORK' | 'FIT_TO_TRAVEL' | 'EXCUSED_HEAVY';

export interface SignatureConfig {
  rotation: number;
  scale: number;
  xOffset: number;
  yOffset: number;
  fontVariant: 1 | 2;
  inkColor: string;
}

export interface CertificateData {
  patientName: string;
  age: string;
  gender: string;
  date: string;
  diagnosis: string;
  prescription: string;
  remarks: string;
  physicianName: string;
  licenseNo: string;
  ptrNo: string;
  recommendations: RecommendationType[];
  signatureConfig?: SignatureConfig;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export interface Disease {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

export enum QuestionType {
  YES_NO = 'YES_NO',
  DATE = 'DATE',
  CHOICE = 'CHOICE',
  TEXT = 'TEXT',
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface Answer {
  questionId: string;
  questionText: string;
  answer: string;
}

export interface UserData {
  fullName: string;
  dob: string;
}