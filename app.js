const API_URL = "https://script.google.com/macros/s/AKfycbwRIvKg9gwhuH5RXxp3LrGq5OeSiJTeDcDoT3OnGRTKaJIOgboa2XOujDnD2VUUBYbC/exec";

// =====================
// SHOW / HIDE FORM
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

// default
window.onload = () => showForm("masuk");

// =====================
// LOAD DATA
// =====================
function loadData(type) {
  fetch(`${API_URL}?type=${type}`)
    .then(res => res.json())
    .then(renderTable);
}

// =====================
// FILE → BASE64
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
async function submitSuratMasuk() {
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

  submitData("surat_masuk", payload);
}

// =====================
// SUBMIT SURAT KELUAR
// =====================
async function submitSuratKeluar() {
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

  submitData("surat_keluar", payload);
}

// =====================
function submitData(type, payload) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ type, payload })
  })
    .then(res => res.json())
    .then(renderTable);
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
