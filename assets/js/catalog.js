const books = document.querySelectorAll('.book');
const bookPreview = document.querySelector('#book-preview');
const bookPreviewConten = document.querySelector('#book-preview .book-preview__content ');

books.forEach(book => {
    book.addEventListener('click', (event) => {
        // Check if shift key was pressed during click
        if (event.shiftKey) {
            // Enable download buttons for all books
            document.querySelector('body').classList.add('-show-books-formats');
        }

        bookPreview.classList.add('show');
        const bookClone = book.cloneNode(true);

        bookPreviewConten.innerHTML = '';
        bookPreviewConten.appendChild(bookClone);

        // Also scroll to the top of the preview content after the book is loaded
        bookPreviewConten.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Add prev and next book navigation buttons to the preview pane
document.querySelector('#loadPrevBook').addEventListener('click', () => {
    const currentBookId = bookPreviewConten.querySelector('.book').getAttribute('data-id');
    const currentBookIndex = Array.from(books).findIndex(book => book.getAttribute('data-id') === currentBookId);
    const prevBookIndex = (currentBookIndex - 1 + books.length) % books.length;

    // Check if the previous book is visible (not filtered out), if not, keep looking back
    let foundVisible = false;
    let searchIndex = prevBookIndex;
    while (!foundVisible) {
        if (books[searchIndex].style.display !== 'none') {
            foundVisible = true;
            books[searchIndex].click();
        } else {
            searchIndex = (searchIndex - 1 + books.length) % books.length;
            if (searchIndex === currentBookIndex) {
                // We've looped through all books and found none visible
                break;
            }
        }
    }
});

document.querySelector('#loadNextBook').addEventListener('click', () => {
    const currentBookId = bookPreviewConten.querySelector('.book').getAttribute('data-id');
    const currentBookIndex = Array.from(books).findIndex(book => book.getAttribute('data-id') === currentBookId);
    const nextBookIndex = (currentBookIndex + 1) % books.length;

    // Check if the next book is visible (not filtered out), if not, keep looking forward
    let foundVisible = false;
    let searchIndex = nextBookIndex;

    while (!foundVisible) {
        if (books[searchIndex].style.display !== 'none') {
            foundVisible = true;
            books[searchIndex].click();
        } else {
            searchIndex = (searchIndex + 1) % books.length;
            if (searchIndex === currentBookIndex) {
                // We've looped through all books and found none visible
                break;
            }
        }
    }
});

// Sort books by article data attributes, asc or desc
function sortBooks(sortBy = 'title', order = 'desc') {
    const booksList = document.querySelector('#books-list');
    const books = Array.from(booksList.querySelectorAll('.book'));

    books.sort((a, b) => {
        const aData = a.getAttribute(`data-${sortBy}`);
        const bData = b.getAttribute(`data-${sortBy}`);

        // For number based comparison
        if (sortBy === 'id') {
            return order === 'asc' ? aData - bData : bData - aData;
        }

        // For text based comparison
        return order === 'asc' ? aData.localeCompare(bData) : bData.localeCompare(aData);
    });

    books.forEach(book => booksList.appendChild(book));
}

/**
 *  Sort Controls
 * ****************************
 */
// Sort by title
const btn_sort_title = document.querySelector('#sort-title');
btn_sort_title.addEventListener('click', (e) => {
    // Remove other sort buttons from the class
    btn_sort_author.classList.remove('desc', 'asc');
    btn_sort_id.classList.remove('desc', 'asc');

    if (!btn_sort_title.classList.contains('desc') && !btn_sort_title.classList.contains('asc')) {
        btn_sort_title.classList.add('asc'); // Default
    } else {
        btn_sort_title.classList.toggle('desc');
        btn_sort_title.classList.toggle('asc');
    }
    sortBooks('title', btn_sort_title.classList.contains('desc') ? 'desc' : 'asc');
});

// Sort by Autors
const btn_sort_author = document.querySelector('#sort-author');
btn_sort_author.addEventListener('click', (e) => {
    // Remove other sort buttons from the class
    btn_sort_title.classList.remove('desc', 'asc');
    btn_sort_id.classList.remove('desc', 'asc');

    if (!btn_sort_author.classList.contains('desc') && !btn_sort_author.classList.contains('asc')) {
        btn_sort_author.classList.add('asc'); // Default
    } else {
        btn_sort_author.classList.toggle('desc');
        btn_sort_author.classList.toggle('asc');
    }
    sortBooks('authors', btn_sort_author.classList.contains('desc') ? 'desc' : 'asc');
});

// Sort by date
const btn_sort_id = document.querySelector('#sort-id');
btn_sort_id.addEventListener('click', (e) => {
    // Remove other sort buttons from the class
    btn_sort_title.classList.remove('desc', 'asc');
    btn_sort_author.classList.remove('desc', 'asc');

    if (!btn_sort_id.classList.contains('desc') && !btn_sort_id.classList.contains('asc')) {
        btn_sort_id.classList.add('desc'); // Add desc by default
    } else {
        btn_sort_id.classList.toggle('desc');
        btn_sort_id.classList.toggle('asc');
    }
    sortBooks('id', btn_sort_id.classList.contains('desc') ? 'desc' : 'asc');
});

// Reset search and sort settings
document.querySelector('#sort-reset').addEventListener('click', (e) => {
    // Clear the serch box too
    document.querySelector('#search-box input').value = '';

    // And restore the inline-block to all books
    books.forEach(book => book.style.display = 'inline-block');

    // Reset the sort to default
    btn_sort_id.classList.remove('desc', 'asc');
    btn_sort_id.click();
});

/**
 *  Search box
 * ****************************
 */
const searchBox = document.querySelector('#search-box input');
searchBox.addEventListener('input', (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    books.forEach(book => {
        const title = book.getAttribute('data-title').toLowerCase();
        const authors = book.getAttribute('data-authors').toLowerCase();
        if (title.includes(searchValue) || authors.includes(searchValue)) {
            book.style.display = 'inline-block';
        } else {
            book.style.display = 'none';
        }
    });
});

/**
 *  Views Controls
 * ****************************
 */
function updateLayout() {
    document.querySelector('#books-list').classList.toggle('-view-list', document.querySelector('#layoutSwitcher').checked);

    // Save the layout preference in a browser cookie that never expires
    document.cookie = `layout=${document.querySelector('#layoutSwitcher').checked ? 'list' : 'grid'}; path=/; max-age=31536000`; // 1 year
}

document.querySelector('#layoutSwitcher').addEventListener('click', () => {
    updateLayout();
});

// Mobile layout button
document.querySelector('#layoutSwitcherMobile').addEventListener('click', function() {
    const checkbox = document.querySelector('#layoutSwitcher');
    checkbox.checked = !checkbox.checked;
    updateLayout();

    // Update icon
    const icon = this.querySelector('i');
    icon.className = checkbox.checked ? 'bi bi-list' : 'bi bi-grid';
});

function loadLayoutFromCookie() {
    const layoutCookie = document.cookie.split('; ').find(row => row.startsWith('layout='));
    if (layoutCookie) {
        const isListView = layoutCookie.split('=')[1] === 'list';
        document.querySelector('#layoutSwitcher').checked = isListView;

        // Update mobile icon
        const mobileIcon = document.querySelector('#layoutSwitcherMobile i');
        if (mobileIcon) {
            mobileIcon.className = isListView ? 'bi bi-list' : 'bi bi-grid';
        }

        updateLayout();
    }
}

/**
 *  Theme selector Control
 * ****************************
 */
function updateTheme() {
    document.body.setAttribute('data-bs-theme', document.querySelector('#themingSwitcher').checked ? 'dark' : 'light');
    // Save the theme preference in a browser cookie that never expires
    document.cookie = `theme=${document.querySelector('#themingSwitcher').checked ? 'dark' : 'light'}; path=/; max-age=31536000`; // 1 year
}

document.querySelector('#themingSwitcher').addEventListener('click', () => {
    updateTheme();
});

// Mobile theme button
document.querySelector('#themingSwitcherMobile').addEventListener('click', function() {
    const checkbox = document.querySelector('#themingSwitcher');
    checkbox.checked = !checkbox.checked;
    updateTheme();

    // Update icon
    const icon = this.querySelector('i');
    icon.className = checkbox.checked ? 'bi bi-moon' : 'bi bi-brightness-high';
});

function loadThemeFromCookie() {
    const themeCookie = document.cookie.split('; ').find(row => row.startsWith('theme='));
    if (themeCookie) {
        const isDarkMode = themeCookie.split('=')[1] === 'dark';
        document.querySelector('#themingSwitcher').checked = isDarkMode;

        // Update mobile icon
        const mobileIcon = document.querySelector('#themingSwitcherMobile i');
        if (mobileIcon) {
            mobileIcon.className = isDarkMode ? 'bi bi-moon' : 'bi bi-brightness-high';
        }

        updateTheme();
    }
}

/**
 *  QR code generator
 * ****************************
 */
function updateQRLink() {
    // Get the current page URL and generate a QR code for it
    var catalog_url = window.location.href;
    catalog_url = catalog_url.replace(/\/[^\/]+$/, '');

    // Update the text link
    document.querySelector('#qr-catalog-url').textContent = catalog_url;
    document.querySelector('#qr-catalog-url').href = catalog_url;

    //Update the QR code image
    const qrCode = new QRCode('qr-code', catalog_url);
}

function generateQRCode() {
    const catalog_url = document.querySelector('#qr-catalog-url').href;
    const qrCode = new QRCode('qr-code', catalog_url);
}

// Initialize the page view
function init() {
    loadThemeFromCookie();
    loadLayoutFromCookie();

    updateQRLink();

    new KonamiCode({
        callback: function (konamiCode) {
            konamiCode.disable();
            document.querySelector('body').classList.add('-show-books-formats');
        }
    });

    // If the URL include a query paramter ?download=1 or true, then add the class to show the formats
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('download') === '1' || urlParams.get('download') === 'true') {
        document.querySelector('body').classList.add('-show-books-formats');
    }
}

init();
