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


    // Toggle visibility for each service section
    document.querySelectorAll('.service-link-overview').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = link.getAttribute('data-target');
            const servicesContainer = document.getElementById(targetId);

            // Toggle visibility and ensure static frame is shown initially
            if (servicesContainer.classList.contains('hidden')) {
                servicesContainer.classList.remove('hidden');
                servicesContainer.classList.add('show');
                console.log(`Showing services container: ${targetId}`);

                // Initialize canvas animations and hover events for each service card within the shown container
                servicesContainer.querySelectorAll('.service-card').forEach(card => {
                    const canvas = card.querySelector('.card-canvas');
                    const title = card.querySelector('h3').innerText;

                    // Define animations by title, each function returns an object with control methods
                    const animations = {
                        "Load Flow Analysis": animateSineWave,
                        "Short Circuit Analysis": animateElectricPulse,
                        "Power Quality & Reactive Power Analysis": animateReactiveParticles,
                        "Harmonic Analysis": animateHarmonicWaves,
                        "Transformer Energisation Study": animateTransformerRings,
                        "Insulation Coordination Study": animateVoltageSpikes,
                        "Under-frequency & Load Shedding Study": animateFrequencyWave,
                        "Static & Dynamic Security Assessment": animateOscillatingGrid,
                        "Congestion Management": animateFlowingArrows,
                        "Long Term Investment": animateExpandingCircles,
                        "Stochastic Energy Optimization": animateStochasticDots,
                        "Motor Starting Calculations": animateMotorRipples,
                        "Digital Twin": animateRotatingElements,
                        "Grid Code Compliance": animatePulseGrid,
                        "Time Domain Forecasting - Neural ODE Modeling": animateTimeDomainForecasting,
                        "Anomaly Detection - Classification": animateAnomalyDetection,
                        "Reinforcement Learning for Energy Systems": animateReinforcementLearning,
                        "Data Analysis & Feature Engineering": animateDataAnalysis,
                        "Distributed Energy Resources": animateDistributedEnergy,
                        "EV Charging Optimization": animateEVCharging,
                        "Flexibility Management": animateFlexibilityManagement,
                        "Green Hydrogen Solutions": animateGreenHydrogen,
                        "Intelligent Battery and Renewable Energy Systems": animateIntelligentBattery,
                        "Industrial Load Planning, Modeling & Optimization": animateIndustrialLoadPlanning,
                        "Residential Energy Systems": animateResidentialEnergy,
                        "Intelligent Residential Heat Pump Solutions": animateResidentialHeatPump
                    };

                    const animation = animations[title]?.(canvas);

                    // Render the initial static frame if animation exists
                    if (animation) {
                        animation.renderStaticFrame();
                        console.log(`Rendering initial static frame for card: ${title}`);

                        // Start/stop animations on hover
                        card.addEventListener('mouseenter', () => {
                            console.log(`Starting animation for card: ${title}`);
                            animation.start();
                        });
                        card.addEventListener('mouseleave', () => {
                            console.log(`Stopping animation and reverting to static frame for card: ${title}`);
                            animation.stop(); // Stop animation and revert to static frame
                        });
                    }
                });
            } else {
                servicesContainer.classList.remove('show');
                servicesContainer.classList.add('hidden');
                console.log(`Hiding services container: ${targetId}`);
            }
        });
    });


    // Set canvas resolution for high-DPI screens
    function setCanvasResolution(canvas) {
        const ctx = canvas.getContext('2d');
        const scale = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * scale;
        canvas.height = canvas.offsetHeight * scale;
        ctx.scale(scale, scale);
    }

    // Animation Functions

    // Load Flow Analysis - Sine Wave with Static Frame
    function animateSineWave(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gridSize = 20;
            ctx.strokeStyle = 'rgba(0, 255, 180, 0.8)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    const waveOffset = Math.sin((x + offset) * 0.02) * 160;
                    ctx.moveTo(x, y + waveOffset);
                    ctx.lineTo(x, y + waveOffset + gridSize);
                }
            }
            ctx.stroke();

            if (animate) {
                offset += 0.05;
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }

        // Render a single static frame
        function renderStaticFrame() {
            draw(false); // Call draw without advancing animation
        }

        return {
            start() { draw(); },
            stop() { 
                cancelAnimationFrame(animationFrameId); 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                renderStaticFrame(); // Render static frame after stopping
            },
            renderStaticFrame
        };
    }

    // Short Circuit Analysis - Electric Pulse with Static Frame
    function animateElectricPulse(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const pulseFrequency = 0.1;
            const pulseMagnitude = 80;
            ctx.strokeStyle = 'rgba(255, 80, 80, 0.8)';
            ctx.lineWidth = 2.0;

            for (let i = 0; i < 10; i++) {
                const x = canvas.width / 2;
                const y = (canvas.height / 10) * i + offset;
                const pulseSize = Math.sin((i + offset) * pulseFrequency) * pulseMagnitude;

                ctx.beginPath();
                ctx.moveTo(x - pulseSize, y);
                ctx.lineTo(x + pulseSize, y);
                ctx.stroke();
            }

            if (animate) {
                offset += 0.15;
                if (offset > canvas.height / 10) offset = 0;
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }

        // Render a single static frame
        function renderStaticFrame() {
            draw(false); // Call draw without advancing animation
        }

        return {
            start() { draw(); },
            stop() { 
                cancelAnimationFrame(animationFrameId); 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                renderStaticFrame(); // Render static frame after stopping
            },
            renderStaticFrame
        };
    }
            
            
    // Power Quality & Reactive Power Analysis - Particles with Static Frame
    function animateReactiveParticles(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        const particles = Array.from({ length: 20 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        }));
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(0, 180, 255, 0.8)';
            particles.forEach((particle) => {
                if (animate) {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    // Wrap particles around edges
                    if (particle.x < 0) particle.x = canvas.width;
                    if (particle.x > canvas.width) particle.x = 0;
                    if (particle.y < 0) particle.y = canvas.height;
                    if (particle.y > canvas.height) particle.y = 0;
                }

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });

            if (animate) {
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }

        // Render a single static frame
        function renderStaticFrame() {
            draw(false); // Call draw without advancing animation
        }

        return {
            start() { draw(); },
            stop() { 
                cancelAnimationFrame(animationFrameId); 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                renderStaticFrame(); // Render static frame after stopping
            },
            renderStaticFrame
        };
    }
        
    // Harmonic Analysis - Oscillating Waves with Static Frame
    function animateHarmonicWaves(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(150, 50, 255, 0.8)';
            ctx.lineWidth = 1.5;

            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 10) {
                    const y = canvas.height / 3 + Math.sin((x + offset + i * 15) * 0.05) * (1 + i * 6);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            if (animate) {
                offset += 0.3;
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }

        // Render a single static frame
        function renderStaticFrame() {
            draw(false); // Call draw without advancing animation
        }

        return {
            start() { draw(); },
            stop() { 
                cancelAnimationFrame(animationFrameId); 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                renderStaticFrame(); // Render static frame after stopping
            },
            renderStaticFrame
        };
    }


    // Transformer Energisation Study - Expanding Rings with Static Frame
    function animateTransformerRings(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let rings = [
            { radius: 20, alpha: 1 },
            { radius: 50, alpha: 0.6 },
            { radius: 80, alpha: 0.3 }
        ];
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 3;

            rings.forEach(ring => {
                ctx.beginPath();
                ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 204, 0, ${ring.alpha})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                if (animate) {
                    ring.radius += 0.5;
                    ring.alpha -= 0.005;
                }
            });

            if (animate) {
                rings = rings.filter(ring => ring.alpha > 0);
                if (rings.length < 3) rings.push({ radius: 20, alpha: 1 });
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }

        // Render a single static frame
        function renderStaticFrame() {
            draw(false); // Call draw without advancing animation
        }

        return {
            start() { draw(); },
            stop() { 
                cancelAnimationFrame(animationFrameId); 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                renderStaticFrame(); // Render static frame after stopping
            },
            renderStaticFrame
        };
    }
    // Insulation Coordination Study - Voltage Spikes with Static Frame
    function animateVoltageSpikes(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a'; // Black background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            // Set stroke style and shadow for glowing effect
            ctx.strokeStyle = 'rgba(255, 80, 0, 0.8)'; // Soft orange glow
            ctx.shadowColor = 'rgba(255, 140, 0, 0.4)'; // Light orange shadow for glow
            ctx.shadowBlur = 10;
            ctx.lineWidth = 2; // Sleeker line width for minimalist design
    
            const spikeWidth = canvas.width / 20; // Thinner spike width for more defined spikes
            for (let i = 0; i < canvas.width; i += spikeWidth * 1.5) {
                const spikeHeight = Math.random() * (canvas.height / 5) + canvas.height / 5; // Randomized height within a controlled range
                ctx.beginPath();
                ctx.moveTo(i, canvas.height);
                ctx.lineTo(i + spikeWidth / 2, canvas.height - spikeHeight);
                ctx.lineTo(i + spikeWidth, canvas.height);
                ctx.stroke();
            }
    
            if (animate) {
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() { draw(false); }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }

    // Under-frequency & Load Shedding Study - Frequency Wave with Static Frame
    function animateFrequencyWave(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(0, 200, 255, 0.8)';
            ctx.lineWidth = 2;
            const centerY = canvas.height / 4;

            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 3) {
                const y = centerY + Math.sin((x + offset) * 0.03) * 30;
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            if (animate) {
                offset += 1;
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }

        // Render a single static frame
        function renderStaticFrame() {
            draw(false); // Call draw without advancing animation
        }

        return {
            start() { draw(); },
            stop() { 
                cancelAnimationFrame(animationFrameId); 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                renderStaticFrame(); // Render static frame after stopping
            },
            renderStaticFrame
        };
    }
    //Static & Dynamic Security Assessment
    function animateOscillatingGrid(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            const gridSize = 25;
            ctx.strokeStyle = 'rgba(0, 120, 255, 0.8)';
            ctx.lineWidth = 1;
    
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    const offsetY = Math.sin((x + offset) * 0.1) * 10;
                    ctx.beginPath();
                    ctx.moveTo(x, y + offsetY);
                    ctx.lineTo(x + gridSize, y + offsetY);
                    ctx.stroke();
                }
            }
    
            if (animate) {
                offset += 0.2;
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() {
            draw(false);
        }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }
    //Congestion Management
    function animateFlowingArrows(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a'; // Black background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create gradient for arrows
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'rgba(0, 255, 100, 0.1)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 100, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 255, 100, 0.1)');

            ctx.strokeStyle = gradient;
            ctx.shadowColor = 'rgba(0, 255, 100, 0.3)';
            ctx.shadowBlur = 8;
            ctx.lineWidth = 1.2;

            // Draw flowing arrows
            const arrowSize = 10;
            for (let y = 0; y < canvas.height; y += 25) {
                for (let x = 0; x < canvas.width; x += 40) {
                    const xPos = x + (offset % 40);

                    ctx.beginPath();
                    ctx.moveTo(xPos, y);
                    ctx.lineTo(xPos + arrowSize, y - arrowSize / 2);
                    ctx.lineTo(xPos + arrowSize, y + arrowSize / 2);
                    ctx.closePath();
                    ctx.stroke();
                }
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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }
    //Long Term Investment
    function animateExpandingCircles(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let circles = [
            { x: canvas.width / 2, y: canvas.height / 2, radius: 20, alpha: 1 },
            { x: canvas.width / 3, y: canvas.height / 3, radius: 40, alpha: 0.5 },
            { x: canvas.width / 1.5, y: canvas.height / 1.5, radius: 60, alpha: 0.2 }
        ];
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            circles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(100, 200, 255, ${circle.alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
    
                if (animate) {
                    circle.radius += 0.3;
                    circle.alpha -= 0.005;
                }
            });
    
            if (animate) {
                circles = circles.filter(circle => circle.alpha > 0);
                if (circles.length < 3) circles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 20, alpha: 1 });
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() {
            draw(false);
        }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }
    //Stochastic Energy Optimization
    function animateStochasticDots(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        const dots = Array.from({ length: 30 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3
        }));
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a'; // Black background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White dots for contrast
            dots.forEach(dot => {
                if (animate) {
                    dot.x += dot.speedX;
                    dot.y += dot.speedY;
    
                    // Wrap dots around edges
                    if (dot.x < 0) dot.x = canvas.width;
                    if (dot.x > canvas.width) dot.x = 0;
                    if (dot.y < 0) dot.y = canvas.height;
                    if (dot.y > canvas.height) dot.y = 0;
                }
    
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
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
    //Motor Starting
    function animateMotorRipples(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let lines = Array.from({ length: 20 }, () => ({
            angle: Math.random() * Math.PI * 2,
            length: 5,
            alpha: 1
        }));
        let animationFrameId;

        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a'; // Black background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            lines.forEach(line => {
                const endX = centerX + Math.cos(line.angle) * line.length;
                const endY = centerY + Math.sin(line.angle) * line.length;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = `rgba(255, 165, 0, ${line.alpha})`; // Subtle orange glow for surge effect
                ctx.lineWidth = 1.5;
                ctx.stroke();

                if (animate) {
                    line.length += 2; // Increase length to simulate outward surge
                    line.alpha -= 0.02; // Fade out quickly to capture surge
                }
            });

            if (animate) {
                lines = lines.filter(line => line.alpha > 0);
                if (lines.length < 20) {
                    lines.push({
                        angle: Math.random() * Math.PI * 2,
                        length: 5,
                        alpha: 1
                    });
                }
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
    //Digital Twin
    function animateRotatingElements(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let rotationAngle = 0;
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
    
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationAngle);
    
            // Draw rotating squares
            for (let i = 0; i < 4; i++) {
                ctx.strokeStyle = `rgba(255, 255, 100, 0.6)`;
                ctx.lineWidth = 2;
                ctx.strokeRect(-20 * (i + 1), -20 * (i + 1), 40 * (i + 1), 40 * (i + 1));
            }
            ctx.restore();
    
            if (animate) {
                rotationAngle += 0.01;
                animationFrameId = requestAnimationFrame(() => draw(true));
            }
        }
    
        function renderStaticFrame() {
            draw(false);
        }
    
        return {
            start() { draw(); },
            stop() {
                cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderStaticFrame();
            },
            renderStaticFrame
        };
    }
    //Grid Code Compliance
    function animatePulseGrid(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let offset = 0;
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a'; // Black background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            const gridSize = 20;
            ctx.strokeStyle = 'rgba(0, 200, 100, 0.6)'; // Subtle green lines
            ctx.lineWidth = 1;
    
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    const pulseOffset = Math.sin((x + y + offset) * 0.05) * 5;
                    ctx.beginPath();
                    ctx.moveTo(x + pulseOffset, y);
                    ctx.lineTo(x + pulseOffset, y + gridSize);
                    ctx.stroke();
                }
            }
    
            if (animate) {
                offset += 0.5;
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
    //Residential Energy Systems (Solar PV, EV Charging, Energy Storage)
    function animateResidentialEnergy(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let dots = Array.from({ length: 20 }, (_, i) => ({
            x: (canvas.width / 20) * i,
            y: canvas.height / 2 + (Math.random() - 0.5) * 20,
            speed: Math.random() * 1 + 0.5
        }));
        let animationFrameId;
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            dots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Gold color for solar energy
                ctx.fill();
    
                if (animate) {
                    dot.x += dot.speed;
                    if (dot.x > canvas.width) dot.x = 0; // Loop dots to represent continuous energy flow
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
    //Intelligent Residential Heat Pump Solutions
    function animateResidentialHeatPump(canvas) {
        setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let bars = Array.from({ length: 10 }, (_, i) => ({
            height: Math.random() * (canvas.height / 2),
            speed: (Math.random() - 0.5) * 0.5
        }));
    
        function draw(animate = true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            const barWidth = canvas.width / bars.length;
            bars.forEach((bar, index) => {
                ctx.fillStyle = 'rgba(0, 150, 255, 0.8)'; // Blue for cooling effect
                ctx.fillRect(index * barWidth, canvas.height - bar.height, barWidth - 5, bar.height);
    
                if (animate) {
                    // Adjust height for slight "pulsing" effect, simulating heat pump adjustments
                    bar.height += bar.speed;
                    if (bar.height > canvas.height / 1.5 || bar.height < canvas.height / 4) {
                        bar.speed *= -1; // Reverse direction for smooth oscillation
                    }
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

    // Canvas animation for circular waveform if canvas element is present
    const canvas = document.getElementById("hero-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");


        let animationFrame; // Store the animation frame
        let waveOffset = 0; // Controls wave movement
        let dataPoints = []; // Array to store data point positions

        function resizeCanvas() {
            if (window.innerWidth < 768) {
                canvas.width = window.innerWidth / 2; // Lower resolution for small screens
                canvas.height = window.innerHeight / 2;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }

        // Throttled resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            cancelAnimationFrame(animationFrame); // Stop the current animation loop
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                drawCircularWaveform(); // Restart animation after resizing
            }, 1000); // Adjust delay as needed
        });

        resizeCanvas();

        // Generate initial positions for data points along the wave
        function initializeDataPoints() {
            dataPoints = []; // Clear existing points to avoid duplicates
            for (let i = 0; i < 10; i++) {
                dataPoints.push({
                    angle: (i / 10) * Math.PI * 2,
                    speed: 0.001 + Math.random() * 0.0001, // Random speed for each point
                });
            }
        }
        

        function drawCircularWaveform() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Define center point
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2.4;

            // Base properties for tubular effect
            const baseRadius = Math.min(canvas.width, canvas.height) / 1.1;
            const layers = 10;
            const layerSpacing = 1;
            const baseAmplitude = 12;

            for (let i = 0; i < layers; i++) {
                const radius = baseRadius + i * layerSpacing;
                const amplitude = baseAmplitude - i * 20;
                const opacity = 0.9 - i * 0.2;
                const lineWidth = 2 + i * 1; // Thinner lines for a professional look

                // Gradient for a blue-to-green transition (power to renewable theme)
                const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + amplitude);
                gradient.addColorStop(0, `rgba(0, 123, 255, ${opacity})`); // Blue center
                gradient.addColorStop(1, `rgba(0, 200, 83, ${opacity * 0.5})`); // Fainter Green outer

                ctx.beginPath();
                for (let angle = 0; angle <= Math.PI * 2; angle += 0.15) {
                    const offset = amplitude * Math.sin(angle * 4 + waveOffset + i * 0.3);
                    const x = centerX + (radius + offset) * Math.cos(angle);
                    const y = centerY + (radius + offset) * Math.sin(angle);

                    if (angle === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.closePath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = lineWidth;

                ctx.stroke();
            }

            // Reset shadow before drawing data points
            ctx.shadowColor = "transparent";

            // Draw moving energy "data points" along the wave
            dataPoints.forEach(point => {
                const angle = point.angle;
                const amplitude = baseAmplitude;
                const radius = baseRadius + layerSpacing * 2; // Position data points around the second layer

                // Calculate position based on angle
                const offset = amplitude * Math.sin(angle * 4 + waveOffset);
                const x = centerX + (radius + offset) * Math.cos(angle);
                const y = centerY + (radius + offset) * Math.sin(angle);

                // Draw the data point
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2); // Pulsing effect
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.fill();

                // Update angle to move the point along the wave
                point.angle += point.speed;
                if (point.angle > Math.PI * 2) {
                    point.angle -= Math.PI * 2; // Reset angle if it completes a full loop
                }
            });

            waveOffset += 0.01; // Slow movement for smooth animation
            animationFrame = requestAnimationFrame(drawCircularWaveform); // Save the frame ID
        }


        initializeDataPoints(); // Initialize data points
        drawCircularWaveform();
    }
});