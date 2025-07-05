// script.js
console.log('Desi Hotspot script loaded.'); 

// Desi Hotspot Menu Filtering and Search Functionality
class MenuFilter {
    constructor() {
        this.searchInput = document.getElementById('menu-search');
        this.clearSearchBtn = document.getElementById('clear-search');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.menuItems = document.querySelectorAll('.menu-item');
        this.menuSections = document.querySelectorAll('.menu-section');
        this.menuContainer = document.querySelector('.menu-container');
        
        this.currentCategory = 'all';
        this.currentSearch = '';
        
        this.init();
    }
    
    init() {
        // Add event listeners
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        if (this.clearSearchBtn) {
            this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        }
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryFilter(e.target.dataset.category));
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearAllFilters();
            }
        });
        
        console.log('Desi Hotspot menu filtering system loaded successfully!');
    }
    
    handleSearch(searchTerm) {
        this.currentSearch = searchTerm.toLowerCase().trim();
        this.filterMenu();
    }
    
    handleCategoryFilter(category) {
        this.currentCategory = category;
        
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        this.filterMenu();
    }
    
    filterMenu() {
        let hasVisibleItems = false;
        let visibleItemsCount = 0;
        
        this.menuItems.forEach(item => {
            const itemName = item.dataset.name.toLowerCase();
            const itemCategory = item.dataset.category;
            
            // Check if item matches current filters
            const matchesCategory = this.currentCategory === 'all' || itemCategory === this.currentCategory;
            const matchesSearch = this.currentSearch === '' || 
                                itemName.includes(this.currentSearch) ||
                                item.querySelector('.dish-name').textContent.toLowerCase().includes(this.currentSearch) ||
                                item.querySelector('.dish-desc').textContent.toLowerCase().includes(this.currentSearch);
            
            if (matchesCategory && matchesSearch) {
                this.showMenuItem(item);
                if (this.currentSearch !== '') {
                    this.highlightMenuItem(item);
                } else {
                    this.removeHighlight(item);
                }
                hasVisibleItems = true;
                visibleItemsCount++;
            } else {
                this.hideMenuItem(item);
                this.removeHighlight(item);
            }
        });
        
        // Show/hide sections based on visible items
        this.menuSections.forEach(section => {
            const sectionItems = section.querySelectorAll('.menu-item');
            const hasVisibleSectionItems = Array.from(sectionItems).some(item => 
                !item.classList.contains('hidden')
            );
            
            if (hasVisibleSectionItems) {
                this.showMenuSection(section);
            } else {
                this.hideMenuSection(section);
            }
        });
        
        // Show no results message if needed
        this.showNoResultsMessage(!hasVisibleItems, visibleItemsCount);
        
        // Update search input placeholder with results count
        this.updateSearchPlaceholder(visibleItemsCount);
    }
    
    showMenuItem(item) {
        item.classList.remove('hidden');
        item.style.display = 'flex';
    }
    
    hideMenuItem(item) {
        item.classList.add('hidden');
    }
    
    showMenuSection(section) {
        section.classList.remove('hidden');
        section.style.display = 'block';
    }
    
    hideMenuSection(section) {
        section.classList.add('hidden');
    }
    
    highlightMenuItem(item) {
        item.classList.add('highlight');
    }
    
    removeHighlight(item) {
        item.classList.remove('highlight');
    }
    
    showNoResultsMessage(show, count = 0) {
        let noResultsEl = document.querySelector('.no-results');
        
        if (show) {
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.className = 'no-results';
                noResultsEl.innerHTML = `
                    <h3>No dishes found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                `;
                this.menuContainer.appendChild(noResultsEl);
            }
        } else {
            if (noResultsEl) {
                noResultsEl.remove();
            }
        }
    }
    
    updateSearchPlaceholder(count) {
        if (this.searchInput) {
            if (this.currentSearch === '') {
                this.searchInput.placeholder = 'Search dishes...';
            } else {
                this.searchInput.placeholder = `Found ${count} dish${count !== 1 ? 'es' : ''}`;
            }
        }
    }
    
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.currentSearch = '';
        this.filterMenu();
    }
    
    clearAllFilters() {
        this.clearSearch();
        this.handleCategoryFilter('all');
    }
    
    // Utility method to get current filter state
    getFilterState() {
        return {
            category: this.currentCategory,
            search: this.currentSearch,
            visibleItems: document.querySelectorAll('.menu-item:not(.hidden)').length
        };
    }
}

// Testimonials Carousel Functionality
class TestimonialsCarousel {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 1;
        this.totalSlides = this.testimonials.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (this.testimonials.length === 0) return;
        
        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideNumber = parseInt(e.target.dataset.slide);
                this.goToSlide(slideNumber);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Add touch/swipe support for mobile
        this.addTouchSupport();
        
        // Start auto-play
        this.startAutoPlay();
        
        // Pause auto-play on hover
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        console.log('Desi Hotspot testimonials carousel loaded successfully!');
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        // Remove active class from current slide and dot
        this.testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to new slide and dot
        const targetTestimonial = document.querySelector(`[data-slide="${slideNumber}"]`);
        const targetDot = document.querySelector(`.dot[data-slide="${slideNumber}"]`);
        
        if (targetTestimonial) targetTestimonial.classList.add('active');
        if (targetDot) targetDot.classList.add('active');
        
        this.currentSlide = slideNumber;
        
        // Restart auto-play timer
        this.restartAutoPlay();
    }
    
    nextSlide() {
        const nextSlide = this.currentSlide === this.totalSlides ? 1 : this.currentSlide + 1;
        this.goToSlide(nextSlide);
    }
    
    prevSlide() {
        const prevSlide = this.currentSlide === 1 ? this.totalSlides : this.currentSlide - 1;
        this.goToSlide(prevSlide);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    addTouchSupport() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return;
        
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next slide
                this.nextSlide();
            } else {
                // Swiped right - previous slide
                this.prevSlide();
            }
        }
    }
}

// Hamburger Menu Functionality
class HamburgerMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileOverlay = document.querySelector('.mobile-menu-overlay');
        this.mobileClose = document.querySelector('.mobile-close');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.hamburger) return;
        
        // Hamburger button click
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close button click
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => this.closeMenu());
        }
        
        // Overlay click
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Mobile nav links click
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Prevent body scroll when menu is open
        this.mobileMenu.addEventListener('transitionend', () => {
            if (this.isOpen) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
        
        console.log('Desi Hotspot hamburger menu loaded successfully!');
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.hamburger.classList.add('active');
        this.mobileMenu.classList.add('active');
        this.mobileOverlay.classList.add('active');
    }
    
    closeMenu() {
        this.isOpen = false;
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Initialize menu filtering when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hamburger menu
    new HamburgerMenu();
    
    // Only initialize on menu page
    if (document.querySelector('.menu-filters')) {
        new MenuFilter();
    }
    
    // Initialize testimonials carousel if present
    if (document.querySelector('.testimonials-carousel')) {
        new TestimonialsCarousel();
    }
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation for better perceived performance
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});

// Add some fun interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click-to-copy price functionality (for fun)
    const prices = document.querySelectorAll('.dish-price');
    prices.forEach(price => {
        price.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.style.color = 'var(--sage-green)';
            
            // Copy to clipboard if supported
            if (navigator.clipboard) {
                navigator.clipboard.writeText(originalText);
            }
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = 'var(--deep-orange)';
            }, 1000);
        });
        
        price.style.cursor = 'pointer';
        price.title = 'Click to copy price';
    });
}); 