import ProfilPengurus from '../shared/ProfilPengurus';

// Wrapper tipis: JSX aslinya sudah dipindah & digabung dengan ProfileAdmin.jsx
// ke pages/shared/ProfilPengurus.jsx (keduanya sebelumnya ~90% identik).
export default function ProfileKetua() {
  return <ProfilPengurus variant="KETUA" />;
}
