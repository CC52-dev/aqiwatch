import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'AQIWatch – Real-time Air Quality Data & AI Health Insights'
export const size = {
  width: 1200,
  height: 600,
}
 
export const contentType = 'image/png'
 
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
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(125, 249, 255, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(125, 249, 255, 0.15) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          position: 'relative',
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(125, 249, 255, 0.1) 0%, transparent 50%, rgba(125, 249, 255, 0.1) 100%)',
          }}
        />
        
        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '35px',
            zIndex: 1,
            padding: '50px',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '25px',
              background: 'rgba(125, 249, 255, 0.2)',
              border: '3px solid rgba(125, 249, 255, 0.4)',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7df9ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                textAlign: 'center',
              }}
            >
              AQIWatch
            </h1>
            <p
              style={{
                fontSize: '28px',
                color: '#7df9ff',
                margin: 0,
                fontWeight: '600',
              }}
            >
              Real-time Air Quality Monitoring
            </p>
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '25px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(125, 249, 255, 0.15)',
                borderRadius: '10px',
                border: '1px solid rgba(125, 249, 255, 0.3)',
              }}
            >
              <span style={{ fontSize: '22px', color: '#7df9ff' }}>📊</span>
              <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: '500' }}>Real-time Data</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(125, 249, 255, 0.15)',
                borderRadius: '10px',
                border: '1px solid rgba(125, 249, 255, 0.3)',
              }}
            >
              <span style={{ fontSize: '22px', color: '#7df9ff' }}>🤖</span>
              <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: '500' }}>AI Predictions</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(125, 249, 255, 0.15)',
                borderRadius: '10px',
                border: '1px solid rgba(125, 249, 255, 0.3)',
              }}
            >
              <span style={{ fontSize: '22px', color: '#7df9ff' }}>❤️</span>
              <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: '500' }}>Health Insights</span>
            </div>
          </div>

          {/* Footer */}
          <p
            style={{
              fontSize: '22px',
              color: '#888888',
              margin: 0,
              marginTop: '10px',
            }}
          >
            aqi.watch
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

