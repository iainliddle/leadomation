{/* ===== TRUST BAR — Auto-scrolling marquee ===== */ }
<section className="lp-trust">
    <div className="lp-container">
        <p className="lp-trust-label">Powered by Industry Leaders</p>
    </div>
    <div className="lp-marquee-wrapper">
        <div className="lp-marquee">
            <div className="lp-marquee-track">
                {[...Array(3)].map((_, setIdx) => (
                    <React.Fragment key={setIdx}>
                        <div className="lp-trust-logo">
                            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google Maps" className="lp-trust-logo-img" style={{ height: '22px' }} />
                            <span>Maps</span>
                        </div>
                        <div className="lp-trust-logo">
                            <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#F06529" height="22" width="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                            <span>Hunter.io</span>
                        </div>
                        <div className="lp-trust-logo">
                            <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#0A66C2" height="22" width="22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            <span>LinkedIn</span>
                        </div>
                        <div className="lp-trust-logo">
                            <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#00A4EF" height="22" width="22"><path d="M0 0h11.5v11.5H0zM12.5 0H24v11.5H12.5zM0 12.5h11.5V24H0zM12.5 12.5H24V24H12.5z" /></svg>
                            <span>Microsoft 365</span>
                        </div>
                        <div className="lp-trust-logo">
                            <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#635BFF" height="22" width="22"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" /></svg>
                            <span>Stripe</span>
                        </div>
                        <div className="lp-trust-logo">
                            <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#3ECF8E" height="22" width="22"><path d="M21.362 9.354H12V.396a.396.396 0 0 0-.745-.188L2.203 11.511a.792.792 0 0 0 .663 1.235H12v8.958a.396.396 0 0 0 .745.188l9.052-11.303a.792.792 0 0 0-.663-1.235z" /></svg>
                            <span>Supabase</span>
                        </div>
                        <div className="lp-trust-logo">
                            <svg className="lp-trust-logo-svg" viewBox="0 0 100 100" fill="#4F46E5" height="22" width="22"><circle cx="50" cy="50" r="45" fill="none" stroke="#4F46E5" strokeWidth="8" /><path d="M30 50 L45 35 L60 50 L45 65 Z" fill="#4F46E5" /><path d="M50 50 L65 35 L80 50 L65 65 Z" fill="#4F46E5" opacity="0.6" /></svg>
                            <span>Unipile</span>
                        </div>
                        <div className="lp-trust-logo">
                            <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#4F46E5" height="22" width="22"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 14.5L7 13l1.4-1.4 2.1 2.1 5.1-5.1L17 10l-6.5 6.5z" /></svg>
                            <span>Vapi.ai</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    </div>
</section>
