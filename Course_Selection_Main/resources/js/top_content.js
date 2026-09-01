document.addEventListener("DOMContentLoaded", function() {
    // Add navbar HTML
    // Note: ElginParkOrcaImage is wrapped in an <a> tag pointing to index.html
    document.body.insertAdjacentHTML("afterbegin", `
        <a id="skip-to-main-link" href="#main">Skip to main content</a>
        <ul class="l1">
            <a href="/"><img src="/resources/img/logos/logo.png" id="ElginParkOrcaImage" alt="Elgin Park Orca Logo"></a>
            <button class="nav-toggle" aria-expanded="false" aria-label="Toggle navigation">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                    <path d="M4 5h16"></path>
                    <path d="M4 12h16"></path>
                    <path d="M4 19h16"></path>
                </svg>
            </button>
            <div class="NavItem">
                <li><a data-page="" href="/" class="top-level">Home</a></li><!-- data-page is empty string for home -->
                <li><a data-page="cal" href="/cal" class="top-level">Calendar</a></li>
                <li class="dropdown">
                    <button class="dropbtn1 top-level">Departments</button>
                    <div class="dropdown-content">
                        <a class="dropbtn2" data-page="business" href="/business">Business Education</a>
                        <a class="dropbtn2" data-page="computers" href="/computers">Computer Education</a>
                        <a class="dropbtn2" data-page="careers" href="/careers">Career Education</a>
                        <a class="dropbtn2" data-page="ell" href="/ell">English Language Learning</a>
                        <a class="dropbtn2" data-page="fine_arts" href="/fine_arts">Fine Arts</a>
                        <a class="dropbtn2" data-page="home_ec" href="/home_ec">Home Economics</a>
                        <a class="dropbtn2" data-page="language_arts" href="/language_arts">Language Arts</a>
                        <a class="dropbtn2" data-page="languages" href="/languages">Languages</a>
                        <a class="dropbtn2" data-page="mathematics" href="/mathematics">Mathematics</a>
                        <a class="dropbtn2" data-page="physical_ed" href="/physical_ed">Physical Education</a>
                        <a class="dropbtn2" data-page="science" href="/science">Sciences</a>
                        <a class="dropbtn2" data-page="social_studies" href="/social_studies">Social Studies</a>
                        <a class="dropbtn2" data-page="tech_ed" href="/tech_ed">Technology Education</a>
                    </div>
                </li>
                <li class="dropdown">
                    <button class="dropbtn1 top-level">Specialized Programs</button>
                    <div class="dropdown-content">
                        <a class="dropbtn2" data-page="advanced_placement" href="/advanced_placement">Advanced Placement</a>
                        <a class="dropbtn2" data-page="leadership" href="/leadership">Leadership</a>
                    </div>
                </li>
                <li><a data-page="forms" href="/forms" class="top-level">Forms</a></li>
                <li><a data-page="HybridLearning" href="/HybridLearning" class="top-level">Hybrid Learning</a></li>
                <li><a data-page="contact" href="/contact" class="top-level">Contact</a></li>
            </div>
        </ul>
    `);

    // Get navbar element
    const navbar = document.querySelector('.l1');
    if (!navbar) return;
    const navToggle = navbar.querySelector('.nav-toggle');
    const mobileMediaQuery = window.matchMedia('(max-width: 900px)');
    let lastScroll = 0;

    const dropdowns = Array.from(navbar.querySelectorAll('.dropdown'));

    function closeDropdowns() {
        dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
    }

    function closeMobileMenu() {
        navbar.classList.remove('nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        closeDropdowns();
    }

    // Debounce function
    function debounce(func, wait = 20) { // Reduced wait time for responsiveness
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Scroll handler
    function handleScroll() {
        if (navbar.classList.contains('nav-open')) return;
        const currentScroll = window.pageYOffset;

        if (navbar) { // Check if navbar exists
            // Scrolling down and past navbar height - hide navbar
            if (currentScroll > lastScroll && currentScroll > navbar.offsetHeight) {
                navbar.classList.add('nav-hidden');
            }
            // Scrolling up - show navbar
            else if (currentScroll < lastScroll) {
                navbar.classList.remove('nav-hidden');
            }
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    }

    // Add passive scroll event listener
    const debouncedScroll = debounce(handleScroll);
    window.addEventListener('scroll', debouncedScroll, { passive: true });

    const currentPage = window.location.pathname.split("/").pop();
    const navButtons = navbar.querySelectorAll('[data-page]');

    navButtons.forEach(element => {
        if (element.getAttribute('data-page') === currentPage) {
            element.classList.add('active-link');

            // Highlight the parent dropdown button too
            const dropdown = element.closest('.dropdown');
            if (dropdown) {
                const parentButton = dropdown.querySelector('.dropbtn1');
                if (parentButton) parentButton.classList.add('active-link');
            }
        }
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = navbar.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            if (!isOpen) closeDropdowns();
            else navbar.classList.remove('nav-hidden');
        });
    }

    const dropdownButtons = navbar.querySelectorAll('.dropbtn1');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            if (!mobileMediaQuery.matches) return;
            event.preventDefault();
            const dropdown = button.closest('.dropdown');
            if (!dropdown) return;

            const willOpen = !dropdown.classList.contains('open');
            closeDropdowns();
            if (willOpen) dropdown.classList.add('open');
        });
    });

    navButtons.forEach(element => {
        element.addEventListener('click', () => {
            if (mobileMediaQuery.matches) closeMobileMenu();
        });
    });

    document.addEventListener('click', (event) => {
        if (!mobileMediaQuery.matches) return;
        if (!navbar.classList.contains('nav-open')) return;
        if (navbar.contains(event.target)) return;
        closeMobileMenu();
    });

    const handleMobileChange = (event) => {
        if (!event.matches) {
            closeMobileMenu();
        }
    };

    if (mobileMediaQuery.addEventListener) {
        mobileMediaQuery.addEventListener('change', handleMobileChange);
    } else if (mobileMediaQuery.addListener) {
        mobileMediaQuery.addListener(handleMobileChange);
    }


    // Dropdown hover/focus is handled by CSS, JS for this is removed to simplify.
    // Memory optimization for dropdowns is less critical if relying on CSS :hover.
    // Cleanup on visibility change can still be useful for scroll listener.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.removeEventListener('scroll', debouncedScroll);
        } else {
            window.addEventListener('scroll', debouncedScroll, { passive: true });
        }
    });
});

// add .html if not cloudflare pages
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch("/is-this-cloudflare");
    if (!response.ok) {
        // not cloudflare
        for (const elem of document.querySelectorAll('.NavItem a')) {
            const page = elem.getAttribute('data-page')
            if (page) {
                elem.href = `/${elem.getAttribute('data-page')}.html`;
            } else {
                // must be home page
                elem.href = '/index.html';
            }
        }
    }
});
