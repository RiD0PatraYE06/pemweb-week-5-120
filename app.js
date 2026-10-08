// ==========================================
// 1. STATE DATA & INITIALIZATION
// ==========================================

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

let currentFilter = 'semua';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskMatkulSelect = document.getElementById('task-matkul');
const taskDeadlineInput = document.getElementById('task-deadline');
const errorMessage = document.getElementById('error-message');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');

// Helper untuk menyimpan array tasks ke localStorage
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper untuk menampilkan & menyembunyikan pesan error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}


// ==========================================
// 2. FUNGSI RENDER UTAMA
// ==========================================

function render() {
  taskList.innerHTML = '';

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const filteredTasks = sortedTasks.filter(task => {
    if (currentFilter === 'aktif') return !task.selesai;
    if (currentFilter === 'selesai') return task.selesai;
    return true;
  });

  const activeCount = tasks.filter(task => !task.selesai).length;
  taskCounter.textContent = `${activeCount} tugas aktif`;

  if (filteredTasks.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-state';
    emptyLi.textContent = 'Belum ada tugas yang ditambahkan.';
    taskList.appendChild(emptyLi);
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.selesai ? 'completed' : ''}`;
    li.dataset.id = task.id;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.selesai;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'task-details';

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

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = '✕';

    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}


// ==========================================
// 3. FORM TAMBAH TUGAS & VALIDASI
// ==========================================

taskForm.addEventListener('submit', function (e) {
  // Mencegah browser melakukan refresh otomatis
  e.preventDefault();

  const judul = taskTitleInput.value.trim();
  const matkul = taskMatkulSelect.value;
  const deadline = taskDeadlineInput.value;

  // Validasi 1: Judul minimal 3 karakter
  if (judul.length < 3) {
    showError('Judul tugas minimal harus 3 karakter.');
    return;
  }

  // Validasi 2: Deadline wajib diisi
  if (!deadline) {
    showError('Tanggal deadline wajib diisi.');
    return;
  }

  // Jika lolos validasi, sembunyikan pesan error yang muncul sebelumnya
  hideError();

  // Buat objek tugas baru dengan ID unik berbasis timestamp
  const newTask = {
    id: Date.now(),
    judul: judul,
    matkul: matkul,
    deadline: deadline,
    selesai: false
  };

  // Masukkan ke array state & simpan ke localStorage
  tasks.push(newTask);
  saveToLocalStorage();

  // Kosongkan form input dan render ulang daftar tugas
  taskForm.reset();
  render();
});

// Render awal
render();