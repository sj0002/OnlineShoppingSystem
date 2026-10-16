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
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(() => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('user')) || {};
            return { name: savedUser.name || '', email: savedUser.email || '' };
        } catch {
            return { name: '', email: '' };
        }
    });
    const [avatar, setAvatar] = useState(() => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('user')) || {};
            return savedUser.profileImage || savedUser.avatar || '';
        } catch {
            return '';
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

    const handleProfileSave = (event) => {
        event.preventDefault();
        const updatedUser = {
            ...user,
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            profileImage: avatar,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
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
    const initials = user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <main style={styles.container}>
            <section style={styles.card}>
                <div style={styles.cover} />
                <div style={styles.profileHeader}>
                    <div style={styles.avatarWrapper}>
                        {avatar ? (
                            <img src={avatar} alt={`${user.name} profile`} style={styles.avatarImage} />
                        ) : (
                            <div style={styles.avatarFallback}>{initials || '?'}</div>
                        )}
                        <label htmlFor="avatar-upload" style={styles.avatarEdit} title="Upload profile image">
                            ✎
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={styles.hiddenInput} />
                    </div>
                    <div style={styles.identity}>
                        <div style={styles.nameRow}>
                            <h1 style={styles.title}>{profileTitle}</h1>
                            <span style={{ ...styles.roleBadge, ...(roleStyles[user.role] || roleStyles.Customer) }}>
                                {user.role}
                            </span>
                        </div>
                        <p style={styles.subtitle}>Manage your account and preferences</p>
                    </div>
                </div>

                <div style={styles.divider} />

                {isEditing ? (
                    <form style={styles.profileForm} onSubmit={handleProfileSave}>
                        <label style={styles.fieldLabel}>
                            Full name
                            <input
                                required
                                style={styles.input}
                                value={editForm.name}
                                onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                            />
                        </label>
                        <label style={styles.fieldLabel}>
                            Email address
                            <input
                                required
                                type="email"
                                style={styles.input}
                                value={editForm.email}
                                onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                            />
                        </label>
                        <div style={styles.actionRow}>
                            <button type="submit" style={styles.primaryButton}>Save Changes</button>
                            <button type="button" style={styles.secondaryButton} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div style={styles.detailsGrid}>
                        <div>
                            <span style={styles.detailLabel}>Full name</span>
                            <p style={styles.detailValue}>{user.name}</p>
                        </div>
                        <div>
                            <span style={styles.detailLabel}>Email address</span>
                            <p style={styles.detailValue}>{user.email}</p>
                        </div>
                    </div>
                )}

                {!isEditing && (
                    <button type="button" style={styles.secondaryButton} onClick={() => {
                        setEditForm({ name: user.name, email: user.email });
                        setIsEditing(true);
                    }}>
                        Edit Profile
                    </button>
                )}

                {(user.role === 'Admin' || user.role === 'Seller') && (
                    <button
                        type="button"
                        style={styles.primaryButton}
                        onClick={() => navigate(dashboardPath)}
                    >
                        {dashboardLabel}
                    </button>
                )}

                {user.role === 'Customer' && requestStatus === 'None' && !showSellerForm && (
                    <button type="button" style={styles.primaryButton} onClick={() => setShowSellerForm(true)}>
                        Become a Seller
                    </button>
                )}
                {user.role === 'Customer' && (requestStatus === 'None' || requestStatus === 'Rejected') && showSellerForm && (
                    <form style={styles.sellerForm} onSubmit={handleSellerRequest}>
                        <input
                            required
                            style={styles.formInput}
                            placeholder="Business name"
                            value={sellerDetails.businessName}
                            onChange={(event) => setSellerDetails({ ...sellerDetails, businessName: event.target.value })}
                        />
                        <input
                            required
                            style={styles.formInput}
                            placeholder="Contact number"
                            value={sellerDetails.contactNumber}
                            onChange={(event) => setSellerDetails({ ...sellerDetails, contactNumber: event.target.value })}
                        />
                        <textarea
                            required
                            style={styles.formInput}
                            placeholder="Store address"
                            value={sellerDetails.storeAddress}
                            onChange={(event) => setSellerDetails({ ...sellerDetails, storeAddress: event.target.value })}
                        />
                        <button type="submit" style={styles.primaryButton} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Seller Request'}
                        </button>
                        <button type="button" style={styles.secondaryButton} onClick={() => setShowSellerForm(false)}>
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
                            <button type="button" style={styles.primaryButton} onClick={() => setShowSellerForm(true)}>
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

const roleStyles = {
    Admin: { backgroundColor: '#173b49', color: '#7dd3fc' },
    Seller: { backgroundColor: '#193b2d', color: '#86efac' },
    Customer: { backgroundColor: '#382d18', color: '#fcd34d' },
};

const styles = {
    container: { maxWidth: '960px', margin: '0 auto', padding: '56px 20px', minHeight: '80vh' },
    card: { position: 'relative', overflow: 'hidden', backgroundColor: '#111820', border: '1px solid #263746', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)', padding: '0 40px 40px' },
    cover: { height: '112px', margin: '0 -40px 0', background: 'linear-gradient(120deg, #123b46, #1c5a62 54%, #347b70)' },
    profileHeader: { display: 'flex', alignItems: 'center', gap: '24px', marginTop: '-42px' },
    avatarWrapper: { position: 'relative', width: '112px', height: '112px', flexShrink: 0 },
    avatarImage: { width: '112px', height: '112px', objectFit: 'cover', borderRadius: '50%', border: '5px solid #111820', display: 'block' },
    avatarFallback: { width: '112px', height: '112px', boxSizing: 'border-box', borderRadius: '50%', border: '5px solid #111820', backgroundColor: '#23636b', color: '#d9fff2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', fontWeight: '800' },
    avatarEdit: { position: 'absolute', right: '-2px', bottom: '3px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f0c674', color: '#172127', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', border: '3px solid #111820' },
    hiddenInput: { display: 'none' },
    identity: { minWidth: 0, paddingTop: '32px' },
    nameRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
    title: { margin: 0, color: '#f5f7f8', fontSize: '30px', letterSpacing: '-0.5px' },
    roleBadge: { borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' },
    subtitle: { color: '#8da1ad', margin: '9px 0 0', fontSize: '15px' },
    divider: { height: '1px', backgroundColor: '#263746', margin: '30px 0' },
    detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '28px' },
    detailLabel: { color: '#78909c', display: 'block', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' },
    detailValue: { color: '#edf4f5', margin: 0, fontSize: '17px', overflowWrap: 'anywhere' },
    profileForm: { display: 'grid', gap: '16px', maxWidth: '580px', marginBottom: '28px' },
    fieldLabel: { color: '#9bb0b9', display: 'grid', gap: '8px', fontSize: '13px', fontWeight: '700' },
    input: { backgroundColor: '#18232c', border: '1px solid #39505e', borderRadius: '8px', color: '#fff', fontSize: '16px', padding: '12px 14px', width: '100%', boxSizing: 'border-box' },
    formInput: { backgroundColor: '#18232c', border: '1px solid #39505e', borderRadius: '8px', color: '#fff', fontSize: '16px', padding: '12px 14px', width: '100%', boxSizing: 'border-box' },
    actionRow: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    primaryButton: { backgroundColor: '#2f8f83', border: '1px solid #51b5a5', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '12px 18px', fontSize: '14px', fontWeight: '800', margin: '0 10px 10px 0' },
    secondaryButton: { backgroundColor: 'transparent', border: '1px solid #526773', borderRadius: '8px', color: '#c5d3d8', cursor: 'pointer', padding: '12px 18px', fontSize: '14px', fontWeight: '700', margin: '0 10px 10px 0' },
    sellerForm: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px', maxWidth: '520px' },
    pending: { color: '#f0c674', fontWeight: 'bold' },
    rejected: { color: '#ff6b6b' },
    approved: { color: '#6bff6b', fontWeight: 'bold' },
    error: { color: '#ff6b6b', marginTop: '20px' },
};

export default CustomerDashboard;