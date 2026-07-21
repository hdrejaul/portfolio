// ==========================================
// BACKGROUND CANVAS CIRCUITS ANIMATION
// ==========================================

const canvas = document.getElementById("circuit-canvas");
const ctx = canvas.getContext("2d");

let nodes = [];
const maxNodes = 60;
const connectDist = 120;
let particleColor = "rgba(14, 165, 233, 0.4)";
let lineColor = "rgba(14, 165, 233, 0.08)";

class CircuitNode {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
    }
}

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    nodes = [];
    for (let i = 0; i < maxNodes; i++) {
        nodes.push(new CircuitNode());
    }
}

function drawLines() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectDist) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1 - dist / connectDist;
                ctx.stroke();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    nodes.forEach(node => {
        node.update();
        node.draw();
    });
    
    drawLines();
    requestAnimationFrame(animateCanvas);
}

// Adjust colors depending on theme
function updateCanvasTheme(isDark) {
    if (isDark) {
        particleColor = "rgba(14, 165, 233, 0.4)";
        lineColor = "rgba(14, 165, 233, 0.08)";
    } else {
        particleColor = "rgba(2, 132, 199, 0.25)";
        lineColor = "rgba(2, 132, 199, 0.05)";
    }
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==========================================
// DYNAMIC TYPING WRITER
// ==========================================

const subTitles = [
    "Technical Executive",
    "RMA Diagnostics Expert",
    "PCB Repair Specialist",
    "Hardware Quality Inspector"
];
let titleIndex = 0;
let charIdx = 0;
let isDeleting = false;
const typeSpeed = 100;
const eraseSpeed = 50;
const delayBetween = 2500;
const dynamicTitleElement = document.getElementById("dynamic-title");

function runTypewriter() {
    if (!dynamicTitleElement) return;

    const currentText = subTitles[titleIndex];
    
    if (isDeleting) {
        dynamicTitleElement.textContent = currentText.substring(0, charIdx - 1);
        charIdx--;
    } else {
        dynamicTitleElement.textContent = currentText.substring(0, charIdx + 1);
        charIdx++;
    }

    let dynamicDelay = isDeleting ? eraseSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentText.length) {
        isDeleting = true;
        dynamicDelay = delayBetween; // Pause at end of title
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % subTitles.length;
        dynamicDelay = 500; // Small pause before writing next title
    }

    setTimeout(runTypewriter, dynamicDelay);
}

// ==========================================
// THEME SWITCHER (DARK / LIGHT)
// ==========================================

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function getSystemTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
    if (theme === "light") {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        updateCanvasTheme(false);
    } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        updateCanvasTheme(true);
    }
    localStorage.setItem("portfolio-theme", theme);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.classList.contains("dark-theme") ? "dark" : "light";
        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
}

// ==========================================
// SCROLL SPY & NAVBAR NAVIGATION
// ==========================================

// ==========================================
// UNIFIED SEAMLESS FLOW NAVIGATION & SCROLLSPY
// ==========================================

function initSmoothNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main > section");
    const navbarHeight = 80;

    function scrollToSection(targetId) {
        if (!targetId) return;
        const cleanId = targetId.startsWith("#") ? targetId.substring(1) : targetId;
        const targetSection = document.getElementById(cleanId);
        if (!targetSection) return;

        const targetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (href && href !== "#" && document.getElementById(href.replace("#", ""))) {
                e.preventDefault();
                scrollToSection(href);
                history.pushState(null, "", href);

                const navMenu = document.getElementById("nav-menu");
                const hamburger = document.getElementById("hamburger-btn");
                if (navMenu && hamburger) {
                    navMenu.classList.remove("open");
                    hamburger.classList.remove("open");
                }
            }
        });
    });

    window.addEventListener("scroll", () => {
        let currentId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 120;
            if (window.scrollY >= sectionTop) {
                currentId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute("href") === `#${currentId}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            scrollToSection(window.location.hash);
        }, 300);
    }
}

// ==========================================
// MOBILE MENU CONTROLS & OUTSIDE CLICK CLOSE
// ==========================================

const hamburger = document.getElementById("hamburger-btn");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        hamburger.classList.toggle("open");
        navMenu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
        if (navMenu.classList.contains("open")) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove("open");
                navMenu.classList.remove("open");
            }
        }
    });
}

// ==========================================
// CONTACT CLIPBOARD AND TOAST
// ==========================================

const copyCards = document.querySelectorAll(".interactive-contact-card[data-copy]");
const toastAlert = document.getElementById("clipboard-toast");

function triggerToast(message = "Copied to clipboard!") {
    if (!toastAlert) return;
    toastAlert.textContent = message;
    toastAlert.classList.add("show");
    setTimeout(() => {
        toastAlert.classList.remove("show");
    }, 2500);
}

if (copyCards.length > 0) {
    copyCards.forEach(card => {
        card.addEventListener("click", () => {
            const textToCopy = card.getAttribute("data-copy");
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    const label = card.querySelector(".label").textContent;
                    triggerToast(`${label} copied to clipboard!`);
                })
                .catch(err => {
                    console.error("Clipboard copy failed:", err);
                });
        });
    });
}

// ==========================================
// FORM TRANSMISSION LOOPS
// ==========================================

const contactForm = document.getElementById("contact-form");
const formToast = document.getElementById("form-feedback-toast");
const hiddenIframe = document.getElementById("hidden_form_iframe");
let formIsSubmitting = false;

if (contactForm) {
    contactForm.addEventListener("submit", () => {
        formIsSubmitting = true;
        const submitBtn = contactForm.querySelector(".submit-btn");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Transmitting to rejaulakash@gmail.com... <i class="fa-solid fa-spinner fa-spin"></i>`;
        }
    });
}

