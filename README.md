# Professional Invoice Generator

A modern, full-featured invoice generator built with Next.js 14, TypeScript, and Puppeteer. Creates beautiful PDF invoices with automatic numbering, form persistence, and email template generation.

## ✨ Features

- 🧾 **Professional Invoice Design** - Beautiful, responsive layout with gradients and modern styling
- 📄 **High-Quality PDF Generation** - Vector-based PDFs with selectable text using Puppeteer
- 🔢 **Smart Invoice Numbering** - Automatic sequential numbering with manual override support
- 💾 **Intelligent Form Persistence** - Auto-saves contact info while keeping dates/amounts fresh
- ✉️ **Gmail-Optimized Email Templates** - Separate sections for recipients, subject, and body
- ✏️ **Session-Only Email Customization** - Make last-minute changes without persistent storage
- ⚙️ **Environment-Based Configuration** - No personal data in code, deployment-ready
- 🚫 **Zero-Amount Protection** - Prevents creation of $0 invoices with validation
- 📧 **Client Email Integration** - Includes client email in Bill To section
- 🎨 **Single-Page PDF Layout** - Dynamic height adjustment prevents page splitting

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repository-url>
cd invoice-generator
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your details:
```env
# Your Information
NEXT_PUBLIC_CONTRACTOR_NAME="Your Full Name"
NEXT_PUBLIC_CONTRACTOR_ADDRESS="Street Address\nCity, State ZIP\nCountry"
NEXT_PUBLIC_CONTRACTOR_EMAIL="your@email.com"
NEXT_PUBLIC_CONTRACTOR_PHONE="+1 (555) 123-4567"

# Default Client (Editable in form)
NEXT_PUBLIC_DEFAULT_CLIENT_NAME="Client Name"
NEXT_PUBLIC_DEFAULT_CLIENT_COMPANY="Client Company"
NEXT_PUBLIC_DEFAULT_CLIENT_EMAIL="client@example.com"

# Bank Details
NEXT_PUBLIC_BANK_DETAILS="Bank: Your Bank\nAccount: 123456789\nRouting: 987654321\nSWIFT: SWIFT123"

# Email Configuration
NEXT_PUBLIC_EMAIL_RECIPIENTS="client@example.com,billing@example.com"

# Settings
NEXT_PUBLIC_DEFAULT_CURRENCY="USD"
NEXT_PUBLIC_INVOICE_PREFIX="INV"
NEXT_PUBLIC_SERVICES_DETAILS="Web Development Services"
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to start creating invoices!

## 🎯 How It Works

### 1. Smart Form Management
- **Persistent Data**: Contact details, service descriptions, and bank info auto-save
- **Fresh Data**: Dates, amounts, and service periods stay fresh for each invoice
- **Easy Reset**: Clear saved data anytime with one click

### 2. Professional PDF Generation
- **Server-Side Rendering**: Uses Puppeteer for consistent, high-quality output
- **Vector Graphics**: Scalable, crisp text and graphics
- **Single-Page Layout**: Dynamic height prevents awkward page splits
- **Professional Design**: Modern gradients, icons, and typography

### 3. Gmail-Ready Email Templates
- **Separate Sections**: Copy recipients, subject, and body individually
- **Customization**: Make last-minute edits before sending
- **No Storage Leaks**: Changes don't persist between invoices
- **Clear Instructions**: Step-by-step Gmail integration guide

### 4. Smart Invoice Numbering
- **Auto-Increment**: Sequential numbering (INV-001, INV-002, etc.)
- **Manual Override**: Edit numbers manually when needed
- **Persistent Counter**: Remembers your last invoice number

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern design
- **PDF Generation**: Puppeteer for server-side rendering
- **Storage**: localStorage for form persistence
- **Deployment**: Vercel-optimized

## 📋 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_CONTRACTOR_NAME` | ✅ | Your full name | "John Doe" |
| `NEXT_PUBLIC_CONTRACTOR_ADDRESS` | ✅ | Your address (use \\n for line breaks) | "123 Main St\\nCity, State 12345" |
| `NEXT_PUBLIC_CONTRACTOR_EMAIL` | ✅ | Your email address | "john@example.com" |
| `NEXT_PUBLIC_CONTRACTOR_PHONE` | ✅ | Your phone number | "+1 (555) 123-4567" |
| `NEXT_PUBLIC_BANK_DETAILS` | ✅ | Bank information for payments | "Bank: Example Bank\\nAccount: 123456789" |
| `NEXT_PUBLIC_DEFAULT_CLIENT_NAME` | ❌ | Default client name | "Client Name" |
| `NEXT_PUBLIC_DEFAULT_CLIENT_COMPANY` | ❌ | Default client company | "Client Company" |
| `NEXT_PUBLIC_DEFAULT_CLIENT_EMAIL` | ❌ | Default client email | "client@example.com" |
| `NEXT_PUBLIC_EMAIL_RECIPIENTS` | ❌ | Comma-separated email list | "client@example.com,billing@example.com" |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | ❌ | Default currency | "USD" |
| `NEXT_PUBLIC_INVOICE_PREFIX` | ❌ | Invoice number prefix | "INV" |
| `NEXT_PUBLIC_SERVICES_DETAILS` | ❌ | Default service description | "Web Development Services" |

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
Compatible with any Node.js hosting:
- **Netlify**: Add environment variables in site settings
- **Railway**: Configure via dashboard or railway.json
- **Heroku**: Use config vars
- **AWS Amplify**: Set environment variables in console

**⚠️ Important**: Never commit `.env.local` with real data. Always configure environment variables on your deployment platform.

## 💻 Development

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint

# Type Checking
npm run type-check   # Check TypeScript types
```

## 🧹 Form Data Management

### What Gets Saved
- ✅ Contractor information
- ✅ Client contact details
- ✅ Service descriptions
- ✅ Bank details
- ✅ Notes and settings

### What Stays Fresh
- ❌ Invoice dates
- ❌ Due dates
- ❌ Service periods
- ❌ Invoice amounts
- ❌ Invoice numbers

This ensures reusable contact information while preventing data leaks between invoices.

## 🎨 Key Features Explained

### PDF Generation
- **Dynamic Height**: Automatically adjusts page size to prevent splitting
- **Vector Output**: Crisp text that scales perfectly
- **Professional Layout**: Modern design with consistent branding
- **Print-Ready**: Optimized margins and formatting

### Email Templates
- **Gmail Integration**: Designed for Gmail's compose interface
- **Individual Copy Buttons**: Copy recipients, subject, and body separately
- **Live Editing**: Make changes without affecting future invoices
- **Professional Tone**: Business-appropriate language and formatting

### Form Validation
- **Amount Validation**: Prevents $0 invoices with visual feedback
- **Required Fields**: Ensures all necessary information is provided
- **Email Validation**: Validates email format for client contacts
- **Date Logic**: Smart date handling for service periods

## 📄 License

MIT License - Free for personal and commercial use.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for freelancers and small businesses who need professional invoicing.**