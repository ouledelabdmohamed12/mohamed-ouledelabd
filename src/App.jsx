import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import HeroSection from './components/Sections/HeroSection'
import SkillsSection from './components/Sections/SkillsSection'
import ProductsSection from './components/Sections/ProductsSection'

const App = () => {
  return (
    <ThemeProvider>
      <div className="relative pb-[100vh]">
        <Navbar />
        <HeroSection />
        <SkillsSection />
        <ProductsSection />
      </div>
    </ThemeProvider>
    
  )
}

export default App