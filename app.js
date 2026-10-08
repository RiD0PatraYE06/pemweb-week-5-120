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

// Helper LocalStorage
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper Pesan Error
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
  e.preventDefault();

  const judul = taskTitleInput.value.trim();
  const matkul = taskMatkulSelect.value;
  const deadline = taskDeadlineInput.value;

  if (judul.length < 3) {
    showError('Judul tugas minimal harus 3 karakter.');
    return;
  }

  if (!deadline) {
    showError('Tanggal deadline wajib diisi.');
    return;
  }

  hideError();

  const newTask = {
    id: Date.now(),
    judul: judul,
    matkul: matkul,
    deadline: deadline,
    selesai: false
  };

  tasks.push(newTask);
  saveToLocalStorage();

  taskForm.reset();
  render();
});


// ==========================================
// 4. EVENT DELEGATION PADA <ul>
// ==========================================

taskList.addEventListener('click', function (e) {
  // Cari elemen <li> terdekat yang menampung dataset.id
  const li = e.target.closest('li');
  if (!li || !li.dataset.id) return;

  const taskId = Number(li.dataset.id);

  // Case A: Jika Checkbox diklik
  if (e.target.classList.contains('task-checkbox')) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.selesai = e.target.checked;
      saveToLocalStorage();
      render();
    }
  }

  // Case B: Jika Tombol Hapus diklik
  if (e.target.classList.contains('btn-delete')) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveToLocalStorage();
    render();
  }
});

// Render awal
render();