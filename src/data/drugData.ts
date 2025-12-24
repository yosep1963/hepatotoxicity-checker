import type { Drug } from '../types';
import drugsDatabase from './drugs-database.json';
import { nephrotoxicityData } from './nephrotoxicityData';

interface DrugDatabase {
  version: string;
  last_updated: string;
  total_drugs: number;
  search_instructions: string;
  hepatotoxicity_grades: Record<string, { score: number; description: string; color: string }>;
  drugs: Drug[];
}

const database = drugsDatabase as DrugDatabase;

// 약물 데이터에 신독성 정보 병합
const drugsWithNephrotoxicity: Drug[] = database.drugs.map(drug => {
  const nephroData = nephrotoxicityData[drug.id];
  if (nephroData) {
    return {
      ...drug,
      nephrotoxicity: nephroData.nephrotoxicity,
      renal_dosing: nephroData.renal_dosing,
      renal_clinical_pearls: nephroData.renal_clinical_pearls,
    };
  }
  return drug;
});

export const defaultDrugs: Drug[] = drugsWithNephrotoxicity;
export const databaseVersion = database.version;
export const lastUpdated = database.last_updated;
export const hepatotoxicityGrades = database.hepatotoxicity_grades;
