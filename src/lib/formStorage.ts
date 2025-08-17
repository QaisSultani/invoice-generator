// Local storage service for form data persistence

const FORM_DATA_KEY = 'invoice_form_data';

export interface SavedFormData {
  contractorName: string;
  contractorAddress: string;
  contractorEmail: string;
  contractorPhone: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  serviceDescription: string;
  currency: string;
  bankDetails: string;
  notes: string;
  lastSaved: string;
}

export function saveFormData(formData: Partial<SavedFormData>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const dataToSave: SavedFormData = {
      ...formData,
      lastSaved: new Date().toISOString(),
    } as SavedFormData;
    
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

export function loadFormData(): SavedFormData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading form data:', error);
  }
  
  return null;
}

export function clearFormData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(FORM_DATA_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
}

export function hasFormData(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(FORM_DATA_KEY) !== null;
  } catch (error) {
    return false;
  }
}

export function getLastSavedDate(): Date | null {
  const data = loadFormData();
  if (data?.lastSaved) {
    return new Date(data.lastSaved);
  }
  return null;
}

// Auto-save functionality with debouncing
let saveTimeout: NodeJS.Timeout;

export function autoSaveFormData(formData: Partial<SavedFormData>, delay: number = 1000): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    saveFormData(formData);
  }, delay);
}