// Configuration service for handling environment variables and default values

export const config = {
  contractor: {
    name: process.env.NEXT_PUBLIC_CONTRACTOR_NAME || "",
    address: process.env.NEXT_PUBLIC_CONTRACTOR_ADDRESS || "",
    email: process.env.NEXT_PUBLIC_CONTRACTOR_EMAIL || "",
    phone: process.env.NEXT_PUBLIC_CONTRACTOR_PHONE || "",
  },
  
  client: {
    defaultName: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_NAME || "",
    defaultCompany: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_COMPANY || "",
    defaultEmail: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_EMAIL || ""
  },
  
  payment: {
    bankDetails: process.env.NEXT_PUBLIC_BANK_DETAILS || "",
    defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD",
  },
  
  email: {
    recipients: process.env.NEXT_PUBLIC_EMAIL_RECIPIENTS?.split(',').map(email => email.trim()).filter(email => email) || [],
  },
  
  invoice: {
    prefix: process.env.NEXT_PUBLIC_INVOICE_PREFIX || "INV",
  },

  services: process.env.NEXT_PUBLIC_SERVICES_DETAILS || "",
};

// Helper function to get formatted bank details
export const getBankDetails = (): string => {
  return config.payment.bankDetails;
};

// Helper function to get email recipients with fallback logic
export const getEmailRecipients = (clientEmailFromForm?: string): string[] => {
  if (config.email.recipients.length > 0) {
    return config.email.recipients;
  } else if (config.client.defaultEmail) {
    return [config.client.defaultEmail];
  } else if (clientEmailFromForm?.trim()) {
    return [clientEmailFromForm.trim()];
  }
  return ['client@example.com'];
};

// Helper function to check if configuration is properly set up
export const isConfigurationComplete = (): boolean => {
  return config.contractor.name !== "Your Name" && 
         config.contractor.email !== "your.email@example.com";
};