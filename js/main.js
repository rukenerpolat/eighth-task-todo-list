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

// ADD NOTE
applyBtn.addEventListener('click', () => {
  try {
    const inputValue = document.getElementById('myInput').value.trim();

    const priorityRadio = document.querySelector('input[name="priority"]:checked');

    if (!priorityRadio) {
      alert('Please select a priority!');
      return;
    }

    const priority = priorityRadio.value;

    if (inputValue !== '') {
      todos.push({ text: inputValue, completed: false, priority: priority });
      document.getElementById('myInput').value = '';
      const checkedRadio = document.querySelector('input[name="priority"]:checked');
      if (checkedRadio) checkedRadio.checked = false;

      renderNotes();
      showModal.classList.remove('active');
      overlay.classList.remove('active');
    } else {
      alert('You must write something!');
    }
  } catch (err) {
    alert('An unexpected error occurred. Please try again!');
    console.error(err);
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

// LIST RENDERING
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
                <p class="${todo.completed ? "checked" : ""}">${todo.text}</p>
                <span class="priority-label ${todo.priority.toLowerCase()}">${todo.priority}</span>
              </div>
              <div class="input-button">
                <button class="trash" data-index="${index}"></button>
              </div>
            </div>
          </li>`;
      })
      .join('');

    // DELETE BUTTONS
    const trashButtons = document.querySelectorAll('.trash');
    trashButtons.forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation(); // bubbling 
        const indexToDelete = event.target.dataset.index;
        todos.splice(indexToDelete, 1);
        filterTodos();
      });
    });

    // CHECKBOXES
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', event => {
        event.stopPropagation();
        const index = event.target.dataset.index;
        todos[index].completed = event.target.checked;
        filterTodos();
      });
    });
  }
}

// Toggle "checked" when clicking on the <p> element inside list items
var list = document.querySelector('ul');
list.addEventListener(
  'click',
  function (e) {
    if (e.target.tagName === 'P') {
      e.target.classList.toggle('checked');
    }
  },
  false
);

// SEARCH
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  filterTodos();
});

searchInput.addEventListener('input', () => {
  filterTodos();
});

// FILTER & SORT FUNCTION
function filterTodos() {
  const query = searchInput.value.trim().toLowerCase();
  let filtered = todos.filter(todo =>
    todo.text.toLowerCase().includes(query)
  );

  // Dropdown filter
  const dropdown = document.getElementById('myDropdown');
  if (dropdown) {
    const selectedFilter = dropdown.querySelector('a.selected')?.getAttribute('href') || '#all';

    if (selectedFilter === '#complate') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (selectedFilter === '#incomplate') {
      filtered = filtered.filter(todo => !todo.completed);
    }
    // else #all : no filter
  }

  // PRIORITY
  const priorityOrder = { düşük: 1, orta: 2, yüksek: 3 };
  filtered.sort((a, b) => {
    return priorityOrder[a.priority.toLowerCase()] - priorityOrder[b.priority.toLowerCase()];
  });

  renderNotes(filtered);
}

// DROPDOWN MENU FUNCTIONALITY
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// Dropdown link click event to set selected filter and re-filter
const dropdownLinks = document.querySelectorAll('#myDropdown a');
dropdownLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    dropdownLinks.forEach(l => l.classList.remove('selected'));
    link.classList.add('selected');

    // Change the text on the dropdown button
    const dropbtn = document.querySelector('.dropbtn');
    dropbtn.childNodes[0].nodeValue = link.textContent;

    filterTodos();
  });
});

renderNotes();