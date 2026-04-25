# DKM Al-Aena

Aplikasi laporan keuangan DKM Al-Aena berbasis Next.js, Tailwind CSS, shadcn/ui, Drizzle ORM, dan MySQL.

## Fitur

- Portal publik tanpa login untuk melihat saldo, pemasukan, pengeluaran, grafik arus kas, dan riwayat transaksi.
- Login pengurus untuk peran `BENDAHARA` dan `KETUA`.
- Bendahara dapat menambah, mengedit, dan menghapus transaksi.
- Ketua dapat memantau data tanpa akses mutasi.
- Ekspor laporan bulanan ke CSV dan PDF.
- Endpoint backup JSON bulanan melalui Vercel Cron di `/api/backup`.

## Setup

```bash
npm install
cp .env.example .env.local
```

Isi `DATABASE_URL`, `AUTH_SECRET`, dan `CRON_SECRET` di `.env.local`.

```bash
npm run db:push
npm run db:seed
npm run dev
```

User awal dari seed:

- Bendahara: `081363899584`
- Ketua: `081371432512`

Password awal dicetak saat `npm run db:seed` dijalankan. Jika `DATABASE_URL` belum diset, aplikasi tetap bisa dibuka dengan data demo, tetapi fitur tambah/edit/hapus membutuhkan database MySQL.

## Script

- `npm run dev` menjalankan development server.
- `npm run build` membuat production build.
- `npm run lint` menjalankan ESLint.
- `npm run db:generate` membuat migration dari schema Drizzle.
- `npm run db:push` menerapkan schema ke MySQL.
- `npm run db:seed` membuat akun awal.
- `npm run db:studio` membuka Drizzle Studio.
