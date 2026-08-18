import UbahPasswordPengurus from '../shared/UbahPasswordPengurus';

// Wrapper tipis: JSX aslinya sudah dipindah & digabung dengan UbahPasswordKetua.jsx
// ke pages/shared/UbahPasswordPengurus.jsx (keduanya sebelumnya ~99% identik).
export default function UbahPassword() {
  return <UbahPasswordPengurus variant="BENDAHARA" />;
}
