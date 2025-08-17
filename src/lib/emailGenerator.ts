import { InvoiceData } from '@/types/invoice';
import { getEmailRecipients } from '@/lib/config';

export interface EmailTemplate {
  recipients: string[];
  subject: string;
  body: string;
}

export function generateEmailTemplate(invoiceData: InvoiceData): EmailTemplate {
  const formattedAmount = `$${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`;
  const formattedDueDate = new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const recipients = getEmailRecipients(invoiceData.clientEmail);
  
  const subject = `Invoice ${invoiceData.invoiceNumber} - ${formattedAmount} - Due ${formattedDueDate}`;
  
  const body = `Dear ${invoiceData.clientName},

I hope this email finds you well. Please find attached invoice ${invoiceData.invoiceNumber} for web development services provided to ${invoiceData.clientCompany} during ${invoiceData.servicePeriod}.

INVOICE DETAILS:
Invoice Number: ${invoiceData.invoiceNumber}
Amount: ${formattedAmount}
Service Period: ${invoiceData.servicePeriod}
Due Date: ${formattedDueDate}

SERVICE DESCRIPTION:
${invoiceData.serviceDescription}

PAYMENT INFORMATION:
${invoiceData.bankDetails}

${invoiceData.notes ? `NOTES:\n${invoiceData.notes}\n\n` : ''}Please process the payment by ${formattedDueDate}. If you have any questions regarding this invoice, please don't hesitate to contact me.

Thank you for your business.

Best regards,
${invoiceData.contractorName}
${invoiceData.contractorEmail}
${invoiceData.contractorPhone}

---
Please retain this email for your records.`;

  return {
    recipients,
    subject,
    body
  };
}

// Legacy function for backward compatibility
export function generateEmailTemplateString(invoiceData: InvoiceData): string {
  const template = generateEmailTemplate(invoiceData);
  return `Subject: ${template.subject}\n\n${template.body}`;
}

// Re-export the helper function for backward compatibility
export { getEmailRecipients } from '@/lib/config';