import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style/experiments.css";

gsap.registerPlugin(ScrollTrigger);

const BASE_URL = "https://papercode-backend.onrender.com/api";

export default function Experiments() {
    const [experiments, setExperiments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const gridRef = useRef(null);

    useEffect(() => {
        const fetchExperiments = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/experiments?page=${currentPage}`);
                const data = await response.json();
                setExperiments(data.projects || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.log("Error: " + error);
                setExperiments([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExperiments();
    }, [currentPage]);

    useEffect(() => {
        if (experiments.length === 0) return;
        const cards = gridRef.current.querySelectorAll(".exp-card");
        gsap.fromTo(cards, 
            { opacity: 0, x: -20 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.6,
                stagger: 0.1,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                }
            }
        );
    }, [experiments]);

    const handlePageChange = (newPage) => {
        gridRef.current.scrollIntoView({ behavior: "smooth" });
        setCurrentPage(newPage);
    };

    return (
        <section className="experiments-section">
            <h1 className="sub-heading">Lab & Experiments</h1>
            <div className="exp-grid" ref={gridRef}>
                {!isLoading ? (
                    experiments.map((exp) => (
                        <div key={exp.id} className="exp-card">
                            <div className="exp-terminal-header">
                                <div className="dots"><span></span><span></span><span></span></div>
                                <span className="exp-id">ID_{exp.id.toString().padStart(3, '0')}</span>
                            </div>
                            <div className="exp-content">
                                <h3>{exp.name}</h3>
                                <p>{exp.description}</p>
                                <div className="exp-stack">
                                    {exp.tech_stack && exp.tech_stack.map((tech, i) => (
                                        <code key={i}>{tech}</code>
                                    ))}
                                </div>
                                <a href={exp.github_url} target="_blank" rel="noreferrer" className="exp-link">
                                    ACCESS REPO
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="exp-loader">Initializing Terminal...</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="exp-pagination">
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>PREV</button>
                    <div className="exp-pages">
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i+1} onClick={() => handlePageChange(i+1)} className={currentPage === i+1 ? 'active' : ''}>
                                {i+1}
                            </button>
                        ))}
                    </div>
                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>NEXT</button>
                </div>
            )}
        </section>
    );
}