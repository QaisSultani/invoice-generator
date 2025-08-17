import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { InvoiceData } from '@/types/invoice';

export async function POST(request: NextRequest) {
  try {
    const invoiceData: InvoiceData = await request.json();
    
    // Generate HTML content for the invoice
    const htmlContent = generateInvoiceHTML(invoiceData);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for fonts/styles to load
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0' 
    });
    
    // Get the full content height to determine page size
    const contentHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });
    
    // Generate PDF with dynamic height to fit content on one page
    const pdfBuffer = await page.pdf({
      width: '210mm', // A4 width
      height: `${Math.max(297, Math.ceil(contentHeight * 0.264583))}mm`, // A4 height or content height, whichever is larger
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    });
    
    await browser.close();
    
    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceData.invoiceNumber}.pdf"`
      }
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generateInvoiceHTML(invoiceData: InvoiceData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${invoiceData.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .invoice-container {
          width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .header h1 {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        
        .header-line {
          height: 4px;
          width: 80px;
          background: white;
          border-radius: 2px;
        }
        
        .amount-box {
          background: rgba(255,255,255,0.2);
          padding: 20px;
          border-radius: 12px;
          text-align: right;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }
        
        .amount-box .amount {
          font-size: 24px;
          font-weight: bold;
        }
        
        .amount-box .currency {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .info-card {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .info-card.blue {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-color: #bfdbfe;
        }
        
        .info-card.green {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border-color: #bbf7d0;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .card-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 20px;
        }
        
        .card-icon.blue {
          background: #3b82f6;
          color: white;
        }
        
        .card-icon.green {
          background: #16a34a;
          color: white;
        }
        
        .card-title {
          font-size: 18px;
          font-weight: bold;
        }
        
        .card-title.blue {
          color: #1e40af;
        }
        
        .card-title.green {
          color: #166534;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .info-label {
          color: #6b7280;
        }
        
        .info-value {
          font-weight: bold;
        }
        
        .service-period-highlight {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: #166534;
          background: #dcfce7;
          padding: 12px;
          border-radius: 8px;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .section-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 15px;
        }
        
        .section-icon.blue {
          background: #3b82f6;
          color: white;
        }
        
        .section-icon.green {
          background: #16a34a;
          color: white;
        }
        
        .section-icon.purple {
          background: #9333ea;
          color: white;
        }
        
        .section-icon.emerald {
          background: #059669;
          color: white;
        }
        
        .section-icon.yellow {
          background: #f59e0b;
          color: white;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: bold;
        }
        
        .contact-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }
        
        .contact-card.green {
          border-left-color: #16a34a;
        }
        
        .contact-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .contact-company {
          color: #374151;
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        .contact-address {
          color: #6b7280;
          margin-bottom: 12px;
          white-space: pre-line;
          line-height: 1.5;
        }
        
        .contact-detail {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .contact-detail .icon {
          color: #3b82f6;
          margin-right: 8px;
        }
        
        .contact-detail .text {
          font-weight: 500;
        }
        
        .section {
          margin-bottom: 20px;
        }
        
        .content-card {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .content-card.purple {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border-color: #e9d5ff;
        }
        
        .content-card.emerald {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-color: #a7f3d0;
        }
        
        .content-card.yellow {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-color: #fed7aa;
        }
        
        .content-text {
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
        }
        
        .bank-details {
          background: white;
          padding: 16px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-line;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .total-section {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .total-left .label {
          font-size: 18px;
          opacity: 0.9;
        }
        
        .total-left .due-date {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .total-right {
          text-align: right;
        }
        
        .total-amount {
          font-size: 28px;
          font-weight: bold;
        }
        
        .total-currency {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .footer {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        .footer p {
          margin: 0 0 5px 0;
        }
        
        .footer p:last-child {
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div>
            <h1>INVOICE</h1>
            <div class="header-line"></div>
          </div>
          <div class="amount-box">
            <div class="amount">$${invoiceData.amount.toFixed(2)}</div>
            <div class="currency">${invoiceData.currency}</div>
          </div>
        </div>
        
        <!-- Info Cards -->
        <div class="info-grid">
          <div class="info-card blue">
            <div class="card-header">
              <div class="card-icon blue">📋</div>
              <h3 class="card-title blue">Invoice Information</h3>
            </div>
            <div class="info-row">
              <span class="info-label">Invoice Number:</span>
              <span class="info-value">${invoiceData.invoiceNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Invoice Date:</span>
              <span class="info-value">${new Date(invoiceData.invoiceDate).toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Due Date:</span>
              <span class="info-value" style="color: #dc2626">${new Date(invoiceData.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div class="info-card green">
            <div class="card-header">
              <div class="card-icon green">📅</div>
              <h3 class="card-title green">Service Period</h3>
            </div>
            <div class="service-period-highlight">
              ${invoiceData.servicePeriod}
            </div>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div class="contact-grid">
          <div>
            <div class="section-header">
              <div class="section-icon blue">👤</div>
              <h3 class="section-title">From</h3>
            </div>
            <div class="contact-card">
              <div class="contact-name">${invoiceData.contractorName}</div>
              <div class="contact-address">${invoiceData.contractorAddress}</div>
              <div class="contact-detail">
                <span class="icon">📧</span>
                <span class="text">${invoiceData.contractorEmail}</span>
              </div>
              <div class="contact-detail">
                <span class="icon">📱</span>
                <span class="text">${invoiceData.contractorPhone}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div class="section-header">
              <div class="section-icon green">🏢</div>
              <h3 class="section-title">Bill To</h3>
            </div>
            <div class="contact-card green">
              <div class="contact-name">${invoiceData.clientName}</div>
              <div class="contact-company">${invoiceData.clientCompany}</div>
              ${invoiceData.clientEmail ? `
                <div class="contact-detail">
                  <span class="icon">📧</span>
                  <span class="text">${invoiceData.clientEmail}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        
        <!-- Service Description -->
        <div class="section">
          <div class="section-header">
            <div class="section-icon purple">⚡</div>
            <h3 class="section-title">Service Description</h3>
          </div>
          <div class="content-card purple">
            <p class="content-text">${invoiceData.serviceDescription}</p>
          </div>
        </div>
        
        <!-- Payment Information -->
        <div class="section">
          <div class="section-header">
            <div class="section-icon emerald">💳</div>
            <h3 class="section-title">Payment Information</h3>
          </div>
          <div class="content-card emerald">
            <div class="bank-details">${invoiceData.bankDetails}</div>
          </div>
        </div>
        
        ${invoiceData.notes ? `
        <!-- Notes -->
        <div class="section">
          <div class="section-header">
            <div class="section-icon yellow">📝</div>
            <h3 class="section-title">Additional Notes</h3>
          </div>
          <div class="content-card yellow">
            <p class="content-text">${invoiceData.notes}</p>
          </div>
        </div>
        ` : ''}
        
        <!-- Total Amount -->
        <div class="total-section">
          <div class="total-left">
            <div class="label">Total Amount Due</div>
            <div class="due-date">Payment due by ${new Date(invoiceData.dueDate).toLocaleDateString()}</div>
          </div>
          <div class="total-right">
            <div class="total-amount">$${invoiceData.amount.toFixed(2)}</div>
            <div class="total-currency">${invoiceData.currency}</div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business! 🙏</p>
          <p>This invoice was generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}