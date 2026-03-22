import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Experiments from './pages/Experiments'
import Market from './pages/MarketPlace'
import Projects from './pages/Projects'

function App() {

  return (
    <Router>
      <div className='min-h-screen'>
        <Navbar/>
        <main className='p-8'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/marketplace" element={<Market />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
