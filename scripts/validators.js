// Core validation patterns with real-time feedback
function validateDescription(description) {
    const regex = /^\S(?:.*\S)?$/;
    return regex.test(description);
}

function validateNumeric(value) {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    return regex.test(value);
}

function validateDate(date) {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return regex.test(date);
}

function validateCategory(tag) {
    const regex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    return regex.test(tag);
}

// Advanced regex patterns
function validateDuplicateWords(text) {
    const regex = /\b(\w+)\s+\1\b/;
    return regex.test(text);
}

function validateISBN(isbn) {
    const regex = /\b(?:ISBN[-\s]?)?(?:97[89][-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX]\b/i;
    return regex.test(isbn);
}

function validateEmail(email) {
    const regex = /^(?=.*@)(?=.*\.)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return regex.test(email);
}

function validateStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// Real-time validation with feedback
function setupRealTimeValidation() {
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const pagesInput = document.getElementById('pages');
    const tagInput = document.getElementById('tag');
    const dateInput = document.getElementById('date-added');
    
    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            const isValid = validateDescription(e.target.value);
            showValidationFeedback(e.target, isValid, 'No leading/trailing spaces allowed');
        });
    }
    
    if (authorInput) {
        authorInput.addEventListener('input', (e) => {
            const isValid = validateDescription(e.target.value);
            showValidationFeedback(e.target, isValid, 'No leading/trailing spaces allowed');
        });
    }
    
    if (pagesInput) {
        pagesInput.addEventListener('input', (e) => {
            const isValid = validateNumeric(e.target.value);
            showValidationFeedback(e.target, isValid, 'Must be a positive number');
        });
    }
    
    if (tagInput) {
        tagInput.addEventListener('input', (e) => {
            const isValid = validateCategory(e.target.value);
            showValidationFeedback(e.target, isValid, 'Letters, spaces, and hyphens only');
        });
    }
    
    if (dateInput) {
        dateInput.addEventListener('input', (e) => {
            const isValid = validateDate(e.target.value);
            showValidationFeedback(e.target, isValid, 'Use YYYY-MM-DD format');
        });
    }
}

function showValidationFeedback(input, isValid, message) {
    let feedback = input.parentNode.querySelector('.validation-feedback');
    
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'validation-feedback';
        feedback.setAttribute('role', 'alert');
        feedback.setAttribute('aria-live', 'polite');
        input.parentNode.appendChild(feedback);
    }
    
    if (input.value && !isValid) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        feedback.textContent = message;
        feedback.className = 'validation-feedback error';
    } else if (input.value && isValid) {
        input.classList.add('valid');
        input.classList.remove('invalid');
        feedback.textContent = '✓ Valid';
        feedback.className = 'validation-feedback success';
    } else {
        input.classList.remove('valid', 'invalid');
        feedback.textContent = '';
        feedback.className = 'validation-feedback';
    }
}

// Initialize validation on DOM load
document.addEventListener('DOMContentLoaded', setupRealTimeValidation);

export {
    validateDescription,
    validateNumeric,
    validateDate,
    validateCategory,
    validateDuplicateWords,
    validateISBN,
    validateEmail,
    validateStrongPassword,
    setupRealTimeValidation,
    showValidationFeedback
};