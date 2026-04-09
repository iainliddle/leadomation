export default function Nav() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      background: 'transparent',
    }}>
      <div style={{
        fontFamily: 'Switzer, sans-serif',
        fontWeight: 700,
        fontSize: '18px',
        color: '#0f172a',
      }}>
        Leadomation
      </div>
      <div style={{display: 'flex', gap: '32px', alignItems: 'center'}}>
        {['Features', 'How it works', 'Pricing', 'FAQ'].map(link => (
          <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#475569',
            textDecoration: 'none',
          }}>{link}</a>
        ))}
      </div>
      <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
        <button style={{
          background: 'transparent',
          border: 'none',
          fontSize: '14px',
          fontWeight: 500,
          color: '#475569',
          cursor: 'pointer',
          fontFamily: 'Switzer, sans-serif',
        }}>Sign in</button>
        <button style={{
          background: '#1E1B4B',
          color: '#fff',
          border: 'none',
          borderRadius: '32px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Switzer, sans-serif',
        }}>Start free trial</button>
      </div>
    </nav>
  )
}
