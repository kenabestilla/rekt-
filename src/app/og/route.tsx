import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: '#666',
              border: '1px solid #333',
              padding: '8px 20px',
            }}
          >
            agent economy protocol · base chain
          </div>
        </div>

        <div
          style={{
            fontSize: '80px',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-4px',
            marginBottom: '24px',
          }}
        >
          REKT
        </div>

        <div
          style={{
            fontSize: '32px',
            color: '#888',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Crypto Intelligence for Agent Builders
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '48px',
          }}
        >
          <div
            style={{
              background: '#fff',
              color: '#000',
              padding: '12px 32px',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            rektagents.xyz
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
