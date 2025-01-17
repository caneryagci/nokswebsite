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
                "Time Domain Forecasting - Neural ODE Modeling": animateTimeDomainForecasting,
                "Anomaly Detection - Classification": animateAnomalyDetection,
                "Reinforcement Learning for Energy Systems": animateReinforcementLearning,
                "Data Analysis & Feature Engineering": animateDataAnalysis,
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
                case "Time Domain Forecasting - Neural ODE Modeling":
                    animation = animateTimeDomainForecasting(canvas);
                    break;
                case "Anomaly Detection - Classification":
                    animation = animateAnomalyDetection(canvas);
                    break;
                case "Reinforcement Learning for Energy Systems":
                    animation = animateReinforcementLearning(canvas);
                    break;
                case "Data Analysis & Feature Engineering":
                    animation = animateDataAnalysis(canvas);
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
    
       //Time Domain Forecasting
        function animateTimeDomainForecasting(canvas) {
            setCanvasResolution(canvas);
            const ctx = canvas.getContext('2d');
            let timeOffset = 0;
            let animationFrameId;
        
            function draw(animate = true) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
        
                ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)'; // Light blue for data visualization
                ctx.lineWidth = 2;
        
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 10) {
                    // Use a combination of sine waves to mimic forecasting curves with varying patterns
                    const y = canvas.height / 2 + Math.sin((x + timeOffset) * 0.05) * 10 + Math.sin((x + timeOffset) * 0.02) * 5;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
        
                if (animate) {
                    timeOffset += 0.5; // Slow incremental shift to create gradual, evolving curve
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
        //Anomaly Detection
        function animateAnomalyDetection(canvas) {
            setCanvasResolution(canvas);
            const ctx = canvas.getContext('2d');
            const particles = Array.from({ length: 20 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                isAnomaly: Math.random() > 0.85, // Some particles flagged as anomalies
                size: Math.random() * 3 + 1
            }));
            let animationFrameId;
        
            function draw(animate = true) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
        
                particles.forEach(particle => {
                    // Different color for anomalies
                    ctx.fillStyle = particle.isAnomaly ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 200, 200, 0.6)';
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
        
                    if (animate) {
                        particle.x += (Math.random() - 0.5) * 2;
                        particle.y += (Math.random() - 0.5) * 2;
                        // Wrap particles around edges
                        if (particle.x < 0) particle.x = canvas.width;
                        if (particle.x > canvas.width) particle.x = 0;
                        if (particle.y < 0) particle.y = canvas.height;
                        if (particle.y > canvas.height) particle.y = 0;
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
        //Reinforcement Learning
        function animateReinforcementLearning(canvas) {
            setCanvasResolution(canvas);
            const ctx = canvas.getContext('2d');
            let nodes = Array.from({ length: 10 }, (_, i) => ({
                x: (canvas.width / 10) * i + 20,
                y: canvas.height / 2,
                size: 4
            }));
            let animationFrameId;
            let step = 0;
        
            function draw(animate = true) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
        
                ctx.strokeStyle = 'rgba(0, 255, 100, 0.8)'; // Green to represent decision pathways
                ctx.lineWidth = 1.5;
        
                // Draw lines connecting nodes
                ctx.beginPath();
                for (let i = 0; i < nodes.length - 1; i++) {
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
                }
                ctx.stroke();
        
                // Draw nodes
                nodes.forEach((node, index) => {
                    ctx.fillStyle = index === step % nodes.length ? 'rgba(255, 200, 0, 0.8)' : 'rgba(0, 200, 200, 0.8)';
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                    ctx.fill();
                });
        
                if (animate) {
                    step += 1; // Gradual stepping effect along nodes
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
        //Data Analysis
        function animateDataAnalysis(canvas) {
            setCanvasResolution(canvas);
            const ctx = canvas.getContext('2d');
            let animationFrameId;
            let bars = Array.from({ length: 10 }, () => ({
                height: Math.random() * (canvas.height / 2),
                alpha: 0.2 // Start with a low opacity
            }));
        
            function draw(animate = true) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
        
                const barWidth = canvas.width / bars.length;
                bars.forEach((bar, index) => {
                    ctx.fillStyle = `rgba(100, 200, 255, ${bar.alpha})`; // Soft blue for a data-driven look
                    ctx.fillRect(index * barWidth, canvas.height - bar.height, barWidth - 5, bar.height);
        
                    if (animate) {
                        bar.alpha = Math.min(bar.alpha + 0.01, 0.8); // Gradually increase opacity
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
});