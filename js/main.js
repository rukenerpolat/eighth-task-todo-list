const todos = [];
const showModal = document.querySelector('.modal-box');
const showBtn = document.querySelector('.btn-add');
const applyBtn = document.querySelector('.apply');
const cancelBtn = document.querySelector('.cancel');
const overlay = document.querySelector('.overlay');
const todoList = document.getElementById('todoList');
const searchInput = document.querySelector('.search input');
const searchBtn = document.querySelector('.btn-search');

// MODAL OPEN
showBtn.addEventListener('click', () => {
  showModal.classList.add('active');
  overlay.classList.add('active');
});

// MODAL CLOSE
cancelBtn.addEventListener('click', () => {
  showModal.classList.remove('active');
  overlay.classList.remove('active');
});

// ADD NOT
applyBtn.addEventListener('click', () => {
  const inputValue = document.getElementById('myInput').value.trim();
  console.log('apply button');

  if (inputValue !== '') {
    todos.push({ text: inputValue, completed: false });
    document.getElementById('myInput').value = '';

    renderNotes();
    showModal.classList.remove('active');
    overlay.classList.remove('active');
  } else {
    alert('You must write something!');
  }
});

// DARK MODE
function darkMode() {
  const element = document.body;
  const icon = document.querySelector('.btn-scheme i');
  element.classList.toggle('dark-mode');

  if (element.classList.contains('dark-mode')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

// LIST
function renderNotes(list = todos) {
  if (list.length === 0) {
    todoList.innerHTML = `
      <li class="empty-state">
        <div id="imageContainer">
          <img id="image" src="/assets/illustrations/img1.png" alt="Search" />
          <h4>Empty...</h4>
        </div>
      </li>
    `;
  } else {
    todoList.innerHTML = list
      .map((todo, index) => {
        return `
          <li data-id="${index}">
            <div class="text-container">
              <div class="check-box">
                <input type="checkbox" ${todo.completed ? "checked" : ""} data-index="${index}" />
                <p>${todo.text}</p>
              </div>
              <div class="input-button">
                <button class="trash" data-index="${index}"></button>
              </div>
            </div>
          </li>`;
      })
      .join('');

    // DELETE BUTTON
    const trashButtons = document.querySelectorAll('.trash');
    trashButtons.forEach(button => {
      button.addEventListener('click', event => {
        const indexToDelete = event.target.dataset.index;
        todos.splice(indexToDelete, 1);
        filterTodos();
      });
    });

    // CHECKBOX
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', event => {
        const index = event.target.dataset.index;
        todos[index].completed = event.target.checked;
        filterTodos();
      });
    });
  }
}

// var list = document.querySelector('ul');
// list.addEventListener(
//   'click',
//   function (e) {
//     if (e.target.tagName === 'P') {
//       e.target.classList.toggle('checked');
//     }
//   },
//   false
// );

// SEARCH
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  filterTodos();
});

searchInput.addEventListener('input', () => {
  filterTodos();
});

function filterTodos() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = todos.filter(todo =>
    todo.text.toLowerCase().includes(query)
  );
  renderNotes(filtered);
}

renderNotes();