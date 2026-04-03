import { } from 'react';
import logoDark from '../assets/logo-full.png';

const BlogPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: '100vh', background: '#F8FAFC' }}>
      <nav style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoDark} alt="Leadomation" style={{ height: 36 }} />
        </a>
      </nav>
      <div style={{
        maxWidth: 600,
        margin: '120px auto',
        textAlign: 'center',
        padding: '0 24px',
      }}>
        <div style={{
          width: 64, height: 64,
          background: '#EEF2FF',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 28,
        }}>
          ✍️
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Blog coming soon</h1>
        <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.6 }}>
          We are working on insights, guides and case studies to help you get the most from Leadomation. Check back soon.
        </p>
        <button
          onClick={() => onNavigate('Landing')}
          style={{
            marginTop: 32,
            padding: '10px 24px',
            background: '#4F46E5',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
