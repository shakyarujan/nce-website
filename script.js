// Global variables
let contentData = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website
async function initializeWebsite() {
    try {
        await loadContent();
        populateContent();
        initializeNavigation();
        initializeAnimations();
        setHeroBackground();
    } catch (error) {
        console.error('Failed to initialize website:', error);
        showFallbackContent();
    }
}

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
    } catch (error) {
        console.error('Error loading content:', error);
        throw error;
    }
}

// Populate content throughout the page
function populateContent() {
    if (!contentData) return;

    // Update page title and company name
    document.title = `${contentData.company.name} - ${contentData.company.tagline}`;
    document.getElementById('company-name').textContent = contentData.company.name;

    // Hero section
    document.getElementById('hero-title').textContent = contentData.hero.title;
    document.getElementById('hero-subtitle').textContent = contentData.hero.subtitle;

    // About section
    document.getElementById('about-title').textContent = contentData.about.title;
    document.getElementById('about-description').textContent = contentData.about.content;
    
    const highlightsList = document.getElementById('about-highlights-list');
    contentData.about.highlights.forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight;
        li.classList.add('fade-in');
        highlightsList.appendChild(li);
    });

    // Services section
    populateServices();

    // Projects section -- after project listed
    // populateProjects();

    // Contact section
    document.getElementById('contact-title').textContent = contentData.contact.title;
    document.getElementById('contact-subtitle').textContent = contentData.contact.subtitle;
    document.getElementById('contact-email').textContent = contentData.contact.email;
    document.getElementById('contact-email').href = `mailto:${contentData.contact.email}`;
    document.getElementById('contact-phone').textContent = contentData.contact.phone;
    document.getElementById('contact-phone').href = `tel:${contentData.contact.phone.replace(/[^\d+]/g, '')}`;
    document.getElementById('contact-address').innerHTML = contentData.contact.address;
    // document.getElementById('contact-address').innerHTML = contentData.contact.address.replace(', ', '<br>');
    document.getElementById('contact-hours').textContent = contentData.contact.hours;

    // Footer
    document.getElementById('footer-company').innerHTML = `&copy; 2025 ${contentData.company.name}. All rights reserved.`;
}

// Populate services section
function populateServices() {
    const servicesGrid = document.getElementById('services-grid');
    
    contentData.services.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card fade-in';
        serviceCard.style.animationDelay = `${index * 0.1}s`;
        
        serviceCard.innerHTML = `
            <span class="service-icon">${service.icon}</span>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-description">${service.description}</p>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
}

// Populate projects section
function populateProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    contentData.projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        projectCard.style.animationDelay = `${index * 0.1}s`;
        
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
            <div class="project-content">
                <span class="project-type">${project.type}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Initialize navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 90; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 460; // Offset for header

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Set hero background image
function setHeroBackground() {
    if (contentData && contentData.hero.backgroundImage) {
        const heroSection = document.querySelector('.hero');
        heroSection.style.backgroundImage = `url('${contentData.hero.backgroundImage}')`;
    }
}

// Show fallback content if JSON loading fails
function showFallbackContent() {
    console.log('Loading fallback content...');
    
    // Fallback hero content
    document.getElementById('hero-title').textContent = 'Efficient, Economical, and Excellent Engineering Services';
    document.getElementById('hero-subtitle').textContent = 'Precision Engineering, Reliable Construction Solutions, Sustainable Designs';
    
    // Fallback about content
    document.getElementById('about-description').textContent = 'We provide comprehensive engineering solutions with decades of experience in the industry.';
    
    // Fallback contact
    document.getElementById('contact-email').textContent = 'info@northerncoreengineering.ca';
    document.getElementById('contact-phone').textContent = '+1 (519) 282-5962';
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll event listener with debouncing
window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

// Handle window resize events
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
});