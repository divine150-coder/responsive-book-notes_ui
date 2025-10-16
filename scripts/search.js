// Advanced search with safe regex compilation and highlighting

class SearchEngine {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.recordsTable = document.getElementById('records-table');
        this.searchStatus = document.getElementById('search-status');
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
            this.searchInput.addEventListener('keydown', this.handleKeydown.bind(this));
        }
        this.updateStatus('Showing all records');
    }

    // Safe regex compiler with error handling
    compileRegex(input, flags = 'gi') {
        try {
            if (!input || input.trim() === '') return null;
            // Escape special regex characters for basic search
            const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(escaped, flags);
        } catch (error) {
            console.warn('Regex compilation failed:', error);
            return null;
        }
    }

    // Advanced regex patterns for power users
    compileAdvancedRegex(input, flags = 'gi') {
        try {
            return input ? new RegExp(input, flags) : null;
        } catch (error) {
            console.warn('Advanced regex failed, falling back to basic search');
            return this.compileRegex(input, flags);
        }
    }

    // Highlight matches with accessibility
    highlightText(text, regex) {
        if (!regex || !text) return this.escapeHTML(text);
        
        const escaped = this.escapeHTML(text);
        try {
            return escaped.replace(regex, (match) => 
                `<mark class="search-highlight" aria-label="Search match">${this.escapeHTML(match)}</mark>`
            );
        } catch (error) {
            return escaped;
        }
    }

    escapeHTML(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    handleKeydown(event) {
        // Support keyboard shortcuts
        if (event.ctrlKey && event.key === 'f') {
            event.preventDefault();
            this.searchInput.focus();
        }
        if (event.key === 'Escape') {
            this.clearSearch();
        }
    }

    handleSearch(event) {
        const query = event.target.value.trim();
        this.performSearch(query);
    }

    performSearch(query) {
        if (!query) {
            this.clearHighlights();
            this.updateStatus('Showing all records');
            return;
        }

        const isAdvanced = query.includes('*') || query.includes('?') || query.includes('[') || query.includes('(');
        const regex = isAdvanced ? 
            this.compileAdvancedRegex(query) : 
            this.compileRegex(query);

        if (!regex) {
            this.updateStatus('Invalid search pattern');
            return;
        }

        this.highlightMatches(regex);
        const matchCount = this.countMatches(regex);
        this.updateStatus(`Found ${matchCount} matches for "${query}"`);
    }

    highlightMatches(regex) {
        const rows = this.getTableRows();
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                const originalText = cell.textContent;
                if (regex.test(originalText)) {
                    regex.lastIndex = 0; // Reset for highlighting
                    cell.innerHTML = this.highlightText(originalText, regex);
                }
            });
        });
    }

    clearHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    countMatches(regex) {
        const rows = this.getTableRows();
        let count = 0;
        rows.forEach(row => {
            const text = row.textContent;
            const matches = text.match(regex);
            if (matches) count += matches.length;
        });
        return count;
    }

    getTableRows() {
        return Array.from(document.querySelectorAll('#records-table tr'));
    }

    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.clearHighlights();
            this.updateStatus('Showing all records');
        }
    }

    updateStatus(message) {
        if (this.searchStatus) {
            this.searchStatus.textContent = message;
            this.searchStatus.setAttribute('aria-live', 'polite');
        }
    }
}

// Initialize search engine
document.addEventListener('DOMContentLoaded', () => {
    window.searchEngine = new SearchEngine();
});

// Export for testing
export { SearchEngine };
export function compileRegex(input, flags = 'gi') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch {
        return null;
    }
}

export function highlight(text, re) {
    if (!re) return text;
    try {
        return text.replace(re, match => `<mark>${match}</mark>`);
    } catch {
        return text;
    }
}