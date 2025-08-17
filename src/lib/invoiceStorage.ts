// Local storage key for invoice counter
const INVOICE_COUNTER_KEY = 'invoice_counter';

export function getNextInvoiceNumber(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return 'INV-001';
  }
  
  try {
    // Get current counter from localStorage
    const currentCounter = localStorage.getItem(INVOICE_COUNTER_KEY);
    let nextNumber = 1;
    
    if (currentCounter) {
      nextNumber = parseInt(currentCounter, 10) + 1;
    }
    
    // Save the new counter back to localStorage
    localStorage.setItem(INVOICE_COUNTER_KEY, nextNumber.toString());
    
    // Format as INV-XXX (3 digits with leading zeros)
    return `INV-${nextNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    // Fallback if localStorage is not available
    return `INV-${Date.now().toString().slice(-3)}`;
  }
}

export function getCurrentInvoiceNumber(): string {
  if (typeof window === 'undefined') {
    return 'INV-001';
  }
  
  try {
    const currentCounter = localStorage.getItem(INVOICE_COUNTER_KEY);
    if (currentCounter) {
      const number = parseInt(currentCounter, 10);
      return `INV-${number.toString().padStart(3, '0')}`;
    }
    return 'INV-001';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'INV-001';
  }
}


export function updateInvoiceCounterFromNumber(invoiceNumber: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    // Extract number from invoice format (e.g., "INV-005" -> 5)
    const match = invoiceNumber.match(/(\d+)$/);
    if (match) {
      const number = parseInt(match[1], 10);
      if (!isNaN(number)) {
        // Update localStorage with this number
        localStorage.setItem(INVOICE_COUNTER_KEY, number.toString());
      }
    }
  } catch (error) {
    console.error('Error updating invoice counter from number:', error);
  }
}