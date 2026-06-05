import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Cocktails from './pages/Cocktails'
import Foods from './pages/Foods'
import RecipeDetail from './pages/RecipeDetail'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cocktails" element={<Cocktails />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </Layout>
  )
}
