const notes = JSON.parse(localStorage.getItem('notes') || '[]');

let isGridView = false,
isEdit = false,
editId;

function setGridLayout() {
    const cards = document.querySelector('.notes');
    const button = document.querySelector('#layout-btn');
    cards.classList.add('grid');
    button.classList.add('list-view-icon');
    button.classList.remove('grid-view-icon');
    isGridView = true;
}

function setListLayout() {
    const cards = document.querySelector('.notes');
    const button = document.querySelector('#layout-btn');
    cards.classList.remove('grid');
    button.classList.add('grid-view-icon');
    button.classList.remove('list-view-icon');
    isGridView = false;
}

function toggleLayout() {
    !isGridView ? setGridLayout() : setListLayout();
}

function openModal() {
    const modal = document.querySelector('.modal');
    const main = document.querySelector('main');
    modal.classList.add('expanded');
    main.classList.add('overlay');
}

function closeModal() {
    const modal = document.querySelector('.modal');
    const main = document.querySelector('main');
    modal.classList.remove('expanded');
    main.classList.remove('overlay');
    if (modal.classList.contains('edit')) {
        modal.classList.remove('edit');
    }
    resetForm();
}

function resetForm() {
    const form = document.querySelector('#form');
    form.reset();
}

function handleScroll() {
    const header = document.querySelector('header');
    let scrollPrev = window.pageYOffset;
    window.addEventListener('scroll', () => {
        let scrollCur = window.pageYOffset;
        scrollPrev > scrollCur ? header.style.top = '0' : header.style.top = '-64px';
        scrollPrev = scrollCur;
    })
}

function displayNotes() {
    const cards = document.querySelector('.notes');
    let li = '';
    notes.forEach((note, i) => {
        li += `
        <li class="note" data-note="${note.id}" onclick="editNote(${i}, '${note.title}', '${note.description}')">
            <h3>${note.title}</h3>
            <p>${note.description}</p>
        </li>
        `
    })
    cards.innerHTML = li;
}

function deleteNote(noteId) {
    const confirmDelete = confirm('Are you sure you want to delete this note?');
    if (!confirmDelete) return;
    notes.splice(noteId, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    closeModal();
    displayNotes();
}

function editNote(noteId, title, description) {
    const modal = document.querySelector('.modal');
    const today = new Date();
    const format = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = today.toLocaleDateString('en-us', format);
    const h5 = document.querySelector('.modal-footer h5');
    const titleField = document.querySelector('.title-field');
    const noteField = document.querySelector('.note-field');
    isEdit = true;
    editId = noteId;
    h5.innerText = date;
    titleField.value = title;
    noteField.value = description;
    modal.classList.add('edit');
    openModal();
}

function saveNote(e) {
    e.preventDefault();
    const titleField = document.querySelector('.title-field');
    const noteField = document.querySelector('.note-field');
    let titleInput = titleField.value.trim();
    let noteInput = noteField.value.trim();
    if (titleInput || noteInput) {
        let note = {
            title: titleInput,
            description: noteInput,
            id: Math.floor(Math.random() * 100000)
        }
        if (!isEdit) {
            notes.push(note)
        } else {
            isEdit = false;
            notes[editId] = note;
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        closeModal();
        displayNotes();
    } else {
        closeModal()
    }
}

function searchNotes() {
    const note = document.querySelectorAll('.note');
    const search = document.querySelector('.search-input');
    const input = search.value.toUpperCase();
    for (let i = 0; i < note.length; i++) {
        let card = note[i];
        card.innerHTML.toUpperCase().indexOf(input) > -1
        ? note[i].style.display = ''
        : note[i].style.display = 'none';
    }
}

document.querySelector('#layout-btn').addEventListener('click', toggleLayout);
document.querySelector('#add-btn').addEventListener('click', openModal);
document.querySelector('#close-btn').addEventListener('click', closeModal);
document.querySelector('#save-btn').addEventListener('click', saveNote);
document.querySelector('.search-input').addEventListener('keyup', searchNotes);

handleScroll();
displayNotes();