document.addEventListener('DOMContentLoaded', function () {
    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent actual form submission
        document.getElementById("form-feedback").style.display = "block";
        this.reset(); // Optionally reset the form
    });
    
    document.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
    
    let dropdownTimeout;

    // Show dropdown on hover
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    dropdown.addEventListener('mouseenter', () => {
        clearTimeout(dropdownTimeout); // Clear any previous close timeout
        dropdownContent.style.display = 'block'; // Show dropdown
    });

    dropdown.addEventListener('mouseleave', () => {
        dropdownTimeout = setTimeout(() => {
            dropdownContent.style.display = 'none'; // Hide dropdown after delay
        }, 300); // 300ms delay before closing
    });

    // Also add event listeners to dropdownContent itself to avoid closing while hovering over it
    dropdownContent.addEventListener('mouseenter', () => {
        clearTimeout(dropdownTimeout);
    });
    dropdownContent.addEventListener('mouseleave', () => {
        dropdownTimeout = setTimeout(() => {
            dropdownContent.style.display = 'none';
        }, 350);
    });

    console.log("DOM fully loaded and parsed");

    let activeDropdown = null;

    // Event delegation for nested dropdowns only
    document.addEventListener('click', function (e) {
        const nestedButton = e.target.closest('.dropdown-content .dropdown > button');

        if (nestedButton) {
            console.log("Nested dropdown button clicked");

            const nestedMenu = nestedButton.nextElementSibling;
            const isExpanded = nestedButton.getAttribute('aria-expanded') === 'true';

            // If there's an active dropdown that's not the current one, close it
            if (activeDropdown && activeDropdown !== nestedMenu) {
                closeDropdown(activeDropdown);
            }

            // Toggle the current dropdown
            if (!isExpanded) {
                openDropdown(nestedMenu, nestedButton);
                activeDropdown = nestedMenu;
                console.log("Nested dropdown opened");
            } else {
                closeDropdown(nestedMenu);
                activeDropdown = null;
                console.log("Nested dropdown closed");
            }

            e.stopPropagation();
        } else {
            console.log("Clicked outside of dropdowns");
            // Close all nested dropdowns if clicking outside
            closeAllNestedDropdowns();
        }
    });

    // Close all dropdowns when the mouse leaves the dropdown area
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.addEventListener("mouseleave", closeAllNestedDropdowns);
    });

    // Function to open a dropdown
    function openDropdown(menu, button) {
        menu.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
    }

    // Function to close a specific dropdown
    function closeDropdown(menu) {
        menu.classList.remove('open');
        menu.previousElementSibling.setAttribute('aria-expanded', 'false');
    }

    // Function to close all nested dropdowns
    function closeAllNestedDropdowns() {
        console.log("Closing all nested dropdowns");
        document.querySelectorAll('.dropdown-content .dropdown-content').forEach(function(menu) {
            closeDropdown(menu);
        });
        activeDropdown = null;
    }

    function applyScrollOffset() {
        const hash = window.location.hash.substring(1);
        const targetElement = document.getElementById(hash);

        if (targetElement) {
            const headerOffset = 110;
            const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }

    // Apply offset on initial load if hash is present after full page load
    window.addEventListener('load', () => {
        if (window.location.hash) {
            applyScrollOffset();
        }
    });

    // Handle all navigation clicks in one listener for better performance
    document.body.addEventListener('click', function (e) {
        const target = e.target.closest('a[href*="#"]');
        if (target) {
            const urlParts = target.getAttribute('href').split("#");
            const targetId = urlParts[1];
            const isSamePage = urlParts[0] === '' || urlParts[0] === window.location.pathname.split('/').pop();

            if (isSamePage) {
                e.preventDefault();
                history.pushState(null, null, `#${targetId}`);
                applyScrollOffset();
            }
        }
    });

    // Reapply offset on popstate (back/forward navigation)
    window.addEventListener('popstate', () => {
        if (window.location.hash) {
            applyScrollOffset();
        }
    });

    // IntersectionObserver for section appearance on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            } else {
                entry.target.classList.remove('appear');
            }
        });
    }, { threshold: 0.05 });

    // Observe each section for scroll-triggered visibility changes
    document.querySelectorAll('section').forEach(section => observer.observe(section));

});