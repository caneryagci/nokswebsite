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
                case "Load Flow Analysis":
                    animation = animateSineWave(canvas);
                    break;
                case "Short Circuit Analysis":
                    animation = animateElectricPulse(canvas);
                    break;
                case "Power Quality & Reactive Power Analysis":
                    animation = animateReactiveParticles(canvas);
                    break;
                case "Harmonic Analysis":
                    animation = animateHarmonicWaves(canvas);
                    break;
                case "Transformer Energisation Study":
                    animation = animateTransformerRings(canvas);
                    break;
                case "Insulation Coordination Study":
                    animation = animateVoltageSpikes(canvas);
                    break;
                case "Under-frequency & Load Shedding Study":
                    animation = animateFrequencyWave(canvas);
                    break;
                case "Static & Dynamic Security Assessment":
                    animation = animateOscillatingGrid(canvas);
                    break;
                case "Congestion Management":
                    animation = animateFlowingArrows(canvas);
                    break;
                case "Long Term Investment":
                    animation = animateExpandingCircles(canvas);
                    break;
                case "Stochastic Energy Optimization":
                    animation = animateStochasticDots(canvas);
                    break;
                case "Motor Starting Calculations":
                    animation = animateMotorRipples(canvas);
                    break;
                case "Digital Twin":
                    animation = animateRotatingElements(canvas);
                    break;
                case "Grid Code Compliance":
                    animation = animatePulseGrid(canvas);
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
                        const y = canvas.height / 3 + Math.sin((x + offset + i * 25) * 0.03) * (5 + i * 6);
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
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = 'rgba(255, 100, 0, 0.8)';
                ctx.lineWidth = 3;

                const spikeWidth = canvas.width / 20;
                for (let i = 0; i < canvas.width; i += spikeWidth * 2) {
                    const spikeHeight = Math.random() * (canvas.height / 2);
                    ctx.moveTo(i, canvas.height);
                    ctx.lineTo(i + spikeWidth / 2, canvas.height - spikeHeight);
                    ctx.lineTo(i + spikeWidth, canvas.height);
                }
                ctx.stroke();

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

                ctx.strokeStyle = 'rgba(0, 200, 255, 0.7)';
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
});