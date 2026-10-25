# Phase 5: Shopping Cart & Checkout Flow

## 1. Overview & Tujuan
Fase ini berfokus pada alur konversi transaksi pelanggan (*customer checkout journey*) yang menghubungkan katalog produk (Fase 4) dengan sistem pembayaran (Fase 6). 

Tujuan utama:
1. Menyimpan data keranjang belanja secara lokal di browser pelanggan menggunakan **Zustand** dengan persistensi `localStorage`.
2. Menyediakan antarmuka **Slide-Over Cart Drawer** yang interaktif dan dapat diakses dari mana saja via Navbar tanpa reload.
3. Menghubungkan seluruh tombol "Tambah ke Keranjang" di Card Produk dan Halaman Detail Produk (PDP).
4. Membangun halaman **Checkout** (`/checkout`) lengkap dengan form alamat pengiriman, kalkulasi ongkos kirim, ringkasan belanja, dan validasi server-side sebelum masuk ke payment gateway.

---

## 2. Checklist Rincian Pekerjaan

### 🛒 A. State Management Keranjang (`zustand`)
- [ ] Instalasi dependensi: `npm install zustand`
- [ ] Buat file store: `src/store/use-cart-store.ts`
- [ ] Tipe data `CartItem`:
  ```ts
  export interface CartItem {
    id: string; // product id
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    imageUrl: string;
    quantity: number;
    maxStock: number;
    category?: string;
  }
  ```
- [ ] Actions yang wajib disediakan:
  - `addItem(product, quantity?: number)`: Tambah produk atau tambah kuantitas jika sudah ada (dengan batas `maxStock`).
  - `removeItem(productId: string)`: Hapus produk dari keranjang.
  - `updateQuantity(productId: string, quantity: number)`: Ubah jumlah (`1 <= qty <= maxStock`).
  - `clearCart()`: Kosongkan isi keranjang.
  - `getTotalItems()`: Menghitung total kuantitas seluruh item.
  - `getSubtotal()`: Menghitung total harga belanjaan.
- [ ] Persistensi `localStorage` via middleware `persist`.
- [ ] Tangani *hydration mismatch* (Next.js SSR) dengan hook kustom atau flag `isHydrated`.

### 🗂️ B. Slide-Over Cart Drawer (`src/components/cart/cart-drawer.tsx`)
- [ ] Gunakan komponen `Sheet` dari `src/components/ui/sheet.tsx`.
- [ ] Hubungkan icon keranjang di `src/components/layout/navbar.tsx` ke Cart Drawer.
- [ ] Buat badge jumlah item di Navbar dinamis sesuai `getTotalItems()`.
- [ ] Fitur dalam Drawer:
  - Header: Judul "Keranjang Belanja" & total item.
  - Daftar Item: Thumbnail gambar, nama produk, kategori, harga satuan, kontrol kuantitas (+/-), dan tombol hapus (icon sampah).
  - Footer Ringkasan: Rincian Subtotal Rupiah dan tombol CTA **"Lanjut ke Checkout"** (mengarahkan ke `/checkout` dan menutup drawer).
  - Tampilan Keranjang Kosong (*Empty State*): Icon belanja kosong, teks ajakan, dan tombol "Mulai Belanja" menuju `/products`.

### 🔗 C. Integrasi Tombol "Tambah ke Keranjang"
- [ ] Integrasikan `useCartStore` pada `src/components/products/product-card.tsx`.
- [ ] Integrasikan `useCartStore` pada `src/app/products/[slug]/product-purchase-box.tsx`.
- [ ] Berikan feedback visual notifikasi Toast (`sonner`) setiap kali produk berhasil dimasukkan.

### 💳 D. Halaman Checkout (`src/app/checkout/page.tsx`)
- [ ] **Proteksi Autentikasi**: Wajib login. Jika tamu (*guest*), redirect ke `/login?redirectTo=/checkout`.
- [ ] **Formulir Pengiriman (Kolom Kiri)**:
  - Nama Penerima, Nomor Telepon/WhatsApp, Alamat Lengkap, Kota/Kabupaten, Kode Pos, dan Catatan Tambahan.
  - Auto-fill data awal dari tabel `profiles` pengguna yang sedang login.
  - Pilihan Kurir & Layanan Pengiriman:
    - *Reguler (2-3 hari)*: Rp 15.000 (Otomatis Rp 0 dengan kode voucher promo).
    - *Express (1 hari)*: Rp 25.000.
    - *Instant Delivery*: Rp 35.000.
- [ ] **Ringkasan Pesanan (Kolom Kanan)**:
  - List item yang akan dibeli (gambar mini, judul, qty, subtotal).
  - Rincian biaya: Subtotal Produk, Biaya Pengiriman, Potongan Voucher Diskon.
  - Input Kupon Voucher (Contoh: `STOREFIRST` memotong 20% atau diskon ongkir).
  - Total Pembayaran Akhir.
  - Tombol **"Lanjut ke Pembayaran"** (Menuju integrasi Midtrans Snap di Fase 6).

### 🛡️ E. Server Action Validasi Draft Order (`src/actions/order.ts`)
- [ ] Buat Server Action `createDraftOrder(payload)`:
  - Validasi harga di sisi server (query ulang harga asli dari tabel database `products` agar tidak bisa dimanipulasi dari client-side Inspect Element).
  - Generate nomor pesanan unik format: `ORD-YYYYMMDD-XXXX`.
  - Simpan record ke tabel `orders` dengan status `"pending"`.
  - Simpan item ke tabel `order_items`.
  - Kembalikan `orderId` dan `orderNumber` yang akan diproses oleh Midtrans di Fase 6.

---

## 3. Acceptance Criteria (Kriteria Pengujian)
1. **Persistensi Data**: Ketika browser di-refresh, isi keranjang belanja tidak hilang (`localStorage`).
2. **Proteksi Stok**: User tidak dapat memesan jumlah barang melebihi stok yang tercatat di database.
3. **Sinkronisasi Badge**: Angka pada ikon keranjang di Navbar selalu akurat dan sinkron dengan jumlah item di drawer.
4. **Validasi Harga Aman**: Perhitungan total belanja pada checkout dihitung ulang di server database, bukan hanya mengandalkan perhitungan browser.
5. **Flow Mulus**: User dapat menambah produk dari Beranda/Katalog/PDP -> buka drawer -> klik checkout -> isi alamat -> draft order tersimpan di database Supabase.
