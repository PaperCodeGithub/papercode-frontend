import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import "./style/about.css";
import profile from "../assets/self_image_no_bg.png";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function About() {
    const cardRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        if (!cardRef.current || !terminalRef.current) return;

        gsap.fromTo(cardRef.current, 
            { opacity: 0, x: -50, rotateY: -15 },
            { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: "power3.out" }
        );

        gsap.fromTo(terminalRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.2 }
        );

        const lines = terminalRef.current.querySelectorAll(".type-line");
        const tl = gsap.timeline({ delay: 0.5 });

        lines.forEach((line) => {
            const text = line.getAttribute("data-text");
            line.innerHTML = ""; 
            tl.to(line, {
                text: text,
                duration: text.length * 0.03, 
                ease: "none",
                onStart: () => {
                    lines.forEach(l => l.classList.remove("typing-active"));
                    line.classList.add("typing-active");
                }
            });
        });

        const card = cardRef.current;
        const setRotateX = gsap.quickSetter(card, "rotateX", "deg");
        const setRotateY = gsap.quickSetter(card, "rotateY", "deg");
        const setScale = gsap.quickSetter(card, "scale");

        const handleMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            setRotateX((y - centerY) / 30); 
            setRotateY((centerX - x) / 30);
            setScale(1.02);
        };

        const handleLeave = () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: "power3.out", force3D: true });
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);

        return () => {
            card.removeEventListener("mousemove", handleMove);
            card.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    return (
        <section className="about-section">
            <h1 className="sub-heading">System/about</h1>
            
            <div className="about-grid">
                <div className="about-card-wrapper" style={{ perspective: "1000px" }}>
                    <div className="dev-id-card" ref={cardRef}>
                        <div className="card-header">
                            <div className="dots"><span></span><span></span><span></span></div>
                            <span className="card-tag">SYSTEM ADMIN</span>
                        </div>
                        <div className="card-body">
                            <div className="avatar-placeholder">
                                <img src={profile} alt="Aritra" />
                            </div>
                            <h2>Aritra</h2>
                            <p className="title">Student</p>
                            
                            <div className="core-skills">
                                <span>Deep Learning</span>
                                <span>Web Development</span>
                                <span>Android Development</span>
                                <span>Game Development</span>
                                <span>Application Development</span>
                                <span>Bare-metal Coding</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="terminal-window" ref={terminalRef}>
                    <div className="terminal-header">
                        <span>bash - root@papercode:~</span>
                    </div>
                    <div className="terminal-body">
                        <p className="type-line prompt" data-text="./run_about.sh"></p>
                        <p className="type-line output" data-text="> executing..."></p>
                        <br/>
                        <p className="type-line" data-text="STATUS: Active"></p>
                        <p className="type-line" data-text="LOCATION: Mahatma Gandhi Avenue, Durgapur, Paschim Bardhaman district, West Bengal, India, PIN – 713209"></p>
                        <p className="type-line" data-text="LEARNING: Low-Level Systems, Generative AI, Full-Stack Architectures"></p>
                        <br/>
                        <p className="type-line output highlight" data-text="> WHO AM I ?"></p>
                        <p className="type-line" data-text="I am an explorer obsessed with building creative ideas, Understanding how things work beneath the surface. My work ranges from building C-based low-level tools to high-level Deep learning models"></p>
                        <br/>
                        <p className="type-line output highlight" data-text="> CURRENT PROCESSES"></p>
                        <p className="type-line" data-text="[-] Managing my startup app Echo"></p>
                        <p className="type-line" data-text="[-] Learning Generative AI & AI Agents"></p>
                        <p className="type-line" data-text="[-] Learning system-level programming & bare-metal stuff"></p>
                        
                    </div>
                </div>
            </div>
        </section>
    );
}