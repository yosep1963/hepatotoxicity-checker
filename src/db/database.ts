import Dexie, { type EntityTable } from 'dexie';
import type { Drug, SpecialAlert } from '../types';
import { defaultDrugs } from '../data/drugData';
import { defaultAlerts } from '../data/defaultAlerts';

// 데이터베이스 스키마
export class HepaToxDatabase extends Dexie {
  drugs!: EntityTable<Drug, 'id'>;
  alerts!: EntityTable<SpecialAlert, 'id'>;
  settings!: EntityTable<{ key: string; value: string }, 'key'>;

  constructor() {
    super('HepaToxDB');

    this.version(2).stores({
      drugs: 'id, name_en, name_kr, drug_class, hepatotoxicity.grade, nephrotoxicity.grade',
      alerts: 'id, alert_level, alert_category',
      settings: 'key'
    });
  }
}

// 데이터베이스 인스턴스
export const db = new HepaToxDatabase();

// 초기 데이터 시딩
export async function seedDatabase(): Promise<void> {
  const drugCount = await db.drugs.count();
  const alertCount = await db.alerts.count();

  if (drugCount === 0) {
    console.log('Seeding drugs...');
    await db.drugs.bulkAdd(defaultDrugs);
    console.log(`Added ${defaultDrugs.length} drugs`);
  }

  if (alertCount === 0) {
    console.log('Seeding alerts...');
    await db.alerts.bulkAdd(defaultAlerts);
    console.log(`Added ${defaultAlerts.length} alerts`);
  }
}

// 데이터베이스 초기화 (기본값으로 리셋)
export async function resetDatabase(): Promise<void> {
  await db.drugs.clear();
  await db.alerts.clear();
  await seedDatabase();
}

// 약물 검색
export async function searchDrugs(query: string): Promise<Drug[]> {
  if (!query.trim()) {
    return db.drugs.toArray();
  }

  const lowerQuery = query.toLowerCase();
  const drugs = await db.drugs.toArray();

  return drugs.filter(drug =>
    drug.name_en.toLowerCase().includes(lowerQuery) ||
    drug.name_kr.includes(query) ||
    drug.brand_names_kr.some(brand => brand.includes(query)) ||
    drug.brand_names_en?.some(brand => brand.toLowerCase().includes(lowerQuery)) ||
    drug.drug_class.toLowerCase().includes(lowerQuery)
  );
}

// 약물 CRUD
export async function getDrug(id: string): Promise<Drug | undefined> {
  return db.drugs.get(id);
}

export async function getAllDrugs(): Promise<Drug[]> {
  return db.drugs.toArray();
}

export async function addDrug(drug: Drug): Promise<string> {
  return db.drugs.add(drug);
}

export async function updateDrug(id: string, updates: Partial<Drug>): Promise<number> {
  return db.drugs.update(id, updates);
}

export async function deleteDrug(id: string): Promise<void> {
  return db.drugs.delete(id);
}

// 경고 CRUD
export async function getAlert(id: string): Promise<SpecialAlert | undefined> {
  return db.alerts.get(id);
}

export async function getAllAlerts(): Promise<SpecialAlert[]> {
  return db.alerts.toArray();
}

export async function addAlert(alert: SpecialAlert): Promise<string> {
  return db.alerts.add(alert);
}

export async function updateAlert(id: string, updates: Partial<SpecialAlert>): Promise<number> {
  return db.alerts.update(id, updates);
}

export async function deleteAlert(id: string): Promise<void> {
  return db.alerts.delete(id);
}

// 설정
export async function getSetting(key: string): Promise<string | undefined> {
  const setting = await db.settings.get(key);
  return setting?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value });
}

// 데이터 내보내기/가져오기
export async function exportData(): Promise<{ drugs: Drug[]; alerts: SpecialAlert[] }> {
  const drugs = await db.drugs.toArray();
  const alerts = await db.alerts.toArray();
  return { drugs, alerts };
}

export async function importData(data: { drugs?: Drug[]; alerts?: SpecialAlert[] }): Promise<void> {
  if (data.drugs && data.drugs.length > 0) {
    await db.drugs.clear();
    await db.drugs.bulkAdd(data.drugs);
  }
  if (data.alerts && data.alerts.length > 0) {
    await db.alerts.clear();
    await db.alerts.bulkAdd(data.alerts);
  }
}
