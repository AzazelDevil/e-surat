const API_URL = "https://script.google.com/macros/s/AKfycbyi1RJ0OkBorU09DGiDextAu1Si93VDxbMYvzUY6ktGgdfrK4LpH61ZBfzhC2knkHMg/exec";

window.onload = () => loadData("surat_masuk");

// ===================
// LOAD DATA
// ===================
function loadData(type) {
  fetch(`${API_URL}?type=${type}`)
    .then(res => res.json())
    .then(renderTable);
}

// ===================
// CONVERT FILE → BASE64
// ===================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// ===================
// SUBMIT DATA
// ===================
async function submitData() {
  const type = document.getElementById("type").value;
  const fileInput = document.getElementById("file_upload");
  const file = fileInput.files[0];

  let fileData = null;

  if (file) {
    fileData = await toBase64(file);
  }

  const payload = {
    id: Date.now(),
    nomor: document.getElementById("nomor").value,
    tanggal: document.getElementById("tanggal").value,
    perihal: document.getElementById("perihal").value,
    catatan: document.getElementById("catatan").value,
    fileName: file ? file.name : "",
    fileData: fileData
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
      renderTable(fullData);
    });
}

// ===================
// RENDER TABLE
// ===================
function renderTable(data) {
  const table = document.getElementById("table");
  table.innerHTML = "";

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td>Data kosong</td></tr>";
    return;
  }

  const headers = Object.keys(data[0]);

  table.innerHTML += `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;

  data.forEach(row => {
    table.innerHTML += `
      <tr>${headers.map(h => `<td>${row[h] || ""}</td>`).join("")}</tr>
    `;
  });
}
