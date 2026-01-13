const books = document.querySelectorAll('.book');
const bookPreview = document.querySelector('#book-preview');
const bookPreviewConten = document.querySelector('#book-preview .book-preview__content ');
const booksList = document.querySelector('#books-list');

// Function to toggle drawer-open class on books list
function toggleDrawerState(isOpen) {
    console.log('toggleDrawerState called with:', isOpen);
    console.log('booksList element:', booksList);
    if (isOpen) {
        booksList.classList.add('drawer-open');
        console.log('Added drawer-open class. Classes:', booksList.className);
    } else {
        booksList.classList.remove('drawer-open');
        console.log('Removed drawer-open class. Classes:', booksList.className);
    }
}

/**
 * URL State Management
 * Saves and restores: sort, order, search filter, and open book
 */
function updateURLHash() {
    const searchBox = document.querySelector('#search-box input');
    const params = new URLSearchParams();

    // Get active sort button
    const activeSortBtn = document.querySelector('.btn-sort.desc, .btn-sort.asc');
    if (activeSortBtn) {
        const sortId = activeSortBtn.id.replace('sort-', '');
        const order = activeSortBtn.classList.contains('desc') ? 'desc' : 'asc';
        params.set('sort', sortId);
        params.set('order', order);
    }

    // Get search/filter value
    if (searchBox.value) {
        params.set('filter', searchBox.value);
    }

    // Get open book ID
    if (bookPreview.classList.contains('show')) {
        const openBook = bookPreviewConten.querySelector('.book');
        if (openBook) {
            params.set('book', openBook.getAttribute('data-id'));
        }
    }

    // Update URL without reloading page
    const newHash = params.toString();
    if (newHash) {
        history.replaceState(null, '', '#' + newHash);
    } else {
        history.replaceState(null, '', window.location.pathname);
    }
}

function restoreStateFromURL() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);

    // Restore search/filter
    const filterValue = params.get('filter');
    if (filterValue) {
        const searchBox = document.querySelector('#search-box input');
        searchBox.value = filterValue;
        applyFilters();
    }

    // Restore sort and order
    const sortBy = params.get('sort');
    const order = params.get('order') || 'desc';
    if (sortBy) {
        const sortBtn = document.querySelector(`#sort-${sortBy}`);
        if (sortBtn) {
            // Remove default sort classes
            document.querySelectorAll('.btn-sort').forEach(btn => {
                btn.classList.remove('desc', 'asc');
            });
            // Apply the sort from URL
            sortBtn.classList.add(order);
            sortBooks(sortBy, order);
        }
    }

    // Restore open book (after a small delay to ensure books are rendered)
    const bookId = params.get('book');
    if (bookId) {
        setTimeout(() => {
            const book = document.querySelector(`[data-id="${bookId}"]`);
            if (book) {
                const clickableElement = book.querySelector('.book__cover, .book-cell--cover');
                if (clickableElement) {
                    clickableElement.click();
                }
            }
        }, 100);
    }
}

/**
 * URL State Management
 * Saves and restores: sort, order, search filter, and open book
 */
function updateURLHash() {
    const searchBox = document.querySelector('#search-box input');
    const params = new URLSearchParams();

    // Get active sort button
    const activeSortBtn = document.querySelector('.btn-sort.desc, .btn-sort.asc');
    if (activeSortBtn) {
        const sortId = activeSortBtn.id.replace('sort-', '');
        const order = activeSortBtn.classList.contains('desc') ? 'desc' : 'asc';
        params.set('sort', sortId);
        params.set('order', order);
    }

    // Get search/filter value
    if (searchBox.value) {
        params.set('filter', searchBox.value);
    }

    // Get open book ID
    if (bookPreview.classList.contains('show')) {
        const openBook = bookPreviewConten.querySelector('.book');
        if (openBook) {
            params.set('book', openBook.getAttribute('data-id'));
        }
    }

    // Update URL without reloading page
    const newHash = params.toString();
    if (newHash) {
        history.replaceState(null, '', '#' + newHash);
    } else {
        history.replaceState(null, '', window.location.pathname);
    }
}

