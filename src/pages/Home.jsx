import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./style/home.css";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImg from "../assets/self_image.jpeg";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const mountRef = useRef(null);
    const stackRef = useRef(null);

    useEffect(() => {
        const el = stackRef.current;
        if (!el) return;

        const cards = el.querySelectorAll(".stack-card");

        gsap.fromTo(cards, 
            { opacity: 0, y: 100, rotateX: -30 },
            { 
                opacity: 1, y: 0, rotateX: 0,
                duration: 1.2, stagger: 0.15,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 85%" }
            }
        );

        const handleMove = (e, card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rX = (y - centerY) / 10;
            const rY = (centerX - x) / 10;

            gsap.to(card, {
                rotateX: rX,
                rotateY: rY,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        const handleLeave = (card) => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            });
        };

        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => handleMove(e, card));
            card.addEventListener("mouseleave", () => handleLeave(card));
        });

        return () => {
            cards.forEach(card => {
                card.removeEventListener("mousemove", (e) => handleMove(e, card));
                card.removeEventListener("mouseleave", () => handleLeave(card));
            });
        };
    }, []);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.zoom = 0.8; 
        camera.updateProjectionMatrix(); 

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);
        
        const geometry = new THREE.TorusKnotGeometry(5, 0.8, 100, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xf3be2b,
            wireframe: true,
            transparent: false,
            opacity: 1
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        const group = new THREE.Group();
        group.add(mesh);
        
        group.position.x = 3.5;
        
        scene.add(group);
        
        camera.position.z = 5;

        gsap.to(camera.position, {
            y: -25, 
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            }
        });

        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.003;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!currentMount) return;
            
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            
            if (window.innerWidth < 768) {
                group.position.x = 0;
                group.position.y = 2;
            } else {
                group.position.x = 3.5;
                group.position.y = 0;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return(
        <>
            <div className="main-container">
                <div className="canvas-bg" ref={mountRef}></div>
                <div className="hero-section">
                    <div className="hero-text">
                        <h1 id="title">Welcome to PaperCode</h1>
                        <p id="sub-title">An evolving digital canvas dedicated to the art of software engineering.</p>
                        <div className="hero-buttons">
                            <Link to="/projects" className="btn-primary">
                                Explore Projects
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </Link>
                            <Link to="/experiments" className="btn-secondary">
                                View Experiments
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about-me">
                <h1 className="sub-heading">About Me</h1>
                <div className="about-me-container">
                    <div className="profile-pic-about">
                        <img src={profileImg} alt="Aritra Das" />
                    </div>
                    <div className="text-about">
                        <p>Hi! I am Aritra Das, A passionate developer who wants to explore. For me, software engineering is an open canvas where I get to turn complex logic into
                        digital experiences. I always try to solve problems that I face everyday. If the solution requires complex algorithms or 
                        training a Deep Neural Net, I'm ready for that.<br/>Currently I'm pursuing my B.tech degree from National Institute of Technology, Durgapur and trying to uplift my
                        skills in Generative AI and Reinforcement Learning although I'm have an open mind to explore other segments. </p>
                    </div>
                </div>
            </div>
            <div className="tech-stack">
                <h1 className="sub-heading">Tech-Stacks</h1>
                <div className="stack-grid" ref={stackRef}>
                    <div className="stack-card">
                        <h3>Languages</h3>
                        <p>C, Java, Python, JavaScript, Assembly, C#, Rust</p>
                    </div>
                    <div className="stack-card">
                        <h3>Web Development</h3>
                        <p>HTML, CSS, JavaScript, React.js, Gsap, Three.js, Express.js, Django, MongoDB, PostGreSql</p>
                    </div>
                    <div className="stack-card">
                        <h3>AI & Machine Learning</h3>
                        <p>TensorFlow, NumPy, Pandas, MediaPipe, Matplotlib, OpenCV, HuggingFace, LangChain</p>
                    </div>
                    <div className="stack-card">
                        <h3>Systems & Low-Level</h3>
                        <p>Win32 API, Bootloader Development, Raw Disk Scanning, Data Recovery Tools</p>
                    </div>
                    <div className="stack-card">
                        <h3>Mobile App Development</h3>
                        <p>Android (Java/Android Studio), React Native, Django, MongoDB, PostGreSql</p>
                    </div>
                    <div className="stack-card">
                        <h3>Game Development</h3>
                        <p>Unity (C#), Physics Simulations, Particle Systems</p>
                    </div>
                    <div className="stack-card">
                        <h3>Application Frameworks</h3>
                        <p>Tkinter, PyQt5, Win32 API</p>
                    </div>
                </div>
            </div>
            <div className="footer-section">
                <div className="social-links-container">
                    <a href="https://github.com/papercodegithub" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        <span className="tooltip">GitHub</span>
                    </a>
                    <a href="https://linkedin.com/in/aritradaspersonal/" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        <span className="tooltip">LinkedIn</span>
                    </a>
                    <a href="https://www.instagram.com/its.aritra.00/" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        <span className="tooltip">Instagram</span>
                    </a>
                </div>
                <p className="footer-email">aritra.das.user.2005@gmail.com</p>
            </div>
        </>
    );
}