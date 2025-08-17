import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Professional Invoice Generator - Create PDF Invoices Online Free",
  description: "Create professional PDF invoices instantly with our free online invoice generator. Features automatic numbering, email templates, form persistence, and beautiful designs. Perfect for freelancers and small businesses.",
  keywords: [
    "invoice generator",
    "pdf invoice creator",
    "free invoice maker",
    "professional invoices",
    "online invoice generator",
    "freelancer invoice",
    "small business invoice",
    "web development invoice",
    "invoice template",
    "automatic invoice numbering"
  ],
  authors: [{ 
    name: "Muhammad Qais Sultani", 
    url: "https://portfolio-qaissultanis-projects.vercel.app/" 
  }],
  creator: "Muhammad Qais Sultani",
  publisher: "Qais Sultani - Full Stack Developer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://invoice-generator-professional.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://invoice-generator-professional.vercel.app",
    title: "Professional Invoice Generator - Create PDF Invoices Online Free",
    description: "Create professional PDF invoices instantly with our free online invoice generator. Features automatic numbering, email templates, and beautiful designs.",
    siteName: "Professional Invoice Generator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Professional Invoice Generator - Create Beautiful PDF Invoices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Invoice Generator - Create PDF Invoices Online Free",
    description: "Create professional PDF invoices instantly with our free online invoice generator. Perfect for freelancers and small businesses.",
    images: ["/og-image.png"],
    creator: "@QaisSultani",
    site: "@QaisSultani",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Business Tools",
  verification: {
    google: "google-site-verification-code-placeholder",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Professional Invoice Generator",
    "description": "Create professional PDF invoices instantly with our free online invoice generator. Features automatic numbering, email templates, and beautiful designs.",
    "url": "https://invoice-generator-professional.vercel.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free online invoice generator"
    },
    "creator": {
      "@type": "Person",
      "name": "Muhammad Qais Sultani",
      "url": "https://portfolio-qaissultanis-projects.vercel.app/",
      "sameAs": [
        "https://github.com/QaisSultani",
        "https://www.linkedin.com/in/muhammad-qais-sultani/",
        "https://www.upwork.com/freelancers/qaissultani"
      ],
      "jobTitle": "Full Stack Developer",
      "description": "Professional web developer specializing in Next.js, React, and modern web technologies"
    },
    "publisher": {
      "@type": "Person",
      "name": "Muhammad Qais Sultani",
      "url": "https://portfolio-qaissultanis-projects.vercel.app/"
    },
    "featureList": [
      "Professional PDF invoice generation",
      "Automatic invoice numbering",
      "Email template generation",
      "Form data persistence",
      "Gmail integration",
      "Responsive design"
    ],
    "browserRequirements": "Modern web browser with JavaScript enabled"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}