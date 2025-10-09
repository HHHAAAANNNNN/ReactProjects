import { useState, useEffect } from 'react'
import './App.css'

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

const App = () => {
  const [status] = usePointerGlow();
  return (
    <main>
      <h1 className="title">
        FARHAN'S REACT PROJECTS
      </h1>
      <div className="articles-container">
        <article data-glow>
          <span data-glow />
          <button data-glow>
            <span>Simple Notes App</span>
          </button>
        </article>
        <article data-glow>
          <span data-glow />
          <button data-glow>
            <span>Weather App</span>
          </button>
        </article>
        <article data-glow>
          <span data-glow />
          <button data-glow>
            <span>Quiz App</span>
          </button>
        </article>
        <article data-glow>
          <span data-glow />
          <button data-glow>
            <span>Pomodoro Timer</span>
          </button>
        </article>
        <article data-glow>
          <span data-glow />
          <button data-glow>
            <span>GIF Search</span>
          </button>
        </article>
      </div>
    </main>
  )
}

export default App
