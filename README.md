# Struktur Proyek = Modular Architecture

Proyek ini dibagi menjadi tiga modul utama: `auth`, `user`, dan `note`, yang masing-masing menangani bagian spesifik dari aplikasi. Berikut adalah penjelasan mengapa pola modular ini dipilih.

## 1. Pemisahan Fungsionalitas

Setiap modul dirancang untuk menangani satu fitur spesifik dari aplikasi:

- `auth`: Mengelola autentikasi user (login dan registrasi).
- `user`: Mengelola read update, dan delete user
- `note`: Mengelola operasi CRUD untuk note.

Pemisahan ini memastikan kejelasan dan pengorganisasian fungsionalitas dengan rapi.

## 2. Reusability

Dengan isolating authentication logic ke dalam modul `auth`, module ini dapat digunakan kembali di module `user` dan `note` tanpa duplikasi kode (misal pada kasus guard).

## 3. Scalability

Seiring dengan perkembangan aplikasi, fitur baru dapat ditambahkan ke module terpisah tanpa mempengaruhi fungsionalitas yang sudah ada.

## 4. Maintainability

Setiap module dapat dikerjakan secara terpisah, mengurangi kompleksitas, dan memudahkan bug tracing jika ada (misal pada saat testing)
