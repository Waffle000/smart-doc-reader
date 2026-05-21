# Smart Document Reader 📄✨

Aplikasi web modern untuk mengekstrak data dari resi dan *invoice* secara otomatis menggunakan AI (Google Gemini 2.5 Flash), menyajikannya dalam format terstruktur, dapat diedit, dan diekspor. 

🌐 **Live Demo:** [https://smartdoc.waffle.codes](https://smartdoc.waffle.codes)

---

## 🧪 File Uji Coba (Samples)
Untuk memudahkan pengetesan, Anda dapat mengunduh beberapa contoh *invoice* & resi yang sudah disediakan di bawah ini, lalu mengunggahnya ke dalam aplikasi:

1. [Struk Minimarket](/samples/01_struk_minimarket.png)
2. [Invoice Restoran](/samples/02_invoice_restoran.png)
3. [Invoice USD](/samples/03_invoice_usd.png)

---

## 🚀 Fitur Utama
- **OCR & AI Extraction:** Membaca data tersetruktur (Vendor, Tanggal, Total, Pajak, dan Line Items) dari gambar/PDF.
- **Keamanan Unggul:** Verifikasi *Magic Bytes* untuk file, perlindungan *Path Traversal*, CSP Headers, dan R2 *signed-ish URL* via pekerja (Worker).
- **Verifikasi Human-in-the-Loop:** Menampilkan indikator *confidence level* AI (Tinggi/Sedang/Rendah) dan memungkinkan pengguna mengedit data jika AI salah mengenali tulisan.
- **Ekspor Data:** *Download* hasil ekstraksi ke dalam format **Excel (XLS)**, **CSV**, atau **JSON**.
- **Performa Tinggi:** Dibangun di atas infrastruktur *Edge* (Cloudflare Pages + D1 + R2).

## 🛠 Tech Stack
- **Framework:** SvelteKit (TypeScript Strict)
- **Database:** Cloudflare D1 via Drizzle ORM
- **Storage:** Cloudflare R2
- **AI Engine:** Google Gemini 2.5 Flash (`@google/genai`)
- **Styling:** TailwindCSS v4 + Custom Design Tokens
- **Validasi:** Zod

---

## 🔒 Keamanan & Privasi
Sesuai dengan ketentuan PDP (Pelindungan Data Pribadi) dan praktik keamanan standar:
- **Privacy Notice:** Dokumen yang diunggah dikirim ke Google Gemini untuk diproses. Pastikan Anda tidak mengunggah dokumen dengan informasi pribadi yang sangat sensitif. Aplikasi ini mengimplementasikan opsi "Hapus Dokumen" yang akan melakukan *hard-delete* baik dari database (D1) maupun penyimpanan (R2).
- **Upload Security:** Validasi MIME type dilakukan bukan hanya dari ekstensi, melainkan dari **Magic Bytes** (misal membaca `%PDF-` atau `FF D8 FF`). File SVG dan eksekusi skrip dilarang sepenuhnya (max 10MB).
- **Serving Security:** File disajikan via API internal `/api/files/[key]` menggunakan header `X-Content-Type-Options: nosniff` dan `Content-Disposition: inline`.

---

## 💻 Menjalankan di Lokal (Local Development)

### 1. Kebutuhan Sistem
- Node.js (v18+)
- Akun Cloudflare (dengan Wrangler CLI yang sudah terotentikasi: `npx wrangler whoami`)

### 2. Setup Project
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .dev.vars
# Isi GEMINI_API_KEY di dalam .dev.vars dengan API key Gemini Anda
```

### 3. Setup Database (Cloudflare D1 Lokal)
```bash
# Generate schema Drizzle
npm run db:generate

# Apply migrasi ke database lokal (development)
npx wrangler d1 migrations apply smartdoc --local
```

### 4. Jalankan Development Server
```bash
# Jalankan Vite server
npm run dev
```
