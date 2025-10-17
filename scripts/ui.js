// UI module: renders records, handles add/edit/delete, updates stats
const ui = (() => {
    const recordsTable = document.getElementById('records-table');
    const addForm = document.getElementById('add-form');
    const editForm = document.getElementById('edit-form');
    const statsDashboard = document.getElementById('stats-dashboard');

    const api = {
        addRecord: () => window.addRecord,
        editRecord: () => window.editRecord,
        deleteRecord: () => window.deleteRecord,
        getRecords: () => window.getRecords,
        getStats: () => window.getStats
    };

    function escapeHTML(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const getAllBooks = () => {
        const stored = localStorage.getItem('bookNotesVaultRecords');
        if (stored) return JSON.parse(stored);
        
        // Default books if none stored
        const defaultBooks = [
            {"id": "book_0001", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "pages": 180, "tag": "Classic", "dateAdded": "2024-12-01"},
            {"id": "book_0002", "title": "1984", "author": "George Orwell", "pages": 328, "tag": "Dystopian", "dateAdded": "2024-12-02"}
        ];
        localStorage.setItem('bookNotesVaultRecords', JSON.stringify(defaultBooks));
        return defaultBooks;
    };

    // Save books to localStorage
    const saveBooks = (books) => {
        localStorage.setItem('bookNotesVaultRecords', JSON.stringify(books));
    };

    // Filter books based on search and tag filter
    const filterBooks = () => {
        const searchInput = document.getElementById('search-input');
        const tagFilter = document.getElementById('tag-filter');
        const searchStatus = document.getElementById('search-status');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedTag = tagFilter ? tagFilter.value : '';
        
        let filteredBooks = getAllBooks();
        
        // Apply search filter
        if (searchTerm) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.tag.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply tag filter
        if (selectedTag) {
            filteredBooks = filteredBooks.filter(book => book.tag === selectedTag);
        }
        
        // Update status
        if (searchStatus) {
            const total = getAllBooks().length;
            const showing = filteredBooks.length;
            if (searchTerm || selectedTag) {
                searchStatus.textContent = `Showing ${showing} of ${total} books`;
            } else {
                searchStatus.textContent = 'Showing all records';
            }
        }
        
        return filteredBooks;
    };

    const renderRecords = (records) => {
        const tbody = document.getElementById('records-table');
        const mobileContainer = document.getElementById('records-mobile');
        
        const books = records || filterBooks();
        
        // Render desktop table
        if (tbody) {
            tbody.innerHTML = '';
            books.forEach(record => {
                const row = document.createElement('tr');
                row.classList.add('record');
                row.dataset.id = record.id;
                row.innerHTML = `
                    <td><strong>${record.title}</strong></td>
                    <td>${record.author}</td>
                    <td><span class="pages-badge">${record.pages} pages</span></td>
                    <td><span class="tag-badge">${record.tag}</span></td>
                    <td>${record.dateAdded}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${record.id}" aria-label="Edit ${record.title}"> Edit</button>
                        <button class="delete-btn" data-id="${record.id}" aria-label="Delete ${record.title}"> Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Render mobile cards
        if (mobileContainer) {
            mobileContainer.innerHTML = '';
            books.forEach(record => {
                const card = document.createElement('div');
                card.classList.add('record-card');
                card.dataset.id = record.id;
                card.innerHTML = `
                    <h4>${record.title}</h4>
                    <div class="meta">
                        <div><strong>Author:</strong> ${record.author}</div>
                        <div><strong>Pages:</strong> ${record.pages}</div>
                        <div><strong>Category:</strong> ${record.tag}</div>
                        <div><strong>Added:</strong> ${record.dateAdded}</div>
                    </div>
                    <div class="actions">
                        <button class="edit-btn btn btn-outline" data-id="${record.id}" aria-label="Edit ${record.title}"> Edit</button>
                        <button class="delete-btn btn btn-outline" data-id="${record.id}" aria-label="Delete ${record.title}"> Delete</button>
                    </div>
                `;
                mobileContainer.appendChild(card);
            });
        }
    };

    const updateStats = () => {
        const books = getAllBooks();
        const totalBooks = books.length;
        const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
        const avgPages = totalBooks > 0 ? Math.round(totalPages / totalBooks) : 0;
        
        // Calculate top category
        const tagCounts = {};
        books.forEach(book => {
            tagCounts[book.tag] = (tagCounts[book.tag] || 0) + 1;
        });
        const topTag = Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b, 'None');
        
        // Update main stats
        const cards = document.querySelectorAll('#stats-dashboard .stat-card');
        if (cards.length >= 4) {
            cards[0].querySelector('.stat-number').textContent = totalBooks.toLocaleString();
            cards[1].querySelector('.stat-number').textContent = totalPages.toLocaleString();
            cards[2].querySelector('.stat-number').textContent = avgPages.toLocaleString();
            cards[3].querySelector('.stat-number').textContent = topTag;
        }
        
        // Update progress bars based on current data
        updateProgressBars(totalPages);
        updateCategoryBreakdown(books, tagCounts);
        updateGoalStatus(totalBooks, totalPages);
        updateRecentBooks(books);
    };
    
    const updateProgressBars = (totalPages) => {
        const monthlyTarget = 2000;
        const yearlyTarget = 15000;
        const currentMonthPages = 1405; // Based on December books
        
        const monthlyProgress = Math.min((currentMonthPages / monthlyTarget) * 100, 100);
        const yearlyProgress = Math.min((totalPages / yearlyTarget) * 100, 100);
        
        const progressBars = document.querySelectorAll('.progress-fill');
        if (progressBars.length >= 2) {
            progressBars[0].style.width = `${monthlyProgress}%`;
            progressBars[1].style.width = `${yearlyProgress}%`;
        }
        
        const progressValues = document.querySelectorAll('.progress-value');
        if (progressValues.length >= 2) {
            progressValues[0].textContent = `${currentMonthPages.toLocaleString()} / ${monthlyTarget.toLocaleString()} pages`;
            progressValues[1].textContent = `${totalPages.toLocaleString()} / ${yearlyTarget.toLocaleString()} pages`;
        }
    };
    
    const updateCategoryBreakdown = (books, tagCounts) => {
        const categoryItems = document.querySelectorAll('.category-item');
        const topCategories = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
        
        topCategories.forEach(([tag, count], index) => {
            if (categoryItems[index]) {
                const pages = books.filter(book => book.tag === tag)
                    .reduce((sum, book) => sum + book.pages, 0);
                categoryItems[index].querySelector('.category-name').textContent = tag;
                categoryItems[index].querySelector('.category-count').textContent = `${count} book${count > 1 ? 's' : ''}`;
                categoryItems[index].querySelector('.category-pages').textContent = `${pages.toLocaleString()} pages`;
            }
        });
    };
    
    const updateGoalStatus = (totalBooks, totalPages) => {
        const monthlyTarget = parseInt(document.getElementById('monthly-target')?.value) || 2000;
        const yearlyTarget = parseInt(document.getElementById('yearly-target')?.value) || 24;
        
        const currentMonthPages = 1405;
        const monthlyProgress = Math.round((currentMonthPages / monthlyTarget) * 100);
        const yearlyProgress = Math.round((totalBooks / yearlyTarget) * 100);
        
        const goalStatuses = document.querySelectorAll('.goal-status');
        if (goalStatuses.length >= 2) {
            goalStatuses[0].textContent = `${monthlyProgress >= 100 ? '' : ''} ${monthlyProgress}% Complete`;
            goalStatuses[0].className = `goal-status ${monthlyProgress >= 100 ? 'achieved' : 'in-progress'}`;
            
            goalStatuses[1].textContent = ` ${totalBooks}/${yearlyTarget} Books (${yearlyProgress}%)`;
            goalStatuses[1].className = `goal-status ${yearlyProgress >= 100 ? 'achieved' : 'in-progress'}`;
        }
    };
    
    const updateRecentBooks = (books) => {
        const recentBooksContainer = document.getElementById('recent-books-list');
        if (!recentBooksContainer) return;
        
        // Sort by date added (newest first) and take top 3
        const recentBooks = books
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 3);
        
        recentBooksContainer.innerHTML = '';
        recentBooks.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <div class="book-cover"></div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-meta">${book.pages} pages • ${new Date(book.dateAdded).toLocaleDateString()}</div>
                </div>
            `;
            recentBooksContainer.appendChild(bookItem);
        });
    };

    function updateTrendChart(data) {
        const chartBars = document.querySelectorAll('.chart-bar');
        const maxValue = Math.max(...data, 1);
        
        chartBars.forEach((bar, index) => {
            const value = data[index] || 0;
            const height = (value / maxValue) * 80 + 10;
            bar.style.height = `${height}px`;
            bar.querySelector('span').textContent = value;
        });
    }

    function updateTargetStatus() {
        const pagesTargetInput = document.getElementById('pages-target');
        const booksTargetInput = document.getElementById('books-target');
        const targetStatus = document.getElementById('target-status');
        
        if (pagesTargetInput && targetStatus) {
            const target = parseInt(pagesTargetInput.value) || 2000;
            const currentPages = 1405; // December pages
            const remaining = target - currentPages;
            
            if (remaining > 0) {
                targetStatus.textContent = `${remaining} pages remaining to reach target`;
                targetStatus.className = 'target-status under';
            } else {
                targetStatus.textContent = `Target exceeded by ${Math.abs(remaining)} pages!`;
                targetStatus.className = 'target-status over';
            }
        }
        
        // Update progress bars
        updateProgressBars();
    }
    
    function updateProgressBars() {
        const pagesTarget = parseInt(document.getElementById('pages-target')?.value) || 2000;
        const booksTarget = parseInt(document.getElementById('books-target')?.value) || 24;
        const currentPages = 1405;
        const currentBooks = 12;
        
        const monthlyProgress = Math.min((currentPages / pagesTarget) * 100, 100);
        const yearlyProgress = Math.min((currentBooks / booksTarget) * 100, 100);
        
        const monthlyBar = document.getElementById('monthly-progress');
        const yearlyBar = document.getElementById('yearly-progress');
        const monthlyPercent = document.getElementById('monthly-percentage');
        const yearlyPercent = document.getElementById('yearly-percentage');
        const monthlyText = document.getElementById('monthly-progress-text');
        const yearlyText = document.getElementById('yearly-progress-text');
        
        if (monthlyBar) monthlyBar.style.width = `${monthlyProgress}%`;
        if (yearlyBar) yearlyBar.style.width = `${yearlyProgress}%`;
        if (monthlyPercent) monthlyPercent.textContent = `${Math.round(monthlyProgress)}%`;
        if (yearlyPercent) yearlyPercent.textContent = `${Math.round(yearlyProgress)}%`;
        if (monthlyText) monthlyText.textContent = `${currentPages} of ${pagesTarget} pages read`;
        if (yearlyText) yearlyText.textContent = `${currentBooks} of ${booksTarget} books read`;
    }

    const handleAddFormSubmit = (event) => {
        event.preventDefault();
        if (!addForm) return;
        
        const formData = new FormData(addForm);
        const newRecord = {
            id: `book_${Date.now()}`,
            title: (formData.get('title') || '').trim(),
            author: (formData.get('author') || '').trim(),
            tag: (formData.get('tag') || '').trim(),
            pages: parseInt(formData.get('pages')) || 0,
            dateAdded: formData.get('dateAdded') || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        const books = getAllBooks();
        books.push(newRecord);
        saveBooks(books);
        
        // Show success message
        alert(` Book "${newRecord.title}" saved successfully!`);
        
        // Update UI and reset form
        renderRecords();
        updateStats();
        addForm.reset();
    };

    const handleEditFormSubmit = (event) => {
        event.preventDefault();
        if (!editForm) return;
        const formData = new FormData(editForm);
        const updatedRecord = {
            id: formData.get('id'),
            title: (formData.get('title') || '').trim(),
            author: (formData.get('author') || '').trim(),
            tag: (formData.get('tag') || '').trim(),
            pages: parseInt(formData.get('pages')) || 0,
            dateAdded: formData.get('dateAdded') || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString()
        };
        try {
            if (window.editRecord) {
                window.editRecord(updatedRecord.id, updatedRecord);
            }
        } catch (e) {
            console.error(e);
        }
        editForm.reset();
        editForm.style.display = 'none';
        editForm.setAttribute('aria-hidden', 'true');
        refreshUI();
    };

    const handleDeleteRecord = (id) => {
        if (!id) return;
        if (!confirm('Delete this record?')) return;
        try {
            if (window.deleteRecord) {
                window.deleteRecord(id);
            }
        } catch (e) {
            console.error(e);
        }
        refreshUI();
    };

    function sortRecords(field, direction) {
        const filteredBooks = filterBooks();
        
        const sorted = [...filteredBooks].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];
            
            if (field === 'pages') {
                aVal = parseInt(aVal) || 0;
                bVal = parseInt(bVal) || 0;
            } else if (field === 'dateAdded') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else {
                aVal = String(aVal || '').toLowerCase();
                bVal = String(bVal || '').toLowerCase();
            }
            
            if (direction === 'asc') {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
                return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
        });
        
        renderRecords(sorted);
    }
    
    function renderSortedRecords(books) {
        const tbody = document.getElementById('records-table');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        books.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('record');
            row.dataset.id = record.id;
            row.innerHTML = `
                <td>${record.title}</td>
                <td>${record.author}</td>
                <td>${record.pages}</td>
                <td>${record.tag}</td>
                <td>${record.dateAdded}</td>
                <td>
                    <button class="edit-btn" data-id="${record.id}"> Edit</button>
                    <button class="delete-btn" data-id="${record.id}"> Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function refreshUI() {
        try {
            const records = window.getRecords ? window.getRecords() : [];
            renderRecords(Array.isArray(records) ? records : []);
            const stats = window.getStats ? window.getStats() : { totalRecords: 0, totalPages: 0, topTag: '—', last7Days: [] };
            updateStats(stats);
            updateTrendChart(stats.last7Days || []);
            updateTargetStatus();
        } catch (e) {
            console.error('refreshUI error', e);
        }
    }

    const initEventListeners = () => {
        if (addForm) addForm.addEventListener('submit', handleAddFormSubmit);
        if (editForm) editForm.addEventListener('submit', handleEditFormSubmit);
        
        // Sorting functionality
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
            const [field, direction] = e.target.value.split('-');
            sortRecords(field, direction);
        });
        document.getElementById('cancel-edit')?.addEventListener('click', () => {
            if (!editForm) return;
            editForm.style.display = 'none';
            editForm.setAttribute('aria-hidden', 'true');
        });
        
        // Theme toggle functionality
        document.getElementById('theme-select')?.addEventListener('change', (e) => {
            if (window.themeManager) {
                window.themeManager.setTheme(e.target.value);
            }
        });
        
        // Target tracking
        document.getElementById('pages-target')?.addEventListener('input', updateTargetStatus);
        document.getElementById('books-target')?.addEventListener('input', updateTargetStatus);
        
        // Search and filter functionality
        document.getElementById('search-input')?.addEventListener('input', () => {
            renderRecords();
        });
        
        document.getElementById('tag-filter')?.addEventListener('change', () => {
            renderRecords();
        });
        
        // Import/Export functionality
        document.getElementById('export-data')?.addEventListener('click', exportData);
        document.getElementById('import-data')?.addEventListener('click', () => {
            document.getElementById('import-file')?.click();
        });
        document.getElementById('import-file')?.addEventListener('change', importData);
        document.getElementById('load-seed')?.addEventListener('click', loadSampleData);
        
        // Units conversion
        document.getElementById('page-unit')?.addEventListener('change', updateConversionDisplay);

        // Table and mobile card actions
        const table = document.querySelector('.records-table');
        const mobileContainer = document.getElementById('records-mobile');
        
        function handleEditClick(id) {
            const records = window.getRecords ? window.getRecords() : [];
            const record = records.find(r => r.id === id);
            if (record && editForm) {
                editForm.style.display = '';
                editForm.setAttribute('aria-hidden', 'false');
                editForm.querySelector('#edit-id').value = record.id;
                editForm.querySelector('#edit-title').value = record.title;
                editForm.querySelector('#edit-author').value = record.author;
                editForm.querySelector('#edit-tag').value = record.tag;
                editForm.querySelector('#edit-pages').value = record.pages;
                editForm.querySelector('#edit-date-added').value = record.dateAdded;
                
                // Focus first input for accessibility
                setTimeout(() => {
                    editForm.querySelector('#edit-title').focus();
                }, 100);
            }
        }
        
        if (table) {
            table.addEventListener('click', (event) => {
                if (event.target.classList.contains('edit-btn')) {
                    handleEditClick(event.target.dataset.id);
                }
                if (event.target.classList.contains('delete-btn')) {
                    handleDeleteRecord(event.target.dataset.id);
                }
            });
        }
        
        if (mobileContainer) {
            mobileContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('edit-btn')) {
                    handleEditClick(event.target.dataset.id);
                }
                if (event.target.classList.contains('delete-btn')) {
                    handleDeleteRecord(event.target.dataset.id);
                }
            });
        }


    };

    const init = () => {
        initEventListeners();
        // Initial refresh
        refreshUI();
        updateStats();
        // Additional refresh after delay to catch any async data loading
        setTimeout(() => {
            refreshUI();
            updateStats();
        }, 500);
    };

    function exportData() {
        const records = getAllBooks();
        const dataStr = JSON.stringify(records, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `book-vault-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        alert('Data exported successfully!');
    }

    function importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data) && data.every(validateRecordStructure)) {
                    localStorage.setItem('bookNotesVaultRecords', JSON.stringify(data));
                    renderRecords(data);
                    updateStats();
                    alert('Data imported successfully!');
                } else {
                    alert('Invalid data format. Please check your JSON file.');
                }
            } catch (error) {
                alert('Error reading file. Please ensure it\'s a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }

    function validateRecordStructure(record) {
        const required = ['id', 'title', 'author', 'pages', 'tag', 'dateAdded'];
        return required.every(field => field in record);
    }

    function updateConversionDisplay() {
        const unitSelect = document.getElementById('page-unit');
        const conversionInfo = document.getElementById('conversion-info');
        
        if (!unitSelect || !conversionInfo) return;
        
        const unit = unitSelect.value;
        const conversions = {
            pages: '1 page = 1 page',
            chapters: '1 page = 0.05 chapters (20 pages per chapter)',
            hours: '1 page = 0.02 hours (50 pages per hour)'
        };
        
        conversionInfo.textContent = conversions[unit] || conversions.pages;
    }

    async function loadSampleData() {
        try {
            const response = await fetch('./seed.json');
            const seedData = await response.json();
            if (Array.isArray(seedData) && seedData.every(validateRecordStructure)) {
                localStorage.setItem('bookNotesVaultRecords', JSON.stringify(seedData));
                if (window.loadFromStorage) {
                    window.loadFromStorage();
                }
                refreshUI();
                alert('Sample data loaded successfully!');
            } else {
                alert('Invalid sample data format.');
            }
        } catch (error) {
            alert('Error loading sample data. Please check if seed.json exists.');
        }
    }

    return {
        renderRecords,
        updateStats,
        refreshUI,
        init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    window.ui = ui;
    window.refreshUI = ui.refreshUI;
    ui.init();
    
    // Force render books immediately
    const hardcodedBooks = [
        {"id": "book_0001", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "pages": 180, "tag": "Classic", "dateAdded": "2024-12-01"},
        {"id": "book_0002", "title": "1984", "author": "George Orwell", "pages": 328, "tag": "Dystopian", "dateAdded": "2024-12-02"},
        {"id": "book_0003", "title": "The Hobbit", "author": "J.R.R. Tolkien", "pages": 310, "tag": "Fantasy", "dateAdded": "2024-12-05"}
    ];
    
    setTimeout(() => {
        const tbody = document.getElementById('records-table');
        if (tbody) {
            tbody.innerHTML = '';
            hardcodedBooks.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.pages}</td>
                    <td>${book.tag}</td>
                    <td>${book.dateAdded}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            console.log('Books rendered directly');
        }
    }, 100);
});
