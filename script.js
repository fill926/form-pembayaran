const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxs-9ZWLWvaVU9jBsa8Br_eaL8M082MZU30obzFg-gahQFB0dhCYrVkbuhrmZqjA4cSyA/exec';

document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('spinner');
    const fileInput = document.getElementById('buktiTransfer');
    const file = fileInput.files[0];

    if (!file) {
        alert("Harap masukkan bukti transfer!");
        return;
    }

    // Ubah tampilan tombol jadi loading
    btnText.innerText = 'Sedang Mengirim...';
    spinner.classList.remove('hidden');
    btn.disabled = true;

    const reader = new FileReader();
    reader.onload = async function(event) {
        const dataURL = event.target.result;
        const mimeType = dataURL.split(';')[0].split(':')[1];
        const base64Data = dataURL.split(',')[1];

        const payload = {
            namaPembeli: document.getElementById('namaPembeli').value,
            namaRekening: document.getElementById('namaRekening').value,
            keterangan: document.getElementById('keterangan').value,
            base64: base64Data,
            mimeType: mimeType,
            fileName: file.name
        };

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            alert("Berhasil! Data dan bukti transfer telah terkirim.");
            document.getElementById('paymentForm').reset(); 
            
        } catch (error) {
            alert("Terjadi kesalahan saat mengirim data. Pastikan koneksi internet stabil.");
            console.error(error);
        } finally {
            // Kembalikan tampilan tombol ke semula
            btnText.innerText = 'Kirim Bukti Pembayaran';
            spinner.classList.add('hidden');
            btn.disabled = false;
        }
    };
    
    reader.readAsDataURL(file); 
});