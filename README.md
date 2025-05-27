# Minerva Pro Audio - Website E-commerce Sistem Audio

## Deskripsi Aplikasi Web

Minerva Pro Audio adalah sebuah platform e-commerce yang dirancang untuk penjualan berbagai macam peralatan sistem audio berkualitas tinggi. Website ini dibangun sebagai bagian dari Tugas Besar Mata Kuliah Pemrograman Web Semester Genap 2024/2025 di Institut Teknologi Sumatera. [cite: 1]

Aplikasi frontend ini dibangun menggunakan React JS dan menampilkan fungsionalitas penuh untuk penjelajahan produk, manajemen keranjang belanja, autentikasi pengguna, serta manajemen profil. Untuk sisi administrasi, terdapat fitur untuk mengelola data produk (Create, Read, Update, Delete). Saat ini, semua operasi data di frontend disimulasikan melalui *service layer* yang berinteraksi dengan data mock atau browser `localStorage` untuk persistensi, mempersiapkan integrasi dengan backend sesungguhnya.

## Link Repositori GitHub

[https://github.com/fransiskus-121140010/tugas_besar_pemrograman_web]

## Teknologi & Dependensi Utama (Frontend)

* **React JS (v19.1.0):** Library JavaScript untuk membangun antarmuka pengguna.
* **React Router DOM (v7.6.0):** Untuk routing dan navigasi halaman pada Single Page Application. [cite: 1]
* **Context API:** Digunakan untuk state management global:
    * `AuthContext`: Mengelola status autentikasi dan data pengguna.
    * `ProductContext`: Mengelola daftar produk dan operasi CRUD produk.
    * `CartContext`: Mengelola item dalam keranjang belanja.
* **Axios (v1.9.0):** HTTP client berbasis Promise, dipersiapkan untuk melakukan request ke API backend. [cite: 1]
* **CSS Kustom:** Untuk styling, layout, dan implementasi desain responsif. [cite: 1]
* **React Scripts (v5.0.1):** Konfigurasi dan skrip standar dari Create React App.
* **Jest & React Testing Library:** Untuk unit testing pada contexts dan beberapa komponen UI.

## Fitur Aplikasi (Frontend)

Berikut adalah fitur-fitur utama yang telah diimplementasikan:

**Fitur Publik/Pengguna:**
1.  **Penjelajahan Produk:**
    * Melihat daftar semua produk dengan detail (gambar, nama, kategori, harga, deskripsi). [cite: 1]
    * Melihat halaman detail untuk setiap produk.
2.  **Manajemen Keranjang Belanja (Shopping Cart):**
    * Menambahkan produk ke keranjang belanja.
    * Melihat isi keranjang belanja dengan subtotal dan total keseluruhan.
    * Memperbarui kuantitas produk dalam keranjang.
    * Menghapus produk dari keranjang.
    * Mengosongkan seluruh isi keranjang.
    * Data keranjang persisten menggunakan browser `localStorage`.
3.  **Autentikasi Pengguna:**
    * Registrasi pengguna baru (disimpan ke `localStorage` melalui service mock).
    * Login pengguna terdaftar (memeriksa kredensial terhadap data di `localStorage` melalui service mock). [cite: 1]
    * Logout.
    * Sesi pengguna (status login dan data pengguna) persisten menggunakan browser `localStorage`.
4.  **Manajemen Profil Pengguna:**
    * Melihat informasi profil pengguna (nama, email).
    * Memperbarui nama profil pengguna (perubahan disimpan ke `localStorage`).
5.  **UI/UX Responsif:**
    * Tampilan aplikasi beradaptasi dengan baik untuk berbagai ukuran layar (desktop, tablet, mobile). [cite: 1]

**Fitur Administrator:**
1.  **Dashboard Admin:** Halaman utama untuk admin dengan ringkasan (misal, jumlah produk) dan navigasi.
2.  **Manajemen Produk (CRUD Lengkap):** [cite: 1]
    * **Create:** Menambahkan produk baru melalui form (nama, kategori, harga, deskripsi, URL gambar).
    * **Read:** Melihat daftar semua produk dalam format tabel yang responsif di halaman admin.
    * **Update:** Mengedit informasi produk yang sudah ada melalui form.
    * **Delete:** Menghapus produk dari sistem.
    * Semua operasi produk persisten menggunakan browser `localStorage` melalui `productService`.
3.  **Navigasi Terproteksi:**
    * Rute `/profile` hanya bisa diakses oleh pengguna yang sudah login.
    * Rute `/admin/*` hanya bisa diakses oleh pengguna yang sudah login sebagai admin.

## Arsitektur Sistem (Frontend)

Frontend Minerva Pro Audio dibangun sebagai Single Page Application (SPA) menggunakan React JS dengan arsitektur berbasis komponen.

* **Komponen Fungsional & Hooks:** UI dibangun menggunakan komponen fungsional dengan pemanfaatan React Hooks (useState, useEffect, useContext, useCallback, useNavigate, useParams).
* **Routing:** Navigasi antar halaman dikelola oleh React Router DOM (v7). Terdapat rute publik, rute terproteksi pengguna, dan rute terproteksi admin.
* **State Management:** Menggunakan React Context API untuk state global: `AuthContext`, `ProductContext`, dan `CartContext`. Data sesi login, data pengguna, data produk, dan data keranjang belanja saat ini juga dipersistenkan di browser `localStorage` untuk pengalaman pengguna yang berkelanjutan antar sesi dan setelah refresh halaman.
* **Service Layer:** Logika interaksi data (awalnya dirancang untuk API backend) diabstraksi melalui *service layer* (`productService.js`, `authService.js`). Sesuai perubahan persyaratan terbaru, service layer ini telah dimodifikasi untuk berinteraksi langsung dengan browser `localStorage` sebagai mekanisme persistensi data utama, mensimulasikan "backend lokal". Axios tetap terinstal untuk potensi integrasi API di masa depan jika diperlukan.
* **Styling:** Menggunakan CSS kustom per komponen dengan pendekatan modular dan beberapa style global untuk konsistensi. Desain responsif diimplementasikan menggunakan media queries untuk adaptasi di berbagai ukuran layar. Palet warna yang digunakan adalah `#F2F2F2`, `#EAE4D5`, `#B6B09F`, `#000000`.

## Arsitektur Sistem (Backend - Python Pyramid & PostgreSQL)

Backend direncanakan akan dibangun menggunakan Python dengan framework Pyramid, menyediakan RESTful API untuk diakses oleh frontend React.

* **Framework:** Python Pyramid.
* **Database:** PostgreSQL akan digunakan sebagai sistem database relasional.
* **API:** RESTful API akan diekspos untuk operasi CRUD pada entitas Produk dan Pengguna.
* **ORM (Object-Relational Mapper):** Direncanakan menggunakan SQLAlchemy untuk interaksi dengan database PostgreSQL, mempermudah query dan manajemen model data.
* **Migrasi Database:** Alembic akan digunakan bersama SQLAlchemy untuk mengelola evolusi skema database.
* **Struktur Proyek (Konseptual untuk `sound-system-ecommerce-backend`):**
    * `minervaproaudio_backend/`: Paket utama aplikasi.
        * `models/`: Berisi model data SQLAlchemy (misal, `product.py`, `user.py`) yang memetakan ke tabel PostgreSQL.
        * `views/`: Berisi *request handlers* (Pyramid views) untuk setiap endpoint API (misal, `product_views.py` untuk `/api/products`, `auth_views.py` untuk `/api/auth/*`).
        * `schemas/`: (Opsional) Untuk validasi data request dan serialisasi response menggunakan library seperti Colander atau Marshmallow.
        * `services/`: (Opsional) Untuk logika bisnis yang lebih kompleks.
        * `scripts/`: Termasuk `initializedb.py` untuk setup database awal.
        * `security.py`: Mengelola kebijakan autentikasi (misal, JWT atau session-based) dan otorisasi.
        * `routes.py`: Mendefinisikan pemetaan URL API ke views.
        * `__init__.py`: Fungsi utama (`main`) untuk konfigurasi dan startup aplikasi Pyramid.
    * `development.ini`, `production.ini`: File konfigurasi untuk lingkungan berbeda, termasuk string koneksi database.
    * `requirements.txt`: Daftar dependensi Python.
    * `setup.py`: Skrip setup paket Python.
* **Autentikasi Backend:** Akan mengimplementasikan mekanisme autentikasi dasar (kemungkinan berbasis token JWT atau sesi) untuk melindungi endpoint yang memerlukan login, terutama untuk operasi admin dan data pengguna. Kata sandi pengguna akan di-hash sebelum disimpan ke database.
* **Unit Testing Backend:** Fungsi-fungsi kritis di backend (logika bisnis, interaksi database, autentikasi) akan diuji untuk mencapai cakupan minimal 60%.

## Tantangan Selama Pengembangan (Frontend)
* Mengelola state global secara efektif untuk fitur seperti keranjang belanja, data produk, dan autentikasi, yang diatasi dengan penggunaan React Context API dan abstraksi melalui *service layer*.
* Memastikan persistensi data antar sesi browser dan setelah refresh halaman, yang diselesaikan dengan integrasi `localStorage` pada `ProductContext`, `CartContext`, dan `AuthContext` (serta `productService` dan `authService`).
* Menerapkan desain UI yang responsif untuk berbagai komponen kompleks seperti tabel data admin dan form, menggunakan CSS Flexbox, Grid, dan media queries.
* *(Awalnya)* Mengalami kesulitan dengan resolusi modul `react-router-dom` pada lingkungan Jest untuk beberapa test suite komponen UI, yang untuk sementara waktu beberapa tes spesifik di-skip agar fokus pada penyelesaian fitur inti menjelang tenggat waktu. (Anda bisa menyebutkan ini jika tesnya masih di-skip).
* *(Sebutkan tantangan lain yang relevan dan bagaimana Anda mengatasinya).*

## Referensi
* Dokumentasi React JS: [https://react.dev/](https://react.dev/)
* Dokumentasi React Router DOM: [https://reactrouter.com/](https://reactrouter.com/)
* Dokumentasi Axios: [https://axios-http.com/](https://axios-http.com/)
* MDN Web Docs (untuk HTML, CSS, JavaScript): [https://developer.mozilla.org/](https://developer.mozilla.org/)
* Color Hunt (untuk palet warna): [https://colorhunt.co/palette/f2f2f2eae4d5b6b09f000000](https://colorhunt.co/palette/f2f2f2eae4d5b6b09f000000)
* *(Jika Anda menggunakan struktur backend Pyramid)* Dokumentasi Pyramid: [https://trypyramid.com/](https://trypyramid.com/)
* *(Jika Anda menggunakan struktur backend Pyramid)* Dokumentasi SQLAlchemy: [https://www.sqlalchemy.org/](https://www.sqlalchemy.org/)
* *(Jika Anda menggunakan struktur backend Pyramid)* Dokumentasi PostgreSQL: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)