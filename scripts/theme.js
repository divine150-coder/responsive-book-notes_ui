// Theme management
class ThemeManager {
    constructor() {
        this.themeSelect = document.getElementById('theme-select');
        this.init();
    }

    init() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        if (this.themeSelect) {
            this.themeSelect.value = savedTheme;
            this.themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (this.themeSelect) {
            this.themeSelect.value = theme;
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

export { ThemeManager };