function restoreStateFromURL() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);

    // Restore search/filter
    const filterValue = params.get('filter');
    if (filterValue) {
        const searchBox = document.querySelector('#search-box input');
        searchBox.value = filterValue;
        applyFilters();
    }

    // Restore sort and order
    const sortBy = params.get('sort');
    const order = params.get('order') || 'desc';
    if (sortBy) {
        const sortBtn = document.querySelector(`#sort-${sortBy}`);
        if (sortBtn) {
            // Remove default sort classes
            document.querySelectorAll('.btn-sort').forEach(btn => {
                btn.classList.remove('desc', 'asc');
            });
            // Apply the sort from URL
            sortBtn.classList.add(order);
            sortBooks(sortBy, order);
        }
    }

    // Restore open book (after a small delay to ensure books are rendered)
    const bookId = params.get('book');
    if (bookId) {
        setTimeout(() => {
            const book = document.querySelector(`[data-id="${bookId}"]`);
            if (book) {
                const clickableElement = book.querySelector('.book__cover, .book-cell--cover');
                if (clickableElement) {
                    clickableElement.click();
                }
            }
        }, 100);
    }
}

books.forEach(book => {
    // Attach click handler to clickable elements
    const clickableElements = book.querySelectorAll('.book__cover, .book-cell--cover, .book-cell--title');

    clickableElements.forEach(element => {
        element.addEventListener('click', (event) => {
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

            // Toggle drawer state for grid view adjustment
            toggleDrawerState(true);

            // Update URL hash with open book
            updateURLHash();
        });
    });
});

// Close preview handler
const closePreviewBtn = document.querySelector('#book-preview .btn-close');
if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', () => {
        bookPreview.classList.remove('show');
        toggleDrawerState(false);
        updateURLHash();
    });
}

// Also listen for Bootstrap collapse hidden event
const bookPreviewEl = document.querySelector('#book-preview');
if (bookPreviewEl) {
    bookPreviewEl.addEventListener('hidden.bs.collapse', () => {
        toggleDrawerState(false);
        updateURLHash();
    });
}

// Header prev button
const headerPrevBtn = document.querySelector('#loadPrevBook-header');
if (headerPrevBtn) {
    headerPrevBtn.addEventListener('click', () => {
        const currentBookId = bookPreviewConten.querySelector('.book').getAttribute('data-id');

        const visibleBooks = Array.from(books)
            .filter(book => book.style.display !== 'none')
            .sort((a, b) => {
                const orderA = parseInt(a.style.order) || 0;
                const orderB = parseInt(b.style.order) || 0;
                return orderA - orderB;
            });

        const currentBookIndex = visibleBooks.findIndex(book => book.getAttribute('data-id') === currentBookId);
        const prevBookIndex = (currentBookIndex - 1 + visibleBooks.length) % visibleBooks.length;

        const clickTarget = visibleBooks[prevBookIndex].querySelector('.book__cover, .book-cell--cover');
        if (clickTarget) clickTarget.click();
    });
}

// Header next button
const headerNextBtn = document.querySelector('#loadNextBook-header');
if (headerNextBtn) {
    headerNextBtn.addEventListener('click', () => {
        const currentBookId = bookPreviewConten.querySelector('.book').getAttribute('data-id');

        const visibleBooks = Array.from(books)
            .filter(book => book.style.display !== 'none')
            .sort((a, b) => {
                const orderA = parseInt(a.style.order) || 0;
                const orderB = parseInt(b.style.order) || 0;
                return orderA - orderB;
            });

        const currentBookIndex = visibleBooks.findIndex(book => book.getAttribute('data-id') === currentBookId);
        const nextBookIndex = (currentBookIndex + 1) % visibleBooks.length;

        const clickTarget = visibleBooks[nextBookIndex].querySelector('.book__cover, .book-cell--cover');
        if (clickTarget) clickTarget.click();
    });
}

