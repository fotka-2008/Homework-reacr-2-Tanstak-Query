import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Categories from './pages/Categories'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <Sidebar />
      <main className="w-full flex-1 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
