import { useState, useEffect } from 'react';

export default function Countdown(tanggal_jatuh_tempo?: string | Date) {
  // 1. Inisialisasi awal langsung hitung secara inline
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!tanggal_jatuh_tempo) return 0;
    const selisih = new Date(tanggal_jatuh_tempo).getTime() - new Date().getTime();
    return selisih > 0 ? Math.floor(selisih / 1000) : 0;
  });

  useEffect(() => {
    if (!tanggal_jatuh_tempo) return;

    // 2. Definisikan fungsi di dalam useEffect
    const dapatkanSisaDetik = () => {
      const waktuTarget = new Date(tanggal_jatuh_tempo).getTime();
      const waktuSekarang = new Date().getTime();
      const selisihMilidetik = waktuTarget - waktuSekarang;
      return selisihMilidetik > 0 ? Math.floor(selisihMilidetik / 1000) : 0;
    };

    // Jalankan interval
    const timer = setInterval(() => {
      const sisa = dapatkanSisaDetik();
      setSecondsLeft(sisa);

      if (sisa <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tanggal_jatuh_tempo]); // Dependency sekarang bersih, cuma butuh tanggal_jatuh_tempo

  // 3. Fungsi format waktu tetap sama
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const displayHours = hours > 0 ? `${String(hours).padStart(2, '0')}:` : '';
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');

    return `${displayHours}${displayMinutes}:${displaySeconds}`;
  };

  return formatTime(secondsLeft);
}