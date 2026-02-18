const API_URL = "ISI_DENGAN_URL_WEB_APP_APPS_SCRIPT";

// LOAD DATA AWAL
window.onload = function () {
  loadData("surat_masuk");
};

// AMBIL SEMUA DATA
function loadData(type) {
  fetch(`${API_URL}?type=${type}`)
    .then(res => res.json())
    .then(renderTable);
}

// SIMPAN DATA
function submitData() {
  const type = document.getElementById("type").value;

  const payload = {
    id: Date.now(),
    nomor: document.getElementById("nomor").value,
    tanggal: document.getElementById("tanggal").value,
    perihal: document.getElementById("perihal").value,
    file: document.getElementById("file").value,
    catatan: document.getElementById("catatan").value
  };

  if (type === "surat_masuk") {
    payload.pengirim = document.getElementById("pihak").value;
  } else {
    payload.tujuan = document.getElementById("pihak").value;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ type, payload })
  })
    .then(res => res.json())
    .then(fullData => {
      // setelah perubahan → render ulang SEMUA data
      renderTable(fullData);
    });
}

// RENDER TABLE
function renderTable(data) {
  const table = document.getElementById("table");
  table.innerHTML = "";

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td>Data kosong</td></tr>";
    return;
  }

  const headers = Object.keys(data[0]);

  table.innerHTML += `
    <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
  `;

  data.forEach(row => {
    table.innerHTML += `
      <tr>${headers.map(h => `<td>${row[h] || ""}</td>`).join("")}</tr>
    `;
  });
}
