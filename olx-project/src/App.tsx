<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import FavoritesPage from './pages/FavoritesPage'
//import CreatePage from './pages/CreatePage'
//import ProfilePage from './pages/ProfilePage'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#f8f9fa]">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    {/* <Route path="/create" element={<CreatePage />} /> */}
                    {/* <Route path="/profile" element={<ProfilePage />} /> */}
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> 2efdff91b9cef22ba7aaa42cde724e690376c284
