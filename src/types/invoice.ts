export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  // Contractor Information
  contractorName: string;
  contractorAddress: string;
  contractorEmail: string;
  contractorPhone: string;
  
  // Client Information
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  
  // Service Information
  serviceDescription: string;
  servicePeriod: string;
  serviceStartDate: string;
  serviceEndDate: string;
  amount: number;
  currency: string;
  
  // Payment Information
  bankDetails: string;
  
  // Additional Notes
  notes?: string;
}