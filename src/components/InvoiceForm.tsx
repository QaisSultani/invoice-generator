"use client";

import { useState, useEffect } from "react";
import { InvoiceData } from "@/types/invoice";
import { getNextInvoiceNumber, getCurrentInvoiceNumber, updateInvoiceCounterFromNumber } from "@/lib/invoiceStorage";
import { config } from "@/lib/config";
import { loadFormData, autoSaveFormData, clearFormData, hasFormData, getLastSavedDate } from "@/lib/formStorage";

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    contractorName: config.contractor.name,
    contractorAddress: config.contractor.address,
    contractorEmail: config.contractor.email,
    contractorPhone: config.contractor.phone,
    clientName: config.client.defaultName,
    clientCompany: config.client.defaultCompany,
    clientEmail: config.client.defaultEmail,
    serviceDescription: config.services,
    servicePeriod: "",
    serviceStartDate: "",
    serviceEndDate: "",
    amount: 0,
    currency: config.payment.defaultCurrency,
    bankDetails: config.payment.bankDetails,
    notes: "",
  });

  const [hasSavedData, setHasSavedData] = useState(false);
  const [lastSavedDate, setLastSavedDate] = useState<Date | null>(null);
  const [amountTouched, setAmountTouched] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    
    // If invoice number is being changed manually, update the counter
    if (name === 'invoiceNumber' && value) {
      updateInvoiceCounterFromNumber(value);
    }
    
    // Track when amount field is touched
    if (name === 'amount') {
      setAmountTouched(true);
    }
    
    const newFormData = {
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    };
    
    setFormData(newFormData);
    
    // Auto-save form data to localStorage (excluding dates and amount)
    const dataToSave = {
      contractorName: newFormData.contractorName,
      contractorAddress: newFormData.contractorAddress,
      contractorEmail: newFormData.contractorEmail,
      contractorPhone: newFormData.contractorPhone,
      clientName: newFormData.clientName,
      clientCompany: newFormData.clientCompany,
      clientEmail: newFormData.clientEmail,
      serviceDescription: newFormData.serviceDescription,
      currency: newFormData.currency,
      bankDetails: newFormData.bankDetails,
      notes: newFormData.notes,
    };
    autoSaveFormData(dataToSave);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const servicePeriod = startDate && endDate ? 
      `${start.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : 
      '';
    
    const newFormData = {
      ...formData,
      serviceStartDate: startDate,
      serviceEndDate: endDate,
      servicePeriod
    };
    
    setFormData(newFormData);
    
    // Note: Date fields are not saved to localStorage as per requirements
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount is not 0
    if (formData.amount <= 0) {
      alert('Invoice amount must be greater than 0');
      return;
    }
    
    // Generate new invoice number if current one is being used
    const finalFormData = {
      ...formData,
      invoiceNumber: formData.invoiceNumber || getNextInvoiceNumber()
    };
    
    onSubmit(finalFormData);
  };

  // Load saved data and set initial invoice number when component mounts
  useEffect(() => {
    const savedData = loadFormData();
    setHasSavedData(hasFormData());
    setLastSavedDate(getLastSavedDate());
    
    const currentInvoiceNumber = getCurrentInvoiceNumber();
    
    if (savedData) {
      // Load saved data but preserve dates, amount, and invoice number
      setFormData(prev => ({
        ...prev,
        // Load saved fields
        contractorName: savedData.contractorName,
        contractorAddress: savedData.contractorAddress,
        contractorEmail: savedData.contractorEmail,
        contractorPhone: savedData.contractorPhone,
        clientName: savedData.clientName,
        clientCompany: savedData.clientCompany,
        clientEmail: savedData.clientEmail,
        serviceDescription: savedData.serviceDescription,
        currency: savedData.currency,
        bankDetails: savedData.bankDetails,
        notes: savedData.notes,
        // Keep fresh values for these fields
        invoiceNumber: currentInvoiceNumber,
        // Keep default fresh dates and amount
      }));
    } else {
      // Just set the invoice number for new forms
      setFormData(prev => ({
        ...prev,
        invoiceNumber: currentInvoiceNumber
      }));
    }
  }, []);

  const handleClearSavedData = () => {
    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      clearFormData();
      setHasSavedData(false);
      setLastSavedDate(null);
      
      // Reset only the saved fields to defaults, keep current dates and amount
      setFormData(prev => ({
        ...prev,
        contractorName: config.contractor.name,
        contractorAddress: config.contractor.address,
        contractorEmail: config.contractor.email,
        contractorPhone: config.contractor.phone,
        clientName: config.client.defaultName,
        clientCompany: config.client.defaultCompany,
        clientEmail: config.client.defaultEmail,
        serviceDescription: config.services,
        currency: config.payment.defaultCurrency,
        bankDetails: config.payment.bankDetails,
        notes: "",
      }));
    }
  };

  const handleGenerateNewInvoiceNumber = () => {
    const newInvoiceNumber = getNextInvoiceNumber();
    setFormData(prev => ({
      ...prev,
      invoiceNumber: newInvoiceNumber
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Invoice Generator
      </h2>

      {/* Saved Data Notification */}
      {hasSavedData && lastSavedDate && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-blue-600">💾</div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Saved form data found
                </p>
                <p className="text-xs text-blue-600">
                  Last saved: {lastSavedDate.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearSavedData}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Invoice Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Invoice Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="INV-001"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
              <button
                type="button"
                onClick={handleGenerateNewInvoiceNumber}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
                title="Generate new invoice number"
              >
                🔄
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Auto-generated unique number. Manual edits update the counter. Click 🔄 for next number.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
        </div>

        {/* Contractor Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="contractorName"
              value={formData.contractorName}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Address
            </label>
            <textarea
              name="contractorAddress"
              value={formData.contractorAddress}
              onChange={handleChange}
              placeholder="Your Address City, State, ZIP, Country"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="contractorEmail"
              value={formData.contractorEmail}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="contractorPhone"
              value={formData.contractorPhone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Client Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Client Name
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Client Name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="clientCompany"
              value={formData.clientCompany}
              onChange={handleChange}
              placeholder="Client Company"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Client Email
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              placeholder="client@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
        </div>

        {/* Service Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Service Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Service Description
            </label>
            <textarea
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              placeholder="Services you provided"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Service Period
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="serviceStartDate"
                  value={formData.serviceStartDate}
                  onChange={(e) => handleDateChange(e.target.value, formData.serviceEndDate)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="serviceEndDate"
                  value={formData.serviceEndDate}
                  onChange={(e) => handleDateChange(formData.serviceStartDate, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
            </div>
            {formData.servicePeriod && (
              <p className="text-sm text-gray-700 mt-2">
                <strong>Period:</strong> {formData.servicePeriod}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                  amountTouched && formData.amount <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {amountTouched && formData.amount <= 0 && (
                <p className="text-red-600 text-xs mt-1">Amount must be greater than 0</p>
              )}
            </div>

            <div className="w-24">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Bank Details
            </label>
            <textarea
              name="bankDetails"
              value={formData.bankDetails}
              onChange={handleChange}
              rows={4}
              placeholder="Bank Name, Account Number, Routing Number, SWIFT/IBAN"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Aditional details"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Generate Invoice & Email Template
        </button>
      </div>
    </form>
  );
}
