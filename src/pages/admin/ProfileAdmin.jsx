import ProfilPengurus from '../shared/ProfilPengurus';

// Wrapper tipis: JSX aslinya sudah dipindah & digabung dengan ProfileKetua.jsx
// ke pages/shared/ProfilPengurus.jsx (keduanya sebelumnya ~90% identik).
export default function ProfileAdmin() {
  return <ProfilPengurus variant="BENDAHARA" />;
}
