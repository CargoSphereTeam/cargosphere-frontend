import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getProfile, updateProfile } from '../../api/authApi.js';
import useAuth from '../../context/useAuth.js';
import { getApiErrorDetails } from '../../utils/apiError.js';
import '../shipments/shipmentListPage.css';
import './clientProfilePage.css';

function ClientProfilePage() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setFormData({ fullName: data.fullName ?? '', phoneNumber: data.phoneNumber ?? '' });
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorDetails(requestError, 'Unable to load your profile.').message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fullName = formData.fullName.trim();
    const phoneNumber = formData.phoneNumber.trim();
    if (fullName.length < 2 || fullName.length > 100) {
      setError('Full name must be between 2 and 100 characters.');
      return;
    }
    if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
      setError('Phone number must contain 10 to 15 digits.');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateProfile({ fullName, phoneNumber });
      setProfile(updated);
      setFormData({ fullName: updated.fullName, phoneNumber: updated.phoneNumber ?? '' });
      refreshUser(updated);
      setEditing(false);
      toast.success('Profile updated successfully.');
    } catch (requestError) {
      setError(getApiErrorDetails(requestError, 'Unable to update your profile.').message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="cargo-profile-page"><div className="cargo-profile-loading">Loading profile...</div></main>;

  return (
    <main className="cargo-profile-page">
      <div className="container cargo-profile-container">
        <span className="cargo-page-label">CLIENT ACCOUNT</span>
        <div className="cargo-profile-heading">
          <div><h1>Your profile</h1><p>Manage your personal CargoSphere account information.</p></div>
          {!editing ? <button type="button" className="cargo-create-button" onClick={() => setEditing(true)}>Edit profile</button> : null}
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        <div className="cargo-profile-layout">
          <aside className="cargo-profile-identity">
            <div className="cargo-profile-avatar">{profile?.fullName?.charAt(0).toUpperCase()}</div>
            <h2>{profile?.fullName}</h2>
            <p>{profile?.email}</p>
            <span>{profile?.status}</span>
          </aside>

          <section className="cargo-profile-card">
            <div className="cargo-profile-card-heading"><span>ACCOUNT DETAILS</span><small>Client ID #{profile?.id}</small></div>
            <form onSubmit={handleSubmit}>
              <div className="cargo-profile-grid">
                <label>Full name<input name="fullName" value={formData.fullName} onChange={handleChange} disabled={!editing || saving} /></label>
                <label>Email address<input value={profile?.email ?? ''} disabled /></label>
                <label>Phone number<input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={!editing || saving} placeholder="Add phone number" /></label>
                <label>Account role<input value="Client" disabled /></label>
                <label>Member since<input value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' }) : '-'} disabled /></label>
                <label>Last updated<input value={profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-IN', { dateStyle: 'long' }) : '-'} disabled /></label>
              </div>
              {editing ? (
                <div className="cargo-profile-actions">
                  <button type="button" onClick={() => { setEditing(false); setFormData({ fullName: profile.fullName, phoneNumber: profile.phoneNumber ?? '' }); }} disabled={saving}>Cancel</button>
                  <button type="submit" className="cargo-create-button" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
                </div>
              ) : null}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ClientProfilePage;
