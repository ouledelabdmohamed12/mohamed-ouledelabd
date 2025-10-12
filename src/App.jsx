import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import HeroSection from './components/Sections/HeroSection'
import SkillsSection from './components/Sections/SkillsSection'
import ProjectsSection from './components/Sections/ProjectsSection'
import AboutSection from './components/Sections/AboutSection'

const App = () => {
  return (
    <ThemeProvider>
      <div className="relative pb-[100vh]">
        <Navbar />
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <AboutSection />
      </div>
    </ThemeProvider>
    
  )
}

export default App