if (hiddenIframe) {
    hiddenIframe.addEventListener("load", () => {
        if (!formIsSubmitting) return; // Ignore initial iframe load
        formIsSubmitting = false;

        const submitBtn = contactForm ? contactForm.querySelector(".submit-btn") : null;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span class="btn-text">Transmit Message</span> <i class="fa-solid fa-paper-plane"></i>`;
        }

        if (contactForm) {
            contactForm.reset();
        }

        if (formToast) {
            formToast.className = "toast-message success";
            formToast.style.display = "block";
            formToast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Inquiry sent to rejaulakash@gmail.com!`;
            
            setTimeout(() => {
                formToast.className = "toast-message";
                formToast.style.display = "none";
            }, 8000);
        }
    });
}

// ==========================================
// SKILLS PROGRESS BARS ANIMATION
// ==========================================

function initSkillBars() {
    const skillBars = document.querySelectorAll(".skill-level-bar");
    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.getAttribute("data-level");
                if (level) {
                    bar.style.setProperty("--skill-width", level);
                }
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ==========================================
// ANIMATED NUMERIC COUNTERS
// ==========================================

function animateCounters() {
    const counters = document.querySelectorAll(".stat-number[data-count]");
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute("data-count"), 10);
                const suffix = counter.getAttribute("data-suffix") || "";
                let count = 0;
                const duration = 1000; // ms
                const stepTime = 25;
                const steps = duration / stepTime;
                const increment = target / steps;

                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        counter.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(count) + suffix;
                    }
                }, stepTime);

                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
}

// ==========================================
// REAL-TIME DHAKA CLOCK
// ==========================================

function updateDhakaClock() {
    const clockElement = document.getElementById("dhaka-clock");
    if (!clockElement) return;

    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Dhaka",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
        clockElement.textContent = timeString;
    } catch (e) {
        clockElement.textContent = "12:00:00 AM";
    }
}

// ==========================================
// MOUSE SPOTLIGHT EFFECT HANDLER
// ==========================================

function initSpotlightEffect() {
    const cards = document.querySelectorAll(".spotlight-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
}

// ==========================================
// CASE STUDIES FILTER TABS
// ==========================================

function initCaseStudyFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    if (filterBtns.length === 0 || projectCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                if (filterValue === "all" || filterValue === cardCategory) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

// ==========================================
// CV DOWNLOAD HANDLER
// ==========================================

function initDownloadCV() {
    const downloadBtn = document.getElementById("download-cv-btn");
    if (!downloadBtn) return;

    downloadBtn.addEventListener("click", () => {
        triggerToast("Opening RMA & QC Specialist CV (PDF)...");
    });
}

// ==========================================
// SCROLL TO TOP BUTTON HANDLER
// ==========================================

function initScrollTopBtn() {
    const scrollTopBtn = document.getElementById("scroll-top-btn");
    if (!scrollTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ==========================================
// APP INITIALIZATION
// ==========================================

window.addEventListener("load", () => {
    // Initial theme check
    const currentTheme = getSystemTheme();
    applyTheme(currentTheme);
    
    // Smooth Navigation setup
    initSmoothNavigation();

    // Canvas background startup
    initCanvas();
    animateCanvas();
    
    // Typewriter initialization
    setTimeout(runTypewriter, 1000);
    
    // Skill progress bars animation
    initSkillBars();
    
    // Animated stats counters
    animateCounters();

    // Mouse spotlight interaction
    initSpotlightEffect();

    // Real-time clock update
    updateDhakaClock();
    setInterval(updateDhakaClock, 1000);

    // Case studies filter tabs
    initCaseStudyFilters();

    // CV download button action
    initDownloadCV();

    // Back to top floating button
    initScrollTopBtn();
});
