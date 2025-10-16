// Test Suite for Book & Notes Vault
import { validateDescription, validateNumeric, validateDate, validateCategory, validateDuplicateWords } from './validators.js';

const tests = [];
const logs = [];

function test(name, fn) {
    tests.push({ name, fn });
}

function log(message) {
    logs.push(message);
    console.log(message);
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

// Regex Validation Tests
test('Description validation - no leading/trailing spaces', () => {
    assert(validateDescription('Valid title'), 'Should accept normal text');
    assert(!validateDescription(' Leading space'), 'Should reject leading space');
    assert(!validateDescription('Trailing space '), 'Should reject trailing space');
    assert(!validateDescription('  '), 'Should reject only spaces');
    assert(validateDescription('A'), 'Should accept single character');
});

test('Numeric validation - pages format', () => {
    assert(validateNumeric('123'), 'Should accept integer');
    assert(validateNumeric('123.45'), 'Should accept decimal');
    assert(!validateNumeric('0123'), 'Should reject leading zeros');
    assert(!validateNumeric('123.456'), 'Should reject more than 2 decimals');
    assert(validateNumeric('0'), 'Should accept zero');
});

test('Date validation - YYYY-MM-DD format', () => {
    assert(validateDate('2023-12-25'), 'Should accept valid date');
    assert(!validateDate('23-12-25'), 'Should reject 2-digit year');
    assert(!validateDate('2023-13-25'), 'Should reject invalid month');
    assert(!validateDate('2023-12-32'), 'Should reject invalid day');
});

test('Category validation - letters, spaces, hyphens', () => {
    assert(validateCategory('Fiction'), 'Should accept single word');
    assert(validateCategory('Science Fiction'), 'Should accept words with space');
    assert(validateCategory('Self-Help'), 'Should accept words with hyphen');
    assert(!validateCategory('Fiction123'), 'Should reject numbers');
    assert(!validateCategory('Fiction!'), 'Should reject special chars');
});

test('Duplicate words detection - back-reference', () => {
    assert(validateDuplicateWords('the the book'), 'Should detect duplicate words');
    assert(validateDuplicateWords('book book review'), 'Should detect duplicate words');
    assert(!validateDuplicateWords('the book review'), 'Should not detect different words');
    assert(!validateDuplicateWords('book'), 'Should not detect single word');
});

// Advanced Regex Tests
test('ISBN detection pattern', () => {
    const isbnPattern = /\b(?:ISBN[-\s]?)?(?:97[89][-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX]\b/i;
    assert(isbnPattern.test('ISBN 978-0-123456-78-9'), 'Should detect ISBN-13');
    assert(isbnPattern.test('0-123456-78-X'), 'Should detect ISBN-10');
    assert(!isbnPattern.test('123-456'), 'Should not match random numbers');
});

test('Author surname repetition detection', () => {
    const surnamePattern = /\b([A-Z][a-z]+)\s+\1\b/;
    assert(surnamePattern.test('Smith Smith'), 'Should detect repeated surname');
    assert(!surnamePattern.test('John Smith'), 'Should not match different names');
});

// Data Model Tests
test('Record structure validation', () => {
    const validRecord = {
        id: 'book_001',
        title: 'Test Book',
        author: 'Test Author',
        pages: 200,
        tag: 'Fiction',
        dateAdded: '2023-12-01',
        createdAt: '2023-12-01T10:00:00Z',
        updatedAt: '2023-12-01T10:00:00Z'
    };
    
    const requiredFields = ['id', 'title', 'author', 'pages', 'tag', 'dateAdded'];
    const hasAllFields = requiredFields.every(field => field in validRecord);
    assert(hasAllFields, 'Record should have all required fields');
});

// Search Pattern Tests
test('Tag search pattern', () => {
    const tagPattern = /^@tag:\w+/;
    assert(tagPattern.test('@tag:fiction'), 'Should match tag search');
    assert(tagPattern.test('@tag:science'), 'Should match tag search');
    assert(!tagPattern.test('fiction'), 'Should not match without @tag:');
});

export function runTests() {
    let passed = 0;
    let failed = 0;
    
    logs.length = 0;
    log('Running Book & Notes Vault Test Suite...\n');
    
    tests.forEach(({ name, fn }) => {
        try {
            fn();
            log(`✓ ${name}`);
            passed++;
        } catch (error) {
            log(`✗ ${name}: ${error.message}`);
            failed++;
        }
    });
    
    log(`\nTest Results: ${passed} passed, ${failed} failed`);
    
    const summary = `
        <div class="test-summary ${failed === 0 ? 'success' : 'failure'}">
            <h3>Test Results</h3>
            <p><strong>Passed:</strong> ${passed}</p>
            <p><strong>Failed:</strong> ${failed}</p>
            <p><strong>Total:</strong> ${tests.length}</p>
        </div>
    `;
    
    return { summary, logs };
}