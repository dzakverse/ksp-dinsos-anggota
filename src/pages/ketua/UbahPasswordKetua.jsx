import UbahPasswordPengurus from '../shared/UbahPasswordPengurus';

// Wrapper tipis: JSX aslinya sudah dipindah & digabung dengan UbahPassword.jsx
// ke pages/shared/UbahPasswordPengurus.jsx (keduanya sebelumnya ~99% identik).
export default function UbahPasswordKetua() {
  return <UbahPasswordPengurus variant="KETUA" />;
}
