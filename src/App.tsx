import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CreatePostPage from './pages/CreatePostPage'
import { PostPages } from './pages/PostPages'

function App() {

  return (
    <>
     <div className="min-h-screen text-gray-100 bg-black transition-opacity duration-700 pt-2">
      <Navbar/>
      <div className='container mx-auto pt-20 py-6'>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostPages />} />
        </Routes>
      </div>
     </div> 
    </>
  )
}

export default App
