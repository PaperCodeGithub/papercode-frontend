import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style/projects.css";

gsap.registerPlugin(ScrollTrigger);

const BASE_URL = "https://papercode-backend.onrender.com/api";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const gridRef = useRef(null);

    useEffect(() => {
    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/projects?page=${currentPage}`);
            const data = await response.json();
            
            setProjects(data.projects || []); 
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.log("Error: " + error);
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    };

    fetchProjects();
}, [currentPage]);

    useEffect(() => {
        if (projects.length === 0) return;

        const cards = gridRef.current.querySelectorAll(".project-card");
        gsap.fromTo(cards, 
            { opacity: 0, y: 30, scale: 0.95 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                }
            }
        );
    }, [projects]);

    const handlePageChange = (newPage) => {
        gridRef.current.scrollIntoView({ behavior: "smooth" });
        setCurrentPage(newPage);
    };

    return (
        <section className="projects-section">
            <h1 className="sub-heading">Featured Projects</h1>
            
            <div className="project-grid" ref={gridRef}>
                {!isLoading ? (
                    projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <div className="project-card-header">
                                <span className="project-category">{project.category}</span>
                                <div className="project-links">
                                    <a href={project.github_url} target="_blank" rel="noreferrer">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="project-card-content">
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                                <div className="project-tags">
                                    {project.tech_stack && project.tech_stack.map((tech, index) => (
                                        <span key={index} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="loader-text">Loading Project Canvas...</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-bar">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="page-btn"
                    >
                        Prev
                    </button>
                    
                    <div className="page-numbers">
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="page-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}