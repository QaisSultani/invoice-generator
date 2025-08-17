"use client";

import { useState } from "react";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import { InvoiceData } from "@/types/invoice";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"form" | "preview">("form");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleFormSubmit = (data: InvoiceData) => {
    setInvoiceData(data);
    setCurrentStep("preview");
  };

  const handleBackToForm = () => {
    setCurrentStep("form");
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      {currentStep === "form" && (
        <InvoiceForm onSubmit={handleFormSubmit} />
      )}
      
      {currentStep === "preview" && invoiceData && (
        <InvoicePreview 
          invoiceData={invoiceData} 
          onBack={handleBackToForm}
        />
      )}
    </main>
  );
}