const API_URL = "https://script.google.com/macros/s/AKfycbwRIvKg9gwhuH5RXxp3LrGq5OeSiJTeDcDoT3OnGRTKaJIOgboa2XOujDnD2VUUBYbC/exec";

// =====================
// SHOW FORM
// =====================
function showForm(type) {
  const formMasuk = document.getElementById("formMasuk");
  const formKeluar = document.getElementById("formKeluar");

  const btnMasuk = document.getElementById("btnMasuk");
  const btnKeluar = document.getElementById("btnKeluar");

  if (type === "masuk") {
    formMasuk.classList.remove("hidden");
    formKeluar.classList.add("hidden");
    btnMasuk.classList.add("active");
    btnKeluar.classList.remove("active");
    loadData("surat_masuk");
  } else {
    formKeluar.classList.remove("hidden");
    formMasuk.classList.add("hidden");
    btnKeluar.classList.add("active");
    btnMasuk.classList.remove("active");
    loadData("surat_keluar");
  }
}

window.onload = () => showForm("masuk");

// =====================
// TOAST
// =====================
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2000);
}

// =====================
// RESET FORM
// =====================
function resetForm(prefix) {
  document.getElementById(`${prefix}_nomor`).value = "";
  document.getElementById(`${prefix}_tanggal`).value = "";
  document.getElementById(`${prefix}_perihal`).value = "";
  document.getElementById(`${prefix}_catatan`).value = "";
  document.getElementById(`${prefix}_file`).value = "";

  if (prefix === "masuk") {
    document.getElementById("masuk_pengirim").value = "";
  } else {
    document.getElementById("keluar_tujuan").value = "";
  }
}

// =====================
function loadData(type) {
  fetch(`${API_URL}?type=${type}`)
    .then(res => res.json())
    .then(renderTable);
}

// =====================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

// =====================
// SUBMIT SURAT MASUK
// =====================
async function submitSuratMasuk(event) {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = "Mengirim...";

  const file = document.getElementById("masuk_file").files[0];
  const fileData = file ? await toBase64(file) : null;

  const payload = {
    id: Date.now(),
    nomor: document.getElementById("masuk_nomor").value,
    tanggal: document.getElementById("masuk_tanggal").value,
    pengirim: document.getElementById("masuk_pengirim").value,
    perihal: document.getElementById("masuk_perihal").value,
    catatan: document.getElementById("masuk_catatan").value,
    fileName: file ? file.name : "",
    fileData
  };

  submitData("surat_masuk", payload, () => {
    showToast("Surat masuk berhasil dikirim");
    resetForm("masuk");
    btn.disabled = false;
    btn.textContent = "Simpan Surat Masuk";
  });
}

// =====================
// SUBMIT SURAT KELUAR
// =====================
async function submitSuratKeluar(event) {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = "Mengirim...";

  const file = document.getElementById("keluar_file").files[0];
  const fileData = file ? await toBase64(file) : null;

  const payload = {
    id: Date.now(),
    nomor: document.getElementById("keluar_nomor").value,
    tanggal: document.getElementById("keluar_tanggal").value,
    tujuan: document.getElementById("keluar_tujuan").value,
    perihal: document.getElementById("keluar_perihal").value,
    catatan: document.getElementById("keluar_catatan").value,
    fileName: file ? file.name : "",
    fileData
  };

  submitData("surat_keluar", payload, () => {
    showToast("Surat keluar berhasil dikirim");
    resetForm("keluar");
    btn.disabled = false;
    btn.textContent = "Simpan Surat Keluar";
  });
}

// =====================
function submitData(type, payload, callback) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ type, payload })
  })
    .then(res => res.json())
    .then(data => {
      renderTable(data);
      callback();
    });
}

// =====================
function renderTable(data) {
  const table = document.getElementById("table");
  table.innerHTML = "";

  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);

  table.innerHTML += `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

  data.forEach(row => {
    table.innerHTML += `
      <tr>${headers.map(h => `<td>${row[h] || ""}</td>`).join("")}</tr>
    `;
  });
}
