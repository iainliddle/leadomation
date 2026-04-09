export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8faff',
    }}>
      <div style={{textAlign: 'center', padding: '0 24px'}}>
        <h1 style={{
          fontFamily: 'Switzer, sans-serif',
          fontSize: '56px',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          maxWidth: '800px',
          margin: '0 auto 24px',
        }}>
          Your next 100 clients are already out there.{' '}
          <span style={{color: '#4F46E5'}}>Leadomation finds them automatically.</span>
        </h1>
        <p style={{
          fontFamily: 'Switzer, sans-serif',
          fontSize: '18px',
          color: '#475569',
          maxWidth: '560px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Leadomation finds and enriches B2B leads, writes personalised outreach, automates LinkedIn and calls prospects with an AI voice agent. Your pipeline fills while you focus on closing.
        </p>
        <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
          <button style={{
            background: '#1E1B4B',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 32px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Switzer, sans-serif',
          }}>Start free trial</button>
          <button style={{
            background: 'transparent',
            color: '#0f172a',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            padding: '14px 32px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Switzer, sans-serif',
          }}>See how it works</button>
        </div>
      </div>
    </section>
  )
}
