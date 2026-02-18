const API_URL = "https://script.google.com/macros/s/AKfycbyi1RJ0OkBorU09DGiDextAu1Si93VDxbMYvzUY6ktGgdfrK4LpH61ZBfzhC2knkHMg/exec";

// LOAD AWAL
window.onload = () => loadData("surat_masuk");

function loadData(type) {
  fetch(`${API_URL}?type=${type}`)
    .then(res => res.json())
    .then(renderTable);
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

// =======================
// SURAT MASUK
// =======================
async function submitSuratMasuk() {
  const file = document.getElementById("masuk_file").files[0];
  let fileData = file ? await toBase64(file) : null;

  const payload = {
    id: Date.now(),
    nomor: document.getElementById("masuk_nomor").value,
    tanggal: document.getElementById("masuk_tanggal").value,
    pengirim: document.getElementById("masuk_pengirim").value,
    perihal: document.getElementById("masuk_perihal").value,
    catatan: document.getElementById("masuk_catatan").value,
    fileName: file ? file.name : "",
    fileData: fileData
  };

  submitData("surat_masuk", payload);
}

// =======================
// SURAT KELUAR
// =======================
async function submitSuratKeluar() {
  const file = document.getElementById("keluar_file").files[0];
  let fileData = file ? await toBase64(file) : null;

  const payload = {
    id: Date.now(),
    nomor: document.getElementById("keluar_nomor").value,
    tanggal: document.getElementById("keluar_tanggal").value,
    tujuan: document.getElementById("keluar_tujuan").value,
    perihal: document.getElementById("keluar_perihal").value,
    catatan: document.getElementById("keluar_catatan").value,
    fileName: file ? file.name : "",
    fileData: fileData
  };

  submitData("surat_keluar", payload);
}

// =======================
function submitData(type, payload) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ type, payload })
  })
    .then(res => res.json())
    .then(renderTable);
}

function renderTable(data) {
  const table = document.getElementById("table");
  table.innerHTML = "";

  if (!data.length) return;

  const headers = Object.keys(data[0]);

  table.innerHTML += `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

  data.forEach(row => {
    table.innerHTML += `<tr>${headers.map(h => `<td>${row[h] || ""}</td>`).join("")}</tr>`;
  });
}
