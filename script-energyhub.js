document.addEventListener('DOMContentLoaded', function () {
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
    
    document.querySelectorAll('section').forEach(section => observer.observe(section));

        // Background animations for service cards triggered on hover only
        function applyBackgroundAnimation(canvas, title) {
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
    
            const animations = {
                "Distributed Energy Resources": animateDistributedEnergy,
                "EV Charging Optimization": animateEVCharging,
                "Flexibility Management": animateFlexibilityManagement,
                "Green Hydrogen Solutions": animateGreenHydrogen,
                "Intelligent Battery and Renewable Energy Systems": animateIntelligentBattery,
                "Industrial Load Planning, Modeling & Optimization": animateIndustrialLoadPlanning,
            };

            let animationFrameId; // Store the requestAnimationFrame ID
            
            function startAnimation() {
                const animationFunction = animations[title];
                if (animationFunction) {
                    // Start the animation loop
                    animationFrameId = requestAnimationFrame(() => animationFunction(canvas, ctx, startAnimation));
                }
            }
            
            function stopAnimation() {
                // Cancel the animation frame
                cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas when hover ends
            }
        
            return { startAnimation, stopAnimation };
        }
    
        // Adding hover events to initiate start/stop for each service card based on title
        document.querySelectorAll('.service-card').forEach(card => {
            const canvas = card.querySelector('.card-canvas');
            const title = card.querySelector('h3').innerText;
            
            let animation;

            switch (title) {
                case "Distributed Energy Resources":
                    animation = animateDistributedEnergy(canvas);
                    break;
                case "EV Charging Optimization":
                    animation = animateEVCharging(canvas);
                    break;
                case "Flexibility Management":
                    animation = animateFlexibilityManagement(canvas);
                    break;
                case "Green Hydrogen Solutions":
                    animation = animateGreenHydrogen(canvas);
                    break;
                case "Intelligent Battery and Renewable Energy Systems":
                    animation = animateIntelligentBattery(canvas);
                    break;
                case "Industrial Load Planning, Modeling & Optimization":
                    animation = animateIndustrialLoadPlanning(canvas);
                    break;
            }

            if (animation) {
                animation.renderStaticFrame(); // Display initial static frame for each card
                card.addEventListener('mouseenter', animation.start);
                card.addEventListener('mouseleave', animation.stop);
            }
        });
        
        // Set Canvas Resolution for High-DPI Screens
        function setCanvasResolution(canvas) {
            const ctx = canvas.getContext('2d');
            const scale = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;
            ctx.scale(scale, scale);
        }
    
       //DER
    function animateDistributedEnergy(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        const nodes = Array.from({ length: 15 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 2,
            pulseRadius: 0
        }));
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 255, 150, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
    
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 150, 0.8)';
                ctx.fill();
    
                if (animate) {
                    node.pulseRadius = (node.pulseRadius + 0.5) % 20; // Reset pulse radius for continuous pulse effect
                }
            });
    
            if (animate) {
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() { draw(false); }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }

    function animateEVCharging(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            ctx.strokeStyle = 'rgba(50, 150, 255, 0.8)'; // Blue for electricity flow
            ctx.lineWidth = 2;
    
            for (let y = 0; y < canvas.height; y += 20) {
                ctx.beginPath();
                ctx.moveTo(0, y + offset % 20);
                ctx.lineTo(canvas.width, y + offset % 20);
                ctx.stroke();
            }
    
            if (animate) {
                offset += 1;
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() { draw(false); }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }

    function animateFlexibilityManagement(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let waveOffset = 0;
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            ctx.strokeStyle = 'rgba(255, 200, 50, 0.7)'; // Soft yellow for flexibility
            ctx.lineWidth = 1.5;
    
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 5) {
                    const y = canvas.height / 2 + Math.sin((x + waveOffset) * 0.05) * (5 + i * 4);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
    
            if (animate) {
                waveOffset += 0.1; // Smooth oscillation for flexibility
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() { draw(false); }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }

    function animateGreenHydrogen(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let circles = [{ radius: 10, alpha: 1 }];
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            circles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, circle.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 255, 100, ${circle.alpha})`;
                ctx.lineWidth = 2;
                ctx.stroke();
    
                if (animate) {
                    circle.radius += 1;
                    circle.alpha -= 0.01;
                }
            });
    
            if (animate) {
                circles = circles.filter(circle => circle.alpha > 0); // Remove faded circles
                if (circles.length < 5) circles.push({ radius: 10, alpha: 1 }); // Add new circle
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() { draw(false); }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }

    function animateIntelligentBattery(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let bars = Array.from({ length: 10 }, () => ({
            height: Math.random() * canvas.height * 0.5
        }));
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            const barWidth = canvas.width / bars.length;
    
            bars.forEach((bar, index) => {
                ctx.fillStyle = 'rgba(0, 200, 255, 0.7)';
                ctx.fillRect(index * barWidth, canvas.height - bar.height, barWidth - 5, bar.height);
    
                if (animate) {
                    bar.height += (Math.random() - 0.5) * 2;
                    bar.height = Math.min(Math.max(bar.height, 10), canvas.height * 0.5);
                }
            });
    
            if (animate) {
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() { draw(false); }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }

    function animateIndustrialLoadPlanning(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            ctx.lineWidth = 1;
    
            const gridSize = 20;
    
            for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
    
            for (let y = offset % gridSize; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
    
            if (animate) {
                offset += 0.5; // Slow movement for a structured look
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() { draw(false); }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }
});