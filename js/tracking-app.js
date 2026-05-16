/**
 * Tugas Praktik 2 - Aplikasi SITTA UT (Tracking Logistik DO)
 * Perbaikan: Optimasi Pencarian Case-Insensitive & Anti-Spasi
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
          // Bersihkan input pencarian dari spasi di depan/belakang dan ubah ke kapital
          const searchKey = this.inputNoDO.trim().toUpperCase();
          
          if (!searchKey) return null;

          // Cari kecocokan key di dalam objek tracking secara aman
          for (let key in this.tracking) {
              if (key.trim().toUpperCase() === searchKey) {
                  return this.tracking[key];
              }
          }
          return null;
      }
  },
  methods: {
      // FUNGSI AKSI MEMPROSES INPUT FORM DO BARU
      tambahDoBaru() {
          // Bersihkan input Nomor DO dari spasi yang tidak disengaja
          const keyBaru = this.formDO.noDO.trim().toUpperCase();

          if (!keyBaru) {
              alert("Nomor DO tidak boleh kosong!");
              return;
          }

          // Validasi apakah nomor DO sudah terdaftar sebelumnya
          if (this.tracking[keyBaru]) {
              this.alertMessage = "⚠️ Gagal: Nomor DO " + keyBaru + " sudah terdaftar di sistem SITTA UT!";
              this.showAlert = true;
              setTimeout(() => { this.showAlert = false; }, 3000);
              return;
          }

          // Dapatkan tanggal hari ini secara dinamis
          const hariIni = new Date().toISOString().split('T')[0];
          const jamIni = new Date().toTimeString().split(' ')[0];

          // Gunakan Vue.set ($set) agar objek baru yang masuk benar-benar reaktif dan langsung dikenali oleh Computed
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

          // Munculkan pesan sukses
          this.alertMessage = "🎉 Sukses: Nomor DO " + keyBaru + " atas nama " + this.formDO.nama + " berhasil didaftarkan!";
          this.showAlert = true;
          setTimeout(() => { this.showAlert = false; }, 3500);

          // Otomatis masukkan nomor DO yang baru dibuat ke kolom pencarian agar user langsung melihat hasilnya
          this.inputNoDO = keyBaru;

          // Reset isi form kembali kosong
          this.formDO.noDO = "";
          this.formDO.nim = "";
          this.formDO.nama = "";
          this.formDO.ekspedisi = "";
          this.formDO.paket = "";
          this.formDO.total = "";
      }
  }
});