/**
 * Tugas Praktik 2 - Aplikasi SITTA UT (Tracking Logistik DO)
 * Perbaikan: Validasi Ketat Format Nomor Resi / DO Menggunakan Regex
 */

var trackingApp = new Vue({
  el: '#app',
  data: {
      judulHalaman: "Tracking Delivery Order (DO) - UT",
      inputNoDO: "", 
      showAlert: false,       
      alertMessage: "",       

      // MODEL DATA FORM UNTUK INPUT DO BARU
      formDO: {
          noDO: "",
          nim: "",
          nama: "",
          ekspedisi: "",
          paket: "",
          total: ""
      },

      // DATA ASLI DARI DOSEN
      tracking: {
        "DO2025-0001": {
          nim: "123456789",
          nama: "Rina Wulandari",
          status: "Dalam Perjalanan",
          ekspedisi: "JNE",
          tanggalKirim: "2025-08-25",
          paket: "PAKET-UT-001",
          total: 120000,
          perjalanan: [
            { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
            { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
            { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
          ]
        }
      }
  },
  computed: {
      detailDO() {
          const searchKey = this.inputNoDO.trim().toUpperCase();
          if (!searchKey) return null;

          for (let key in this.tracking) {
              if (key.trim().toUpperCase() === searchKey) {
                  return this.tracking[key];
              }
          }
          return null;
      }
  },
  methods: {
      // FUNGSI AKSI MEMPROSES INPUT FORM DO BARU DENGAN VALIDASI STRUKTUR RESI
      tambahDoBaru() {
          // 1. Bersihkan input dan ubah ke huruf kapital
          const keyBaru = this.formDO.noDO.trim().toUpperCase();

          // 2. ATURAN VALIDASI REGEX: Wajib diawali kata 'DO' baru diikuti angka/huruf/tanda minus
          // Contoh valid: DO2025-0001, DO123, DO-XYZ
          const regexFormatDO = /^DO[A-Z0-9\-]+$/;

          if (!keyBaru) {
              this.tampilkanAlert("⚠️ Error: Nomor DO/Resi tidak boleh kosong!");
              return;
          }

          // 3. Jalankan pengecekan format resi
          if (!regexFormatDO.test(keyBaru)) {
              this.tampilkanAlert("❌ Format Salah! Silakan inputkan nomor resi yang benar (Contoh: DO2025-0002). Harus diawali dengan kode 'DO'.");
              return; // Menghentikan fungsi agar data tidak tersimpan
          }

          // 4. Validasi apakah nomor DO sudah terdaftar sebelumnya
          if (this.tracking[keyBaru]) {
              this.tampilkanAlert("⚠️ Gagal: Nomor DO " + keyBaru + " sudah terdaftar di sistem!");
              return;
          }

          // Dapatkan waktu dinamis saat ini
          const hariIni = new Date().toISOString().split('T')[0];
          const jamIni = new Date().toTimeString().split(' ')[0];

          // 5. Simpan data secara reaktif jika semua validasi lolos
          this.$set(this.tracking, keyBaru, {
              nim: this.formDO.nim,
              nama: this.formDO.nama,
              status: "Manifest Baru (Gudang)",
              ekspedisi: this.formDO.ekspedisi.toUpperCase(),
              tanggalKirim: hariIni,
              paket: this.formDO.paket.toUpperCase(),
              total: this.formDO.total,
              perjalanan: [
                  { waktu: hariIni + " " + jamIni, keterangan: "Dokumen DO Berhasil Dibuat di Pusat Logistik UT" }
              ]
          });

          // Pemicu sukses & pasang ke kolom pencarian otomatis
          this.tampilkanAlert("🎉 Sukses: Nomor DO " + keyBaru + " berhasil didaftarkan!");
          this.inputNoDO = keyBaru;

          // Reset isi form kembali kosong
          this.formDO.noDO = "";
          this.formDO.nim = "";
          this.formDO.nama = "";
          this.formDO.ekspedisi = "";
          this.formDO.paket = "";
          this.formDO.total = "";
      },

      // Helper method untuk mempermudah pemanggilan alert pesan info/error
      tampilkanAlert(pesan) {
          this.alertMessage = pesan;
          this.showAlert = true;
          // Otomatis menutup alert setelah 4 detik agar user sempat membaca instruksi formatnya
          setTimeout(() => { this.showAlert = false; }, 4000);
      }
  }
});
