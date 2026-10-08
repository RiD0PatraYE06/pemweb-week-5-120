// ==========================================
// 1. STATE DATA & INITIALIZATION
// ==========================================

// Ambil data dari localStorage jika ada, atau gunakan array dummy awal untuk pengujian
let tasks = JSON.parse(localStorage.getItem('tasks')) || [
  {
    id: 1,
    judul: 'Lab 10 event delegation',
    matkul: 'Pemrograman Web',
    deadline: '2026-10-08',
    selesai: false
  },
  {
    id: 2,
    judul: 'ERD sistem perpustakaan',
    matkul: 'Basis Data',
    deadline: '2026-10-12',
    selesai: true
  }
];

// State untuk menyimpan filter yang sedang aktif
let currentFilter = 'semua';

// DOM Elements
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');


// ==========================================
// 2. FUNGSI RENDER UTAMA
// ==========================================

function render() {
  // A. Bersihkan daftar tugas di UL sebelum merender ulang
  taskList.innerHTML = '';

  // B. Bonus: Urutkan data berdasarkan deadline terdekat
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // C. Filter data sesuai state filter saat ini
  const filteredTasks = sortedTasks.filter(task => {
    if (currentFilter === 'aktif') return !task.selesai;
    if (currentFilter === 'selesai') return task.selesai;
    return true; // 'semua'
  });

  // D. Perbarui counter "N tugas aktif"
  const activeCount = tasks.filter(task => !task.selesai).length;
  taskCounter.textContent = `${activeCount} tugas aktif`;

  // E. Tampilkan pesan jika daftar kosong
  if (filteredTasks.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-state';
    emptyLi.textContent = 'Belum ada tugas yang ditambahkan.';
    taskList.appendChild(emptyLi);
    return;
  }

  // F. Render elemen tugas satu per satu
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.selesai ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // Container Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';

    // Checkbox Selesai
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.selesai;

    // Details (Judul & Meta)
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'task-details';

    // KEAMANAN (XSS): Gunakan textContent untuk teks dari user
    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title-text';
    titleSpan.textContent = task.judul;

    const metaSpan = document.createElement('span');
    metaSpan.className = 'task-meta';
    metaSpan.textContent = `${task.matkul} · deadline ${task.deadline}`;

    detailsDiv.appendChild(titleSpan);
    detailsDiv.appendChild(metaSpan);

    infoDiv.appendChild(checkbox);
    infoDiv.appendChild(detailsDiv);

    // Tombol Hapus (Silang)
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = '✕';

    // Gabungkan ke elemen LI
    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);

    // Masukkan LI ke UL
    taskList.appendChild(li);
  });
}

// Jalankan render awal saat aplikasi pertama kali dimuat
render();