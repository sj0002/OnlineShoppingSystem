import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/users';

function CustomerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSellerForm, setShowSellerForm] = useState(false);
    const [sellerDetails, setSellerDetails] = useState({
        businessName: '',
        contactNumber: '',
        storeAddress: '',
    });

    const handleSellerRequest = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in again before requesting seller access.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/request-seller`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sellerDetails),
            });
            const responseText = await response.text();
            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('Seller request returned a non-JSON response:', {
                    status: response.status,
                    contentType: response.headers.get('content-type'),
                    body: responseText.slice(0, 200),
                    parseError,
                });
                throw new Error(
                    `Backend returned an unexpected response (${response.status}). Check that the API is running at ${API_URL}.`
                );
            }

            if (!response.ok) {
                throw new Error(data.message || 'Unable to submit seller request.');
            }

            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            setShowSellerForm(false);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <main style={styles.container}><p>Please log in to view your profile.</p></main>;
    }

    const requestStatus = user.sellerRequestStatus || 'None';
    const profileTitle = user.role === 'Admin'
        ? 'Admin Profile'
        : user.role === 'Seller'
            ? 'Seller Profile'
            : 'Customer Profile';
    const dashboardPath = user.role === 'Admin' ? '/admin' : '/seller';
    const dashboardLabel = user.role === 'Admin' ? 'Admin Dashboard' : 'Seller Dashboard';

    return (
        <main style={styles.container}>
            <section style={styles.card}>
                <h1 style={styles.title}>{profileTitle}</h1>
                <p style={styles.detail}><strong>{user.name}</strong></p>
                <p style={styles.detail}>{user.email}</p>

                {(user.role === 'Admin' || user.role === 'Seller') && (
                    <button
                        type="button"
                        style={styles.button}
                        onClick={() => navigate(dashboardPath)}
                    >
                        {dashboardLabel}
                    </button>
                )}

                {user.role === 'Customer' && requestStatus === 'None' && !showSellerForm && (
                    <button type="button" style={styles.button} onClick={() => setShowSellerForm(true)}>
                        Become a Seller
                    </button>
                )}
                {user.role === 'Customer' && (requestStatus === 'None' || requestStatus === 'Rejected') && showSellerForm && (
                    <form style={styles.form} onSubmit={handleSellerRequest}>
                        <input
                            required
                            style={styles.input}
                            placeholder="Business name"
                            value={sellerDetails.businessName}
                            onChange={(event) => setSellerDetails({ ...sellerDetails, businessName: event.target.value })}
                        />
                        <input
                            required
                            style={styles.input}
                            placeholder="Contact number"
                            value={sellerDetails.contactNumber}
                            onChange={(event) => setSellerDetails({ ...sellerDetails, contactNumber: event.target.value })}
                        />
                        <textarea
                            required
                            style={styles.input}
                            placeholder="Store address"
                            value={sellerDetails.storeAddress}
                            onChange={(event) => setSellerDetails({ ...sellerDetails, storeAddress: event.target.value })}
                        />
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Seller Request'}
                        </button>
                        <button type="button" style={styles.cancelButton} onClick={() => setShowSellerForm(false)}>
                            Cancel
                        </button>
                    </form>
                )}
                {user.role === 'Customer' && requestStatus === 'Pending' && (
                    <p style={styles.pending}>Seller Request Pending</p>
                )}
                {user.role === 'Customer' && requestStatus === 'Rejected' && (
                    <>
                        <p style={styles.rejected}>Your previous seller request was rejected.</p>
                        {!showSellerForm && (
                            <button type="button" style={styles.button} onClick={() => setShowSellerForm(true)}>
                                Request Seller Access Again
                            </button>
                        )}
                    </>
                )}
                {user.role === 'Seller' && <p style={styles.approved}>Seller account approved</p>}
                {error && <p style={styles.error}>{error}</p>}
            </section>
        </main>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '48px 20px', minHeight: '80vh' },
    card: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '32px' },
    title: { marginTop: 0, fontSize: '30px' },
    detail: { color: '#bbb', fontSize: '17px' },
    button: { backgroundColor: '#3498db', border: 0, borderRadius: '4px', color: '#fff', cursor: 'pointer', padding: '12px 18px', fontSize: '16px' },
    cancelButton: { backgroundColor: 'transparent', border: '1px solid #555', borderRadius: '4px', color: '#bbb', cursor: 'pointer', padding: '12px 18px', fontSize: '16px' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px', maxWidth: '520px' },
    input: { backgroundColor: '#222', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '16px', padding: '12px' },
    pending: { color: '#f0c674', fontWeight: 'bold' },
    rejected: { color: '#ff6b6b' },
    approved: { color: '#6bff6b', fontWeight: 'bold' },
    error: { color: '#ff6b6b', marginTop: '20px' },
};

export default CustomerDashboard;