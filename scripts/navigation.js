// Navigation and section management
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.app-section');
    
    function showSection(targetSection) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const target = document.getElementById(targetSection);
        if (target) {
            target.classList.add('active');
        }
        
        // Update nav active state
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === targetSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.dataset.section;
            showSection(targetSection);
            window.location.hash = targetSection;
        });
    });
    
    // Set initial section
    const hash = window.location.hash || '#about';
    const initialSection = hash.substring(1) || 'about';
    showSection(initialSection);
    
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash || '#about';
        const targetSection = hash.substring(1) || 'about';
        showSection(targetSection);
    });
});
