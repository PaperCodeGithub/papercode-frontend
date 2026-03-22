import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style/market.css";

gsap.registerPlugin(ScrollTrigger);

const BASE_URL = "https://papercode-backend.onrender.com/api";

export default function Market() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const gridRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/products?page=${currentPage}`);
                const data = await response.json();
                
                setProducts(data.products || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.log("Error: " + error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    useEffect(() => {
        if (products.length === 0 || !gridRef.current) return;

        const cards = gridRef.current.querySelectorAll(".market-card");

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
                    start: "top 85%",
                }
            }
        );

    }, [products]);

    const handlePageChange = (newPage) => {
        gridRef.current.scrollIntoView({ behavior: "smooth" });
        setCurrentPage(newPage);
    };

    return (
        <section className="market-section">
            <h1 className="sub-heading">Live Market</h1>
            
            <div className="market-grid" ref={gridRef} style={{ perspective: "1000px" }}>
                {!isLoading ? (
                    products.map((product) => (
                        <div key={product.id} className="market-card">
                            <div className="market-card-banner">
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/400x200/111111/f3be2b?text=IMAGE+UNAVAILABLE";
                                    }}
                                />
                                <div className="market-downloads">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    {product.downloads.toLocaleString()}+
                                </div>
                            </div>
                            
                            <div className="market-card-content">
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                
                                <div className="market-action">
                                    <a href={product.product_url} target="_blank" rel="noreferrer" className="btn-launch">
                                        Open App
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="loader-text">Loading Market Data...</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-bar">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="page-btn"
                    >
                        &lt; PREV
                    </button>
                    
                    <div className="page-numbers">
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {(i + 1).toString().padStart(2, '0')}
                            </button>
                        ))}
                    </div>

                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="page-btn"
                    >
                        NEXT &gt;
                    </button>
                </div>
            )}
        </section>
    );
}