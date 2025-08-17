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
    <>
      {/* SEO-friendly header with h1 for homepage */}
      <header className="sr-only">
        <h1>Professional Invoice Generator - Create PDF Invoices Online Free</h1>
        <p>Generate professional invoices instantly with automatic numbering, email templates, and beautiful designs. Perfect for freelancers and small businesses.</p>
      </header>
      
      <main className="min-h-screen bg-gray-100 py-8" role="main">
        {currentStep === "form" && (
          <section aria-label="Invoice Creation Form">
            <InvoiceForm onSubmit={handleFormSubmit} />
          </section>
        )}
        
        {currentStep === "preview" && invoiceData && (
          <section aria-label="Invoice Preview and Download">
            <InvoicePreview 
              invoiceData={invoiceData} 
              onBack={handleBackToForm}
            />
          </section>
        )}
      </main>
    </>
  );
}