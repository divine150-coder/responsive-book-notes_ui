// storage.js
const storageKey = 'bookNotesVaultRecords';

// Save records to localStorage
export function saveRecords(records) {
    localStorage.setItem(storageKey, JSON.stringify(records));
}

// Load records from localStorage
export function loadRecords() {
    const records = localStorage.getItem(storageKey);
    return records ? JSON.parse(records) : [];
}

// Validate the structure of the records
export function validateRecordStructure(record) {
    const requiredFields = ['id', 'title', 'author', 'pages', 'tag', 'dateAdded'];
    return requiredFields.every(field => field in record);
}

// Import records from JSON
export function importRecords(jsonData) {
    try {
        const records = JSON.parse(jsonData);
        if (Array.isArray(records) && records.every(validateRecordStructure)) {
            saveRecords(records);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Invalid JSON data:', error);
        return false;
    }
}

// Export records to JSON
export function exportRecords() {
    const records = loadRecords();
    return JSON.stringify(records, null, 2);
}