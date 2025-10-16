# 📚 Book & Notes Vault

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://divine150-coder.github.io/book-notes-vault/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/divine150-coder/book-notes-vault)

## 🎯 Overview
Book & Notes Vault is a professional-grade, responsive web application designed for avid readers who want to maintain detailed records of their literary journey. Built with vanilla HTML5, CSS3, and JavaScript ES6+, it provides comprehensive book cataloging with advanced search capabilities, reading analytics, and goal tracking.

## ✨ Key Features

### 📖 Core Functionality
- **Smart Cataloging**: Add, edit, and delete book records with detailed metadata
- **Advanced Search**: Real-time regex-powered search with safe compilation and highlighting
- **Intelligent Sorting**: Multi-field sorting (title, author, pages, date) with ascending/descending options
- **Category Filtering**: Quick filtering by book categories and tags
- **Data Persistence**: Robust localStorage with JSON import/export capabilities

### 📊 Analytics & Tracking
- **Interactive Dashboard**: Real-time statistics with progress bars and charts
- **Reading Goals**: Set and track monthly page targets and yearly book goals
- **Progress Monitoring**: Visual progress indicators with percentage completion
- **Category Insights**: Top categories analysis with book counts and page totals
- **Activity Charts**: Monthly reading activity visualization

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with 4+ breakpoints (320px, 480px, 768px, 1024px+)
- **Theme System**: Light/dark mode with smooth transitions and localStorage persistence
- **Professional UI**: Glass morphism design with gradients and backdrop filters
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support
- **Real-time Validation**: Instant form validation with visual feedback and error messages

## Regex Catalog

### Core Validation Patterns
1. **Title/Author Validation**: `/^\S(?:.*\S)?$/`
   - Purpose: No leading/trailing spaces, allows internal spaces
   - Examples: ✓ "The Great Gatsby" ✗ " Leading space" ✗ "Trailing space "

2. **Pages Validation**: `/^(0|[1-9]\d*)(\.\d{1,2})?$/`
   - Purpose: Positive numbers, optional decimals (max 2 places)
   - Examples: ✓ "123" ✓ "123.45" ✗ "0123" ✗ "123.456"

3. **Date Validation**: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`
   - Purpose: YYYY-MM-DD format validation
   - Examples: ✓ "2024-12-25" ✗ "24-12-25" ✗ "2024-13-01"

4. **Tag/Category Validation**: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`
   - Purpose: Letters, spaces, and hyphens only
   - Examples: ✓ "Science-Fiction" ✓ "Self Help" ✗ "Fiction123" ✗ "Action!"

### Advanced Search Patterns
5. **Duplicate Words (Back-reference)**: `/\b(\w+)\s+\1\b/`
   - Purpose: Detect repeated consecutive words
   - Examples: ✓ "the the book" ✓ "Dune Dune Chronicles" ✗ "the book review"

6. **ISBN Detection**: `/\b(?:ISBN[-\s]?)?(?:97[89][-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX]\b/i`
   - Purpose: Identify ISBN-10 and ISBN-13 patterns
   - Examples: ✓ "ISBN 978-0-123456-78-9" ✓ "0-123456-78-X"

7. **Author Surname Repetition**: `/\b([A-Z][a-z]+)\s+\1\b/`
   - Purpose: Detect repeated author surnames
   - Examples: ✓ "Smith Smith" ✗ "John Smith"

8. **Tag Search Pattern**: `/^@tag:\w+/`
   - Purpose: Special tag-based search syntax
   - Examples: ✓ "@tag:fiction" ✓ "@tag:science" ✗ "fiction"

## ⌨️ Keyboard Navigation Map

| Key Combination | Action | Context |
|-----------------|--------|---------|
| `Tab` | Navigate forward through interactive elements | Global |
| `Shift + Tab` | Navigate backward through elements | Global |
| `Enter` | Activate buttons, submit forms, follow links | Interactive elements |
| `Space` | Activate buttons, toggle checkboxes | Buttons, form controls |
| `Escape` | Close modals, cancel edit mode, clear search | Modal dialogs, forms |
| `Ctrl + F` | Focus search input | Library section |
| `Arrow Keys` | Navigate within dropdowns and date pickers | Form controls |
| `Home/End` | Jump to beginning/end of input fields | Text inputs |
| `Page Up/Down` | Scroll through long content | Content areas |

### Skip Navigation
- **Skip Link**: Press `Tab` on page load to reveal "Skip to content" link
- **Section Navigation**: Use landmark navigation in screen readers
- **Focus Management**: Logical tab order maintained throughout application

## Accessibility Features
- **Semantic HTML**: Proper landmarks (header, nav, main, section, footer)
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Live Regions**: Status updates announced via `aria-live`
- **Keyboard Support**: Full keyboard navigation without mouse dependency
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color ratios in both themes
- **Screen Reader**: Compatible with NVDA, JAWS, and VoiceOver
- **Skip Links**: Quick navigation for keyboard users

## 📁 Project Structure

