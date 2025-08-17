"use client";

import { InvoiceData } from "@/types/invoice";
import { generateEmailTemplate, EmailTemplate } from "@/lib/emailGenerator";
import { useState } from "react";
import { getNextInvoiceNumber } from "@/lib/invoiceStorage";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  onBack: () => void;
}

export default function InvoicePreview({ invoiceData, onBack }: InvoicePreviewProps) {
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [customRecipients, setCustomRecipients] = useState<string[]>([]);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceData.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      getNextInvoiceNumber();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleGenerateEmail = () => {
    const defaultTemplate = generateEmailTemplate(invoiceData);
    
    // Always start with fresh defaults for new invoice
    setCustomRecipients(defaultTemplate.recipients);
    setCustomSubject(defaultTemplate.subject);
    setCustomBody(defaultTemplate.body);
    
    setEmailTemplate(defaultTemplate);
    setShowEmail(true);
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  const handleSaveEmail = () => {
    if (emailTemplate) {
      const updatedTemplate = {
        ...emailTemplate,
        recipients: customRecipients,
        subject: customSubject,
        body: customBody
      };
      setEmailTemplate(updatedTemplate);
    }
    setIsEditingEmail(false);
  };

  const handleCancelEdit = () => {
    // Reset to current template values
    if (emailTemplate) {
      setCustomRecipients(emailTemplate.recipients);
      setCustomSubject(emailTemplate.subject);
      setCustomBody(emailTemplate.body);
    }
    setIsEditingEmail(false);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const handleAddRecipient = () => {
    setCustomRecipients([...customRecipients, ""]);
  };

  const handleRemoveRecipient = (index: number) => {
    setCustomRecipients(customRecipients.filter((_, i) => i !== index));
  };

  const handleRecipientChange = (index: number, value: string) => {
    const updatedRecipients = [...customRecipients];
    updatedRecipients[index] = value;
    setCustomRecipients(updatedRecipients);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            ← Back to Form
          </button>
          <div className="text-sm text-gray-500">
            Preview Mode
          </div>
        </div>

        {/* Beautiful Invoice Design */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Section with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative px-8 py-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold tracking-wide mb-2">INVOICE</h1>
                  <div className="h-1 w-20 bg-white rounded-full"></div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="text-2xl font-bold">${invoiceData.amount.toFixed(2)}</div>
                    <div className="text-sm opacity-90">{invoiceData.currency}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details Cards */}
          <div className="p-8 space-y-8">
            {/* Top Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invoice Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">Invoice Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="font-semibold text-gray-900">{invoiceData.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Date:</span>
                    <span className="font-semibold text-gray-900">{new Date(invoiceData.invoiceDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold text-red-600">{new Date(invoiceData.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Service Period Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Service Period</h3>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-800 bg-green-100 rounded-lg py-3 px-4">
                    {invoiceData.servicePeriod}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* From Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">From</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-gray-900">{invoiceData.contractorName}</div>
                    <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {invoiceData.contractorAddress}
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-blue-500">📧</span>
                        <span className="font-medium">{invoiceData.contractorEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-blue-500">📱</span>
                        <span className="font-medium">{invoiceData.contractorPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* To Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🏢</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Bill To</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500">
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-gray-900">{invoiceData.clientName}</div>
                    <div className="text-gray-700 font-medium">{invoiceData.clientCompany}</div>
                    {invoiceData.clientEmail && (
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-green-500">📧</span>
                          <span className="font-medium">{invoiceData.clientEmail}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Service Description</h3>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <p className="text-gray-800 leading-relaxed text-lg">{invoiceData.serviceDescription}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Payment Information</h3>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-800 leading-relaxed shadow-inner">
                  {invoiceData.bankDetails.split('\n').map((line, index) => (
                    <div key={index} className={line.trim() ? '' : 'h-2'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {invoiceData.notes && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Additional Notes</h3>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <p className="text-gray-800 leading-relaxed">{invoiceData.notes}</p>
                </div>
              </div>
            )}

            {/* Total Amount Highlight */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg opacity-90">Total Amount Due</div>
                  <div className="text-sm opacity-75">Payment due by {new Date(invoiceData.dueDate).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${invoiceData.amount.toFixed(2)}</div>
                  <div className="text-lg opacity-90">{invoiceData.currency}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="text-center text-gray-500 text-sm">
              <p>Thank you for your business! 🙏</p>
              <p className="mt-1">This invoice was generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">{pdfLoading ? "⏳" : "📄"}</span>
            {pdfLoading ? "Generating PDF..." : "Download PDF Invoice"}
          </button>
          
          <button
            onClick={handleGenerateEmail}
            className="flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">✉️</span>
            Generate Email Template
          </button>
        </div>


        {/* Email Template */}
        {showEmail && emailTemplate && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">📧 Email Template - Ready for Gmail</h3>
                  <p className="text-sm text-gray-200 mt-1">
                    {isEditingEmail ? 'Make last-minute changes to your email' : 'Copy each section separately for easy pasting into Gmail'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isEditingEmail ? (
                    <button
                      onClick={handleEditEmail}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium text-sm"
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEmail}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium text-sm"
                      >
                        ✓ Apply Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">

              {/* Recipients Section */}
              <div className="bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center p-4 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">👥</span>
                    <span className="font-semibold text-blue-800">Recipients (To:)</span>
                  </div>
                  {!isEditingEmail && (
                    <button
                      onClick={() => copyToClipboard(emailTemplate.recipients.join(', '), 'Recipients')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition duration-200"
                    >
                      📋 Copy
                    </button>
                  )}
                </div>
                <div className="p-4">
                  {isEditingEmail ? (
                    <div className="space-y-2">
                      {customRecipients.map((recipient, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="email"
                            value={recipient}
                            onChange={(e) => handleRecipientChange(index, e.target.value)}
                            className="flex-1 p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                            placeholder="email@example.com"
                          />
                          {customRecipients.length > 1 && (
                            <button
                              onClick={() => handleRemoveRecipient(index)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-xs transition duration-200"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={handleAddRecipient}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium transition duration-200"
                      >
                        ➕ Add Recipient
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-900 font-mono bg-white p-3 rounded border">
                      {emailTemplate.recipients.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject Section */}
              <div className="bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center p-4 border-b border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📄</span>
                    <span className="font-semibold text-green-800">Subject Line</span>
                  </div>
                  {!isEditingEmail && (
                    <button
                      onClick={() => copyToClipboard(emailTemplate.subject, 'Subject')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition duration-200"
                    >
                      📋 Copy
                    </button>
                  )}
                </div>
                <div className="p-4">
                  {isEditingEmail ? (
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                      placeholder="Enter custom subject line..."
                    />
                  ) : (
                    <p className="text-sm text-green-900 font-mono bg-white p-3 rounded border">
                      {emailTemplate.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Body Section */}
              <div className="bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center p-4 border-b border-purple-200">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">📝</span>
                    <span className="font-semibold text-purple-800">Email Body</span>
                  </div>
                  {!isEditingEmail && (
                    <button
                      onClick={() => copyToClipboard(emailTemplate.body, 'Email Body')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-medium transition duration-200"
                    >
                      📋 Copy
                    </button>
                  )}
                </div>
                <div className="p-4">
                  {isEditingEmail ? (
                    <textarea
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      rows={12}
                      className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono leading-relaxed resize-vertical text-gray-900"
                      placeholder="Enter custom email body..."
                    />
                  ) : (
                    <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-purple-900 font-mono leading-relaxed">
                        {emailTemplate.body}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              {!isEditingEmail && (
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600 text-lg">💡</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">How to use in Gmail:</h4>
                      <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                        <li>Copy recipients and paste in Gmail's "To" field</li>
                        <li>Copy subject and paste in Gmail's "Subject" field</li>
                        <li>Copy email body and paste in Gmail's message area</li>
                        <li>Attach the downloaded PDF invoice</li>
                        <li>Send the email!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Editing Instructions */}
              {isEditingEmail && (
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-lg">✏️</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Customizing your email:</h4>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>Add or remove email recipients by clicking "➕ Add Recipient" or "✕"</li>
                        <li>Edit the subject line to match your preferred style</li>
                        <li>Modify the email body to add personal touches or additional information</li>
                        <li>Use placeholders like {invoiceData.clientName}, {invoiceData.invoiceNumber}, etc.</li>
                        <li>Click "✓ Apply Changes" to save your edits or "Cancel" to discard them</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}