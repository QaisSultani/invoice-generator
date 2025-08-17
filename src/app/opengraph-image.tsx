import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = 'Professional Invoice Generator - Create Beautiful PDF Invoices'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 120,
              marginRight: 30,
            }}
          >
            📄
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
              Professional Invoice Generator
            </div>
            <div
              style={{
                fontSize: 32,
                opacity: 0.9,
              }}
            >
              Create PDF Invoices Online • Free & Professional
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            fontSize: 24,
            opacity: 0.8,
          }}
        >
          ✨ Automatic Numbering • 📧 Email Templates • 💾 Form Persistence
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}