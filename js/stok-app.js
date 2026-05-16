/**
 * Tugas Praktik 2 - Aplikasi SITTA UT (Manajemen Stok Bahan Ajar)
 * Pembaruan: Penambahan Fitur Tambah Stok Komoditas Baru
 */

var stokApp = new Vue({
  el: '#app',
  data: {
      namaHalaman: "Manajemen Stok Bahan Ajar SITTA UT",
      selectedUpbjj: "",      
      selectedKategori: "",   
      showAlert: false,       
      alertMessage: "",       

      // MODEL DATA FORM UNTUK INPUT STOK BARU (FITUR BARU)
      formBaru: {
          kode: "",
          judul: "",
          kategori: "",
          upbjj: "",
          lokasiRak: "",
          harga: "",
          qty: "",
          safety: 15, // Batas aman default untuk item baru
          catatanHTML: "<span>Data Input Baru</span>"
      },

      // DATA ASLI DARI DOSEN
      upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
      kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
      pengirimanList: [
        { kode: "REG", nama: "Reguler (3-5 hari)" },
        { kode: "EXP", nama: "Ekspres (1-2 hari)" }
      ],
      paket: [
        { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
        { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
      ],
      stok: [
        {
          kode: "EKMA4116",
          judul: "Pengantar Manajemen",
          kategori: "MK Wajib",
          upbjj: "Jakarta",
          lokasiRak: "R1-A3",
          harga: 65000,
          qty: 28,
          safety: 20,
          catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
        },
        {
          kode: "EKMA4115",
          judul: "Pengantar Akuntansi",
          kategori: "MK Wajib",
          upbjj: "Jakarta",
          lokasiRak: "R1-A4",
          harga: 60000,
          qty: 7,
          safety: 15,
          catatanHTML: "<strong>Cover baru</strong>"
        },
        {
          kode: "BIOL4201",
          judul: "Biologi Umum (Praktikum)",
          kategori: "Praktikum",
          upbjj: "Surabaya",
          lokasiRak: "R3-B2",
          harga: 80000,
          qty: 12,
          safety: 10,
          catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
        },
        {
          kode: "FISIP4001",
          judul: "Dasar-Dasar Sosiologi",
          kategori: "MK Pilihan",
          upbjj: "Makassar",
          lokasiRak: "R2-C1",
          harga: 55000,
          qty: 2,
          safety: 8,
          catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
        }
      ]
  },

  computed: {
      filteredStok() {
          return this.stok.filter(item => {
              const matchUpbjj = this.selectedUpbjj ? item.upbjj === this.selectedUpbjj : true;
              const matchKategori = this.selectedKategori ? item.kategori === this.selectedKategori : true;
              return matchUpbjj && matchKategori;
          });
      }
  },

  methods: {
      restockBuku(kodeBuku) {
          const buku = this.stok.find(item => item.kode === kodeBuku);
          if (buku) {
              buku.qty += 10; 
          }
      },

      // FUNGSI AKSI UNTUK INPUT DATA BARU (FITUR BARU)
      tambahStokBaru() {
          // 1. Cek apakah kode buku sudah pernah terdaftar di tabel agar tidak duplikat
          const cekDuplikat = this.stok.some(item => item.kode.toUpperCase() === this.formBaru.kode.toUpperCase());
          
          if (cekDuplikat) {
              this.alertMessage = "⚠️ Error: Kode Modul " + this.formBaru.kode.toUpperCase() + " sudah ada di sistem!";
              this.showAlert = true;
              setTimeout(() => { this.showAlert = false; }, 3000);
              return;
          }

          // 2. Memasukkan data objek baru dari form ke dalam array list stok utama secara reaktif
          this.stok.push({
              kode: this.formBaru.kode.toUpperCase(),
              judul: this.formBaru.judul,
              kategori: this.formBaru.kategori,
              upbjj: this.formBaru.upbjj,
              lokasiRak: this.formBaru.lokasiRak.toUpperCase(),
              harga: this.formBaru.harga,
              qty: this.formBaru.qty,
              safety: this.formBaru.safety,
              catatanHTML: this.formBaru.catatanHTML
          });

          // 3. Tampilkan pesan sukses lewat Watcher Alert
          this.alertMessage = "🎉 Sukses: " + this.formBaru.judul + " berhasil ditambahkan ke Gudang!";
          this.showAlert = true;
          setTimeout(() => { this.showAlert = false; }, 3000);

          // 4. Reset isi kotak form kembali kosong setelah berhasil disimpan
          this.formBaru.kode = "";
          this.formBaru.judul = "";
          this.formBaru.kategori = "";
          this.formBaru.upbjj = "";
          this.formBaru.lokasiRak = "";
          this.formBaru.harga = "";
          this.formBaru.qty = "";
      }
  },

  watch: {
      selectedUpbjj(newVal) {
          if(newVal) {
              this.alertMessage = "SITTA UT: Menampilkan wilayah distribusi UPBJJ " + newVal;
          } else {
              this.alertMessage = "SITTA UT: Menampilkan data logistik seluruh wilayah UPBJJ";
          }
          this.showAlert = true;
          setTimeout(() => { this.showAlert = false; }, 2500);
      }
  }
});