// Sort books by article data attributes, asc or desc
// Uses style.order to avoid DOM manipulation and image reloading
function sortBooks(sortBy = 'title', order = 'desc') {
    const booksList = document.querySelector('#books-list');
    const books = Array.from(booksList.querySelectorAll('.book'));

    books.sort((a, b) => {
        let aData = a.getAttribute(`data-${sortBy}`);
        let bData = b.getAttribute(`data-${sortBy}`);

        // For number based comparison (id, date, added are numeric)
        if (sortBy === 'id' || sortBy === 'date' || sortBy === 'added') {
            aData = Number(aData);
            bData = Number(bData);
            return order === 'asc' ? aData - bData : bData - aData;
        }

        // For series: empty values go to the end, then sort by name + index
        if (sortBy === 'series') {
            if (!aData && !bData) return 0;
            if (!aData) return 1;  // a goes to end
            if (!bData) return -1; // b goes to end

            // Compare series names
            const seriesCompare = order === 'asc' ? aData.localeCompare(bData) : bData.localeCompare(aData);

            // If same series, sort by series_index
            if (seriesCompare === 0) {
                const aIndex = Number(a.getAttribute('data-series-index')) || 0;
                const bIndex = Number(b.getAttribute('data-series-index')) || 0;
                return order === 'asc' ? aIndex - bIndex : bIndex - aIndex;
            }

            return seriesCompare;
        }

        // For text based comparison (title, authors, series are strings)
        return order === 'asc' ? aData.localeCompare(bData) : bData.localeCompare(aData);
    });

    // Set order without moving DOM elements
    books.forEach((book, index) => {
        book.style.order = index;
    });

    // Update URL with sort state
    updateURLHash();
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
    btn_sort_series.classList.remove('desc', 'asc');
    btn_sort_date.classList.remove('desc', 'asc');
    btn_sort_added.classList.remove('desc', 'asc');

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
    btn_sort_date.classList.remove('desc', 'asc');
    btn_sort_series.classList.remove('desc', 'asc');
    btn_sort_added.classList.remove('desc', 'asc');

    if (!btn_sort_author.classList.contains('desc') && !btn_sort_author.classList.contains('asc')) {
        btn_sort_author.classList.add('asc'); // Default
    } else {
        btn_sort_author.classList.toggle('desc');
        btn_sort_author.classList.toggle('asc');
    }
    sortBooks('authors', btn_sort_author.classList.contains('desc') ? 'desc' : 'asc');
});

// Sort by Series
const btn_sort_series = document.querySelector('#sort-series');
btn_sort_series.addEventListener('click', (e) => {
    // Remove other sort buttons from the class
    btn_sort_title.classList.remove('desc', 'asc');
    btn_sort_date.classList.remove('desc', 'asc');
    btn_sort_author.classList.remove('desc', 'asc');
    btn_sort_added.classList.remove('desc', 'asc');

    if (!btn_sort_series.classList.contains('desc') && !btn_sort_series.classList.contains('asc')) {
        btn_sort_series.classList.add('asc'); // Default
    } else {
        btn_sort_series.classList.toggle('desc');
        btn_sort_series.classList.toggle('asc');
    }
    sortBooks('series', btn_sort_series.classList.contains('desc') ? 'desc' : 'asc');
});

// Sort by publication date
const btn_sort_date = document.querySelector('#sort-date');
btn_sort_date.addEventListener('click', (e) => {
    // Remove other sort buttons from the class
    btn_sort_title.classList.remove('desc', 'asc');
    btn_sort_author.classList.remove('desc', 'asc');
    btn_sort_series.classList.remove('desc', 'asc');
    btn_sort_added.classList.remove('desc', 'asc');

    if (!btn_sort_date.classList.contains('desc') && !btn_sort_date.classList.contains('asc')) {
        btn_sort_date.classList.add('desc'); // Default: newest first
    } else {
        btn_sort_date.classList.toggle('desc');
        btn_sort_date.classList.toggle('asc');
    }
    sortBooks('date', btn_sort_date.classList.contains('desc') ? 'desc' : 'asc');
});

