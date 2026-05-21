# design.md — SmartDoc Visual & Interaction System

> **Untuk AI coding agent**: Sistem visual ini diturunkan dari prototipe handoff Claude Design
> (`SmartDoc.html` + `app.jsx`). Ini menggantikan design.md lama yang lebih minimalis. Tujuan:
> recreate tampilan prototipe secara presisi di SvelteKit, BUKAN menyalin struktur internal prototipe.
> Tempelkan token di §3 ke `src/app.css` (setelah `@import "tailwindcss"`). Semua komponen pakai
> CSS variable ini, bukan Tailwind palette mentah. Patuhi §13 (Don't List) dan §14 (catatan copy).

---

## 1. Filosofi

SmartDoc memadukan **ketenangan editorial** dengan **kehangatan kertas**. Bukan SaaS biru-template,
bukan juga minimalis dingin. Bayangkan majalah finance independen Indonesia: krim hangat, hijau hutan
dalam, satu aksen serif italic yang dipakai untuk momen, dan teknis mono untuk label data.

Tiga karakter penentu (kalau hilang, desain terasa generik lagi):
1. **Italic serif accent** (Instrument Serif) di headline dan angka — satu sentuhan editorial yang membedakan dari semua landing AI seragam.
2. **Mono untuk metadata** (JetBrains Mono) — label field, tag section, status teknis. Bikin terasa "alat sungguhan", bukan brosur.
3. **Palet krim + hijau hutan** yang dipertahankan dari produk asli — warm off-cream `#F4F1E6`, bukan putih dingin.

Referensi rasa: editorial fintech, Linear (presisi), Stripe (hierarki), dengan kehangatan kertas Indonesia.

---

## 2. Stack Font

Self-host via `@fontsource` (jangan Google Fonts CDN untuk produksi — privasi + kecepatan).
Prototipe pakai CDN; di SvelteKit ganti ke `@fontsource/plus-jakarta-sans`, `@fontsource/instrument-serif`, `@fontsource/jetbrains-mono`.

| Peran | Font | Variable | Dipakai untuk |
|---|---|---|---|
| Display/UI | Plus Jakarta Sans | `--font-display` | Body, heading, button, hampir semua teks |
| Serif accent | Instrument Serif (italic) | `--font-serif` | Kata aksen dalam headline, angka stat besar, nomor langkah, brand-mark |
| Mono | JetBrains Mono | `--font-mono` | Label field, section tag, status teknis, meta, tabel angka |

`font-feature-settings: "ss01", "ss02", "cv11"` di body untuk Plus Jakarta Sans yang lebih tajam.

---

## 3. Design Tokens (tempel ke app.css)

```css
:root {
  --bg: #F4F1E6;            /* krim hangat — background utama */
  --bg-elevated: #FAF8EF;   /* card, surface terangkat */
  --ink: #14160F;           /* near-black hangat */
  --ink-soft: #4A4D44;      /* body secondary */
  --ink-mute: #8A8C82;      /* label, meta, placeholder */
  --line: rgba(20, 22, 15, 0.10);     /* border default */
  --line-soft: rgba(20, 22, 15, 0.06);/* border halus */
  --brand: #1F4D34;         /* hijau hutan — accent utama */
  --brand-deep: #14361F;    /* hijau lebih gelap (hover) */
  --brand-soft: #DCE7DC;    /* tinted bg untuk badge/chip/pill */
  --accent: #E8E6A8;        /* warm chartreuse — aksen langka di area hijau */
  --warn: #C5532E;          /* terracotta — status perlu cek/error */
  --radius: 14px;
  --radius-lg: 22px;
  --shadow-sm: 0 1px 2px rgba(20,22,15,0.04), 0 1px 0 rgba(20,22,15,0.02);
  --shadow-md: 0 1px 2px rgba(20,22,15,0.04), 0 8px 24px -10px rgba(20,22,15,0.12);
  --shadow-lg: 0 1px 2px rgba(20,22,15,0.04), 0 24px 56px -22px rgba(20,22,15,0.22);
  --font-display: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-serif: "Instrument Serif", "Plus Jakarta Sans", serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* Tema gelap (forest) — opsional, hanya jika sempat */
html[data-theme="forest"] {
  --bg: #14361F;
  --bg-elevated: #1B4329;
  --ink: #F4F1E6;
  --ink-soft: #C8D2C0;
  --ink-mute: #8A9784;
  --line: rgba(244, 241, 230, 0.12);
  --line-soft: rgba(244, 241, 230, 0.06);
  --brand: #E8E6A8;          /* di tema gelap, accent jadi chartreuse */
  --brand-deep: #F4F1E6;
  --brand-soft: rgba(232, 230, 168, 0.16);
}

/* Tema putih (paper) — opsional */
html[data-theme="paper"] {
  --bg: #FAF7EC;
  --bg-elevated: #FFFDF4;
  --ink: #14160F;
}
```

### Paper grain (detail halus, jangan dilewat)
Background punya gradient radial sangat halus yang bikin terasa "kertas", bukan flat:
```css
body::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(31, 77, 52, 0.04), transparent 40%),
    radial-gradient(circle at 90% 8%, rgba(232, 230, 168, 0.18), transparent 50%);
}
```
Semua konten `position: relative; z-index: 1`.

### Aturan warna
- `--bg` krim untuk canvas; `--bg-elevated` untuk card.
- `--brand` (hijau) untuk: button primary, section-tag, badge "siap", brand-mark, link aktif.
- `--accent` (chartreuse) HANYA di dalam area hijau (mis. stat besar di kartu lead hijau, feat-tag di kartu hijau). Jangan dipakai di canvas krim — kontras buruk.
- `--warn` (terracotta) untuk badge "perlu cek" dan state error. Bukan merah default.
- Confidence/status lewat warna + dot, bukan ikon emoji penuh warna.

---

## 4. Tipografi & Skala

| Elemen | Size | Weight | Tracking | Catatan |
|---|---|---|---|---|
| Hero h1 | `clamp(46px, 6.4vw, 88px)` | 600 | -0.035em | line-height 0.98, `text-wrap: balance` |
| Hero h1 `<em>` | sama | 400 | -0.02em | **Instrument Serif italic**, warna `--brand` |
| Section title | `clamp(36px, 4.4vw, 56px)` | 600 | -0.03em | `<em>` = serif italic brand |
| CTA final h2 | `clamp(48px, 7vw, 96px)` | 600 | -0.04em | max-width 12ch |
| Feat h3 | 24px | 600 | -0.02em | |
| Step h3 | 22px | 600 | -0.02em | |
| Lede / section-sub | 16.5–18.5px | 400 | — | `--ink-soft`, line-height 1.5, `text-wrap: pretty` |
| Body | 14.5px | 400 | -0.005em | |
| Field label / section-tag | 9.5–11.5px | 500 | 0.08–0.16em UPPERCASE | **mono** |
| Stat besar (kartu lead) | 120px | 400 | -0.04em | **serif italic**, warna `--accent` |
| Step number | 64px | 400 | -0.04em | **serif italic**, warna `--brand` |

Aturan: maksimal dua weight per blok teks biasa. Angka di tabel/total `font-variant-numeric: tabular-nums`.
`<em>` di headline SELALU serif italic brand — ini signature, jangan diganti bold.

---

## 5. Spacing & Layout

- Shell: `max-width: 1320px; margin: 0 auto; padding: 0 32px` (20px di mobile ≤720px).
- Section vertical padding: 96px (desktop). Hero: `64px 0 40px`. CTA final: `120px 0 80px`.
- Grid hero: `1.05fr 0.95fr`, gap 64px. Collapse ke 1 kolom di ≤1080px.
- Spacing unit dasar kelipatan 4. Hindari nilai acak.

---

## 6. Border, Radius, Shadow

- Radius: `--radius` 14px (button-area, field, glyph), `--radius-lg` 22px (card besar: step, feat, scanner, inbox-frame). Button = pill `999px`.
- Border: 1px `--line`. Border halus: `--line-soft`. Beberapa pemisah pakai `dashed` (trust strip, upload-mini).
- Shadow: tiga level (`--shadow-sm/md/lg`). Card besar boleh `--shadow-lg` (scanner, inbox-frame). Card biasa flat dengan border; shadow muncul saat hover (`--shadow-md`).

> **Catatan divergence dari design.md lama**: versi ini SENGAJA pakai shadow & radius lebih besar
> daripada sistem minimalis sebelumnya. Itu memang karakter desain baru ini — lebih ekspresif/editorial.
> Konsistenlah dengan token di sini; jangan campur dengan aturan "no shadow / radius 6px" yang lama.

---

## 7. Komponen

### Button
- Pill (`border-radius: 999px`), height 42px (default), 50px (hero), 52px (CTA final). Padding x 18–24px. Weight 600, size 14.5–15.5px.
- `:active { transform: translateY(1px); }` — feedback fisik halus.
- **Primary**: bg `--brand`, text `--bg-elevated`. Hover → `--brand-deep`.
- **Ghost**: transparan, border `--line`, text `--ink`. Hover → border `--ink`.
- **Link**: transparan, no padding, text `--ink`. Hover → `--brand`.
- Ikon panah inline (SVG stroke 1.6) di CTA utama.

### Eyebrow (badge "Baru ·")
Pill kecil, bg `--bg-elevated`, border `--line`, dengan dot bulat `--brand-soft` berisi glyph `✦`. Size 12.5px.

### Card (step / feat)
- bg `--bg-elevated`, border `--line`, radius `--radius-lg`, padding 28px.
- Hover: `translateY(-2px sampai -3px)` + `--shadow-md`. Transition .25s ease.
- Kartu "lead" (feat utama): bg `--brand` penuh, text `--bg`, stat raksasa serif italic `--accent`.

### Section header
- `section-tag`: mono uppercase 11.5px, warna `--brand`, didahului garis pendek 22px (`::before`).
- `section-title`: besar dengan `<em>` serif italic. `section-sub`: di kanan, `--ink-soft`, max-width ~380px.
- Layout `section-head`: flex, judul kiri + sub kanan, `align-items: end`.

### Badge status (untuk inbox & confidence)
- Pill `999px`, 11px, weight 600, dengan dot `::before` (6px, currentColor).
- **Siap/verified**: bg `--brand-soft`, text `--brand`.
- **Perlu cek/review**: bg `rgba(197,83,46,0.12)`, text `--warn`.
- **Tinjau/pending**: bg `rgba(20,22,15,0.06)`, text `--ink-soft`.

### Confidence field (inti produk — sesuaikan dengan data nyata)
Di prototipe, tiap field punya label mono + persen confidence di kanan (`field-label .conf`, warna `--brand`).
Untuk app nyata, petakan ke confidence kita (`high/medium/low`):
- Tampilkan persen ATAU dot warna di pojok label field.
- `high` → tenang (brand soft / tanpa highlight). `medium` → dotted underline `--warn` pada value. `low` → wavy underline `--warn` + dot.
- Field item (line items) pakai bg `--brand-soft`, value `--brand-deep`, baris mono.

```css
.conf-medium { text-decoration: underline dotted var(--warn); text-underline-offset: 3px; }
.conf-low    { text-decoration: underline wavy var(--warn); text-underline-offset: 3px; }
```

### Tabel inbox
- Grid kolom: checkbox / vendor+thumb / tanggal+kategori / total (kanan) / status / aksi.
- Header: mono uppercase 10.5px `--ink-mute`, bg `--bg-elevated`, border-bottom `--line`.
- Row: border-bottom `--line-soft`, hover bg halus. Total: weight 600 + `tabular-nums`, rata kanan.
- Thumbnail dokumen: 28×36px dengan garis horizontal repeating (mock preview).
- Checkbox custom: kotak 16px radius 4px; `.on` → bg `--brand` + ceklis `✓`.
- **No zebra striping.**

---

## 8. Hero Scanner (showcase animasi — opsional tapi berkesan)

Demo visual di kanan hero: kartu `scanner` (radius-lg, shadow-lg) berisi dua kolom — struk termal kiri,
field hasil ekstraksi kanan.

- **Struk**: kertas `#FFFDF4`, mono, dengan `clip-path` polygon zig-zag di atas (efek robekan kertas termal), barcode repeating-linear-gradient di bawah.
- **Scan line**: garis 2px gradient brand yang bergerak turun (`@keyframes scan`, 3.6s loop) dengan glow.
- **Field rise-in**: tiap field muncul berurutan (`@keyframes rise`, delay 0.6s/1.0s/1.4s/...) — mensimulasikan ekstraksi real-time.
- **Pill "Memproses"**: dot `pulse` animasi.

Untuk landing produksi: animasi ini boleh statis (tanpa loop) jika mengganggu; hormati `prefers-reduced-motion`.

---

## 9. Motion

- Durasi: 120ms (state/hover warna), 250ms (card hover transform), animasi demo lebih panjang (scan 3.6s, bar 2.4s, rise berurutan).
- Easing: `ease` / `cubic-bezier(0.4,0,0.2,1)`.
- Hover card: `translateY` kecil + shadow. Button: `translateY(1px)` saat active.
- **Wajib**: bungkus animasi loop (scan, pulse, bar, rise) dalam `@media (prefers-reduced-motion: no-preference)`. Pengguna yang minta reduce motion lihat state akhir statis.

---

## 10. Struktur Halaman Landing (urutan)

1. **Nav** — brand-mark (kotak hijau, huruf "S" serif italic) + SmartDoc; links (Cara Kerja, Fitur, Inbox, Harga, Dokumentasi); CTA (Masuk link + "Coba gratis →" primary).
2. **Hero** — eyebrow, headline dengan `<em>` serif, lede, dua CTA, meta strip (avatar stack + "4.200+ tim" + "Akurasi 99.2%"), scanner demo di kanan.
3. **Trust strip** — label mono uppercase + 5 logo fiktif (variasi serif/sans/mono). Border dashed atas-bawah.
4. **How it works** (`#how`) — 3 step card dengan nomor serif italic + visual mikro (upload-mini, processing bars, mini-table).
5. **Features** (`#features`) — grid 5 kartu; kartu "lead" hijau besar dengan stat 99.2%; sisanya: multi-format (chips), bahasa (chips), ekspor (rows), privasi (lock).
6. **Inbox preview** (`#inbox`) — split: copy + checklist kiri, frame tabel inbox kanan dengan tabs & badge.
7. **Final CTA** — headline raksasa "Berhenti retype resi." + 2 button.
8. **Footer** — brand + 3 kolom link (Produk, Perusahaan, Hukum) + foot-bottom mono.

Untuk take-home, landing tidak harus selengkap ini. Prioritas: Nav + Hero (dengan scanner) + How it works + Footer
sudah cukup memberi kesan. Inbox preview bisa dilewati karena inbox asli ada di `/inbox`.

---

## 11. Responsive

- ≤1080px: hero jadi 1 kolom; features `1fr 1fr` (kartu lead span 2); inbox-wrap 1 kolom.
- ≤720px: shell padding 20px; nav-links disembunyikan (butuh menu mobile sederhana); steps & features 1 kolom; trust 3 kolom; footer 2 kolom.

---

## 12. Accessibility

- Kontras WCAG AA. Cek `--ink-soft` di `--bg` (lolos), dan `--accent` chartreuse JANGAN dipakai sebagai teks di krim (kontras gagal — hanya di area hijau).
- Semantic: `<nav>`, `<header>`, `<section>`, `<footer>`, `<button>` vs `<a>`.
- Focus visible: outline 1px `--ink` offset 2px (jangan `outline:none`).
- `prefers-reduced-motion`: matikan animasi loop.
- Alt text untuk preview; label untuk input.

---

## 13. Don't List

1. Jangan ganti `<em>` headline dari serif italic jadi bold — itu signature desain.
2. Jangan pakai `--accent` chartreuse sebagai teks di background krim (kontras gagal).
3. Jangan tambah warna di luar token (no biru/ungu/gradient pelangi).
4. Jangan pakai emoji sebagai ikon produk (kecuali 🔒/☕ yang sudah ada di prototipe sebagai aksen kecil — pakai hemat).
5. Jangan flat-kan semua: paper grain, shadow berlapis, dan radius besar adalah karakter — pertahankan.
6. Jangan pakai animasi loop tanpa `prefers-reduced-motion` guard.
7. Jangan pakai Google Fonts CDN di produksi — self-host.
8. Jangan render prototipe lalu screenshot untuk "menebak" style — semua angka ada di token.

---

## 14. Catatan Penting soal Copy (untuk konteks take-home)

Prototipe ini berisi banyak **copy marketing fiktif** yang TIDAK boleh diklaim sebagai fakta di submission take-home:
- "Akurasi 99.2% diukur pada 50.000+ resi" — angka karangan.
- "4.200+ tim sudah pakai" — karangan.
- Logo trust (Kanara, Padipadi, dll) — fiktif.
- "ISO 27001", "Server Jakarta", "AES-256" — klaim keamanan yang belum tentu benar.
- Integrasi (Xero, Mekari, Sheets auto-sync) — belum dibangun.

**Untuk take-home**: gunakan SISTEM VISUAL (warna, font, layout, komponen, scanner) sepenuhnya, tapi
**ganti copy yang mengklaim metrik/pelanggan/sertifikasi** dengan yang jujur, atau hapus. Misalnya:
hero meta cukup "Diproses via Google Gemini" tanpa angka pengguna; hapus trust strip logo fiktif; ganti
"99.2% akurat" dengan deskripsi kapabilitas tanpa angka spesifik. Penilai menghargai kejujuran;
mengklaim 50.000 resi pada produk yang baru dibuat = red flag.

Landing produksi yang dipakai untuk demo sebaiknya mengarah ke fungsi nyata (`/upload`, `/inbox`),
bukan tombol marketing yang tidak melakukan apa-apa.

---

## 15. Mapping ke Implementasi SvelteKit

- Token (§3) → `src/app.css`. Tema via `data-theme` di `<html>` (opsional toggle).
- Font → `@fontsource` di-import di `src/routes/+layout.svelte` atau app.css.
- Komponen prototipe (Nav, Hero, Steps, Features, InboxSection, Footer) → komponen Svelte di `src/lib/components/landing/`.
- Scanner demo → komponen `HeroScanner.svelte` (animasi CSS murni; data dummy boleh hardcoded untuk demo).
- Tweaks panel di prototipe (tema/aksen/headline switcher) **TIDAK perlu** diport ke produksi — itu alat
  eksplorasi desain, bukan fitur produk. Pilih satu konfigurasi final (default: tema krim, aksen forest, headline italic-accent).
- Confidence/status badge (§7) dipakai ulang di halaman `/inbox` dan `/docs/[id]` yang sebenarnya, dengan data nyata dari D1.