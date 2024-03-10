import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Homepage from './pages/Homepage'
import SearchResultPage from './pages/SearchResultsPage'
import './App.scss'
import LoginPage from './pages/LoginPage'
import AboutPage from './pages/AboutPage'
import SignupPage from './pages/SignupPage'
import { LoggedInProvider } from './contexts/loggedInContext';
import MyWatchlistPage from './pages/MyWatchlistPage'

function App() {
  return (
    <>
      <LoggedInProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/chatter" />} />
          <Route path="/chatter" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="login" element={<LoginPage/>}/>
            <Route path="signup" element={<SignupPage/>}/>
            <Route path="my-watchlist" element={<MyWatchlistPage/>}/>
            <Route path="about" element={<AboutPage/>}/>
            <Route path="search" element={<SearchResultPage/>} />
          </Route>
        </Routes>
      </LoggedInProvider>  
    </>
  )
}

export default App