// Sort by added date
const btn_sort_added = document.querySelector('#sort-added');
btn_sort_added.addEventListener('click', (e) => {
    // Remove other sort buttons from the class
    btn_sort_title.classList.remove('desc', 'asc');
    btn_sort_author.classList.remove('desc', 'asc');
    btn_sort_series.classList.remove('desc', 'asc');
    btn_sort_date.classList.remove('desc', 'asc');

    if (!btn_sort_added.classList.contains('desc') && !btn_sort_added.classList.contains('asc')) {
        btn_sort_added.classList.add('desc'); // Default: newest first
    } else {
        btn_sort_added.classList.toggle('desc');
        btn_sort_added.classList.toggle('asc');
    }
    sortBooks('added', btn_sort_added.classList.contains('desc') ? 'desc' : 'asc');
});

// Reset search and sort settings
document.querySelector('#sort-reset').addEventListener('click', (e) => {
    // Clear the search box too
    document.querySelector('#search-box input').value = '';

    // And restore display to all books
    books.forEach(book => book.style.display = '');

    // Reset the sort to default (added date, newest first)
    btn_sort_added.classList.remove('desc', 'asc');
    btn_sort_added.click();
});

/**
 *  Search box - supports text search and [type: value] filters
 * ****************************
 */
const searchBox = document.querySelector('#search-box input');

function applyFilters() {
    const searchValue = searchBox.value.trim().toLowerCase();

    // Parse [type: value] patterns
    const filterPattern = /\[(\w+):\s*([^\]]+)\]/g;
    const filters = [];
    let match;

    while ((match = filterPattern.exec(searchValue)) !== null) {
        filters.push({
            type: match[1],
            value: match[2].trim()
        });
    }

    // Get remaining text (non-filter search)
    const textSearch = searchValue.replace(filterPattern, '').trim();

    books.forEach(book => {
        let matches = true;

        // Apply filters [type: value]
        filters.forEach(filter => {
            if (filter.type === 'series') {
                const bookSeries = book.getAttribute('data-series');
                // Handle empty series
                if (!bookSeries || bookSeries === '') {
                    matches = false;
                } else if (bookSeries.toLowerCase() !== filter.value.toLowerCase()) {
                    matches = false;
                }
            } else if (filter.type === 'tag') {
                const bookTags = book.getAttribute('data-tags');
                if (!bookTags || !bookTags.split('|').includes(filter.value)) matches = false;
            } else if (filter.type === 'author') {
                const bookAuthors = book.getAttribute('data-authors');
                if (!bookAuthors || !bookAuthors.includes(filter.value)) matches = false;
            }
        });

        // Apply text search (if any)
        if (textSearch && matches) {
            const title = book.getAttribute('data-title');
            const authors = book.getAttribute('data-authors');
            if (!title.includes(textSearch) && !authors.includes(textSearch)) {
                matches = false;
            }
        }

        book.style.display = matches ? '' : 'none';
    });

    // Update URL with filter state
    updateURLHash();
}

searchBox.addEventListener('input', applyFilters);

/**
 *  Filter links (authors, series, tags)
 * ****************************
 */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-link')) {
        const filterType = e.target.getAttribute('data-filter-type');
        const filterValue = e.target.getAttribute('data-filter-value');

        const currentValue = searchBox.value.trim();
        const filterString = `[${filterType}: ${filterValue}]`;

        // If shift key is pressed, add to existing filters (if not already present)
        if (e.shiftKey) {
            if (!currentValue.includes(filterString)) {
                searchBox.value = currentValue ? `${currentValue} ${filterString}` : filterString;
            }
        } else {
            // Normal click: replace with this filter only
            searchBox.value = filterString;
        }

        applyFilters();
    }
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

    // Apply default sort only if no hash state exists
    const hash = window.location.hash.substring(1);
    if (!hash) {
        btn_sort_added.classList.add('desc');
        sortBooks('added', 'desc');
    } else {
        // Restore state from URL
        restoreStateFromURL();
    }
}

init();
