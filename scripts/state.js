// state.js

// Simple state with hardcoded books
const state = {
    records: [
        {
            "id": "book_0001",
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "pages": 180,
            "tag": "Classic",
            "dateAdded": "2024-12-01",
            "createdAt": "2024-12-01T10:00:00Z",
            "updatedAt": "2024-12-01T10:00:00Z"
        },
        {
            "id": "book_0002",
            "title": "1984",
            "author": "George Orwell",
            "pages": 328,
            "tag": "Dystopian",
            "dateAdded": "2024-12-02",
            "createdAt": "2024-12-02T10:00:00Z",
            "updatedAt": "2024-12-02T10:00:00Z"
        },
        {
            "id": "book_0003",
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "pages": 310,
            "tag": "Fantasy",
            "dateAdded": "2024-12-05",
            "createdAt": "2024-12-05T10:00:00Z",
            "updatedAt": "2024-12-05T10:00:00Z"
        },
        {
            "id": "book_0004",
            "title": "Dune",
            "author": "Frank Herbert",
            "pages": 688,
            "tag": "Science-Fiction",
            "dateAdded": "2024-12-06",
            "createdAt": "2024-12-06T10:00:00Z",
            "updatedAt": "2024-12-06T10:00:00Z"
        },
        {
            "id": "book_0005",
            "title": "Pride and Prejudice",
            "author": "Jane Austen",
            "pages": 279,
            "tag": "Romance",
            "dateAdded": "2024-12-09",
            "createdAt": "2024-12-09T10:00:00Z",
            "updatedAt": "2024-12-09T10:00:00Z"
        }
    ],
    stats: {
        totalRecords: 0,
        totalPages: 0,
        topTag: '—',
        last7Days: [0,0,0,0,0,0,0],
        lastUpdated: null,
    },
};

function addRecord(record) {
    record.id = `book_${Date.now()}`;
    record.createdAt = new Date().toISOString();
    record.updatedAt = record.createdAt;
    state.records.push(record);
    updateStats();
    saveToStorage();
}

function editRecord(id, updatedRecord) {
    const index = state.records.findIndex(record => record.id === id);
    if (index !== -1) {
        updatedRecord.updatedAt = new Date().toISOString();
        state.records[index] = { ...state.records[index], ...updatedRecord };
        updateStats();
        saveToStorage();
    }
}

function deleteRecord(id) {
    state.records = state.records.filter(record => record.id !== id);
    updateStats();
    saveToStorage();
}

function updateStats() {
    state.stats.totalRecords = state.records.length;
    state.stats.totalPages = state.records.reduce((sum, record) => sum + (record.pages || 0), 0);
    state.stats.topTag = getTopTag();
    state.stats.last7Days = getLast7DaysData();
    state.stats.lastUpdated = new Date().toISOString();
}

function getTopTag() {
    const tagCounts = {};
    state.records.forEach(record => {
        const tag = record.tag || 'Untagged';
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    return Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b, '—');
}

function getLast7DaysData() {
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = state.records.filter(r => r.dateAdded === dateStr).length;
        last7Days.push(count);
    }
    return last7Days;
}

function saveToStorage() {
    localStorage.setItem('bookNotesVaultRecords', JSON.stringify(state.records));
}

function loadFromStorage() {
    const stored = localStorage.getItem('bookNotesVaultRecords');
    if (stored) {
        state.records = JSON.parse(stored);
    }
    updateStats();
}

function getRecords() {
    return state.records;
}

function getStats() {
    return state.stats;
}

// Make functions globally available
window.addRecord = addRecord;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.getRecords = getRecords;
window.getStats = getStats;
window.loadFromStorage = loadFromStorage;
window.state = state;

// Initialize stats immediately
updateStats();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    console.log('State initialized with', state.records.length, 'records');
});

export { addRecord, editRecord, deleteRecord, getRecords, getStats, loadFromStorage };