```
book-notes-vault/
├── 📄 index.html              # Main application entry point
├── 📁 styles/                 # CSS Architecture
│   ├── main.css            # Core styles, layout, forms, tables
│   ├── components.css      # Reusable UI components
│   ├── themes.css          # Light/dark theme variables
│   ├── library.css         # Library-specific styling
│   ├── dashboard.css       # Dashboard layout and cards
│   ├── dashboard-friendly.css # User-friendly enhancements
│   ├── about.css           # About page professional styling
│   └── responsive.css      # Mobile-first responsive design
├── 📁 scripts/               # JavaScript Modules (ES6+)
│   ├── storage.js          # localStorage persistence & validation
│   ├── state.js            # Application state management
│   ├── ui.js               # DOM manipulation & event handling
│   ├── validators.js       # Regex validation with real-time feedback
│   ├── search.js           # Advanced search engine with highlighting
│   ├── navigation.js       # Section navigation & routing
│   ├── theme.js            # Theme switching & persistence
│   └── tests.js            # Comprehensive test suite
├── 📁 assets/                # Static Resources
│   ├── icons/              # UI icons and graphics
│   └── fonts/              # Custom typography
├── 📄 tests.html             # Interactive test runner
├── 📄 seed.json              # Sample data (12 diverse books)
├── 📄 .gitignore             # Git ignore patterns
├── 📄 DEPLOYMENT.md          # Deployment guide
├── 📄 ACCESSIBILITY.md       # Accessibility documentation
├── 📄 TESTING.md             # Testing procedures
└── 📄 README.md              # Main documentation
```

### Architecture Highlights
- **Modular Design**: Separated concerns with dedicated files for each functionality
- **ES6+ Modules**: Modern JavaScript with import/export statements
- **CSS Architecture**: Organized stylesheets with clear separation of concerns
- **Mobile-First**: Responsive design starting from 320px breakpoint
- **Accessibility-First**: WCAG 2.1 AA compliance built into every component
- **Performance Optimized**: Minimal dependencies, efficient DOM operations

## How to Run Tests
1. Open `tests.html` in your web browser
2. Click "Run Tests" button to execute all test cases
3. View results in the test summary and detailed logs
4. Tests cover:
   - Regex validation patterns
   - Data model structure
   - Search functionality
   - Advanced pattern matching
   - Edge cases and error handling

## 🚀 Quick Start Guide

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No additional dependencies or build tools required

### Installation & Setup

#### Option 1: Direct Download
1. Download the project files
2. Open `index.html` in your browser
3. Start using the application immediately

#### Option 2: Local Development Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/divine150-coder/book-notes-vault.git
cd book-notes-vault

# Start local server (choose one):
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000

# Then open: http://localhost:8000
```

#### Option 3: Live Demo
Visit the deployed application: [https://divine150-coder.github.io/book-notes-vault/](https://divine150-coder.github.io/book-notes-vault/)

### First Steps
1. **Load Sample Data**: Go to Settings → Load Sample Data (12 diverse books)
2. **Explore Dashboard**: View statistics, progress tracking, and charts
3. **Try Search**: Use the library search with various patterns
4. **Add Your Books**: Use the Add Book form to catalog your collection
5. **Customize**: Switch themes, set reading goals, export your data

## Data Model
Each book record contains:
```json
{
  "id": "book_001",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald", 
  "pages": 180,
  "tag": "Classic",
  "dateAdded": "2024-12-01",
  "createdAt": "2024-12-01T10:00:00Z",
  "updatedAt": "2024-12-01T10:00:00Z"
}
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🧪 Testing Instructions

### Automated Testing
1. Open `tests.html` in your browser
2. Click "Run Tests" to execute the full test suite
3. Verify all tests pass (should show "10 passed, 0 failed")
4. Review detailed logs for any issues

### Manual Testing Checklist
- [ ] **Functionality**: Add, edit, delete, search, filter, sort books
- [ ] **Validation**: Test all form inputs with invalid data
- [ ] **Accessibility**: Navigate using only keyboard, test with screen reader
- [ ] **Responsive**: Test on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] **Performance**: Verify fast loading and smooth interactions
- [ ] **Data**: Test import/export, localStorage persistence

### Regex Testing
The application includes comprehensive regex validation:
- **Basic Patterns**: Title/author, pages, dates, categories
- **Advanced Patterns**: Duplicate detection, ISBN, email, passwords
- **Search Engine**: Safe compilation, highlighting, error handling

## 🌍 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Fully Supported |
| Chrome Mobile | Android 90+ | ✅ Fully Supported |

## 📊 Performance Metrics
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Lighthouse Score**: 95+ (All categories)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Test** your changes thoroughly
4. **Ensure** accessibility compliance
5. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Development Standards
- Follow existing code style and patterns
- Ensure all regex patterns are tested
- Maintain WCAG 2.1 AA accessibility compliance
- Test across multiple browsers and devices
- Update documentation for new features

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

**Developer**: Divine Mutesi  
**Email**: [d.mutesi1@alustudent.com](mailto:d.mutesi1@alustudent.com)  
**GitHub**: [https://github.com/divine150-coder](https://github.com/divine150-coder)  
**Live Demo**: [https://divine150-coder.github.io/book-notes-vault/](https://divine150-coder.github.io/book-notes-vault/)

### Additional Resources
- [Deployment Guide](DEPLOYMENT.md)
- [Accessibility Documentation](ACCESSIBILITY.md)
- [Testing Procedures](TESTING.md)
- [Issue Tracker](https://github.com/divine150-coder/book-notes-vault/issues)

---

**Built with ❤️ for book lovers everywhere**  
*Transform your reading journey with professional-grade digital library management*