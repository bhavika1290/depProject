import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FeePayment() {
    const [status, setStatus] = useState('pending'); // pending, processing, success
    const feeAmount = 1500;

    const handlePayment = () => {
        setStatus('processing');
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <div className="page-card" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--primary-dark)' }}>Application Fee Payment</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Secure placeholder payment gateway for PhD Admissions.
                </p>

                {status === 'pending' && (
                    <div className="animate-fade-in">
                        <div style={{ backgroundColor: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                            <span style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Amount to Pay</span>
                            <span style={{ display: 'block', fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{feeAmount}</span>
                        </div>
                        <button onClick={handlePayment} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '8px' }}>
                            Pay Now
                        </button>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
                        <div style={{ width: '50px', height: '50px', border: '4px solid #e5e7eb', borderTopColor: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Processing your payment securely...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '3rem' }}>
                            ✓
                        </div>
                        <h3 style={{ fontSize: '1.8rem', color: 'var(--success)', marginBottom: '10px' }}>Payment Successful!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>Your application fee of ₹{feeAmount} has been received.</p>
                        
                        <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #cbd5e1', marginBottom: '30px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--text-secondary)' }}>Transaction ID:</span> <strong>TXN-{Math.floor(Math.random() * 1000000000)}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--text-secondary)' }}>Date & Time:</span> <strong>{new Date().toLocaleString()}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span> <strong>Credit Card (ending 4242)</strong></div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button className="btn-primary" onClick={() => window.print()} style={{ flex: 1, backgroundColor: 'white', color: 'var(--primary-color)', border: '2px solid var(--primary-color)' }}>
                                Download Receipt
                            </button>
                            <Link to="/student/applications" className="btn-primary" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                Continue to Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
