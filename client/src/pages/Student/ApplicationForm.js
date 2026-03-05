<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

export default function ApplicationForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offering, setOffering] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [payment, setPayment] = useState({
        amount: '',
        transactionId: '',
        bank: '',
        paymentDate: ''
    });
    const [transactionSlip, setTransactionSlip] = useState(null);

<<<<<<< HEAD
    const fetchOffering = useCallback(async () => {
=======
    useEffect(() => {
        fetchOffering();
    }, [id]);

    const fetchOffering = async () => {
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9
        try {
            const res = await api.get(`/offerings/${id}`);
            setOffering(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch offering');
        } finally {
            setLoading(false);
        }
<<<<<<< HEAD
    }, [id]);

    useEffect(() => {
        fetchOffering();
    }, [fetchOffering]);
=======
    };
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9

    const handlePaymentChange = (e) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setTransactionSlip(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('offeringId', id);
            if (offering?.admissionCycleId?._id) {
                formData.append('admissionCycleId', offering.admissionCycleId._id);
            }
            formData.append('paymentDetails[amount]', payment.amount);
            formData.append('paymentDetails[transactionId]', payment.transactionId);
            formData.append('paymentDetails[bank]', payment.bank);
            formData.append('paymentDetails[paymentDate]', payment.paymentDate);

            if (transactionSlip) {
                formData.append('transactionSlip', transactionSlip);
            }

            await api.post('/applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/student/applications');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading offering details...</div>;
    if (!offering) return <div style={{ textAlign: 'center', padding: '40px' }}>Offering not found.</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Apply for PhD Program</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Complete the payment details to submit your application.</p>
                </div>
                <Link to="/student" className="btn-primary" style={{ textDecoration: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid #e5e7eb' }}>Cancel</Link>
            </div>

            {error && <div style={{
                backgroundColor: 'var(--danger-light)', color: 'var(--danger)',
                padding: '12px', borderRadius: 'var(--border-radius)', marginBottom: '20px'
            }}>{error}</div>}

            <div className="page-card" style={{ marginBottom: '30px', borderLeft: '4px solid var(--primary-color)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{offering.department} - {offering.specialization}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <p><strong>Program Type:</strong> {offering.offeringType}</p>
                    <p><strong>Admission Cycle:</strong> {offering.admissionCycleId?.name}</p>
                    <p><strong>Deadline:</strong> {new Date(offering.deadline).toLocaleDateString()}</p>
                    <p><strong>Criteria:</strong> <a href={offering.criteriaUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>View PDF Document</a></p>
                </div>
            </div>

            <div className="page-card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb' }}>Payment Details</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div className="form-group">
                            <label>Amount Paid (INR)</label>
                            <input type="number" name="amount" value={payment.amount} onChange={handlePaymentChange} required placeholder="e.g. 1500" />
                        </div>
                        <div className="form-group">
                            <label>Transaction ID / Reference No</label>
                            <input type="text" name="transactionId" value={payment.transactionId} onChange={handlePaymentChange} required placeholder="Enter bank reference number" />
                        </div>
                        <div className="form-group">
                            <label>Bank Name</label>
                            <input type="text" name="bank" value={payment.bank} onChange={handlePaymentChange} required placeholder="e.g. State Bank of India" />
                        </div>
                        <div className="form-group">
                            <label>Payment Date</label>
                            <input type="date" name="paymentDate" value={payment.paymentDate} onChange={handlePaymentChange} required />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '10px' }}>
                        <label>Upload Transaction Slip (PDF/Image)</label>
                        <input type="file" onChange={handleFileChange} required style={{ border: '1px solid #d1d5db', padding: '10px', width: '100%', borderRadius: 'var(--border-radius)', backgroundColor: '#f9fafb' }} />
                        <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '5px' }}>Max file size: 2MB. Ensure the transaction ID is clearly visible.</small>
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>
                            {submitting ? 'Submitting Application...' : 'Submit Final Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
