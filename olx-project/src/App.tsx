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