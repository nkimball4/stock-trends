import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Homepage from './pages/Homepage'
import SearchResultPage from './pages/SearchResultsPage'
import './App.scss'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/chatter" />} />
        <Route path="/chatter" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="search" element={<SearchResultPage/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App