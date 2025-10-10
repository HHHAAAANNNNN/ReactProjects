import { useState, useEffect } from 'react'
import './App.css'
import SimpleNotesApp from './projects/SimpleNotesApp'
import WeatherApp from './projects/WeatherApp'
import QuizApp from './projects/QuizApp'
import PomodoroTimer from './projects/PomodoroTimer'
import GifSearch from './projects/GifSearch'

/**
* Tiny hook that you can use where you need it 
*/
const usePointerGlow = () => {
  const [status, setStatus] = useState(null)
  useEffect(() => {
    const syncPointer = ({ x: pointerX, y: pointerY }) => {
      const x = pointerX.toFixed(2)
      const y = pointerY.toFixed(2)
      const xp = (pointerX / window.innerWidth).toFixed(2)
      const yp = (pointerY / window.innerHeight).toFixed(2)
      document.documentElement.style.setProperty('--x', x)
      document.documentElement.style.setProperty('--xp', xp)
      document.documentElement.style.setProperty('--y', y)
      document.documentElement.style.setProperty('--yp', yp)
      setStatus({ x, y, xp, yp })
    }
    document.body.addEventListener('pointermove', syncPointer)
    return () => {
      document.body.removeEventListener('pointermove', syncPointer)
    }
  }, [])
  return [status]
}

const projects = [
  { id: 1, title: 'Simple Notes App', component: SimpleNotesApp },
  { id: 2, title: 'Weather App', component: WeatherApp },
  { id: 3, title: 'Quiz App', component: QuizApp },
  { id: 4, title: 'Pomodoro Timer', component: PomodoroTimer },
  { id: 5, title: 'GIF Search', component: GifSearch }
]

const ProjectDetail = ({ project, onBack }) => {
  const ProjectComponent = project.component;
  
  return (
    <div className="project-detail">
      <h1 className="project-title">{project.title}</h1>
      <div className="project-wrapper">
        <ProjectComponent />
      </div>
      <button className="back-button" data-glow onClick={onBack}>
        <span data-glow />
        <span className="back-text">← Back to Projects</span>
      </button>
    </div>
  )
}

const App = () => {
  const [status] = usePointerGlow();
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <main>
        <ProjectDetail project={selectedProject} onBack={handleBack} />
      </main>
    );
  }

  return (
    <main>
      <h1 className="title">
        FARHAN'S REACT PROJECTS
      </h1>
      <div className="articles-container">
        {projects.map((project, index) => (
          <div key={project.id} className="article-wrapper">
            <article data-glow onClick={() => handleProjectClick(project)}>
              <span data-glow />
              <button data-glow>
                <span>{project.title}</span>
              </button>
            </article>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
