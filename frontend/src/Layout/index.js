import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react'
import './index.scss'
import { useLoggedIn } from '../contexts/loggedInContext';

const Layout = () => {
  const {loggedIn, setLoggedIn} = useLoggedIn();
  // console.log('Layout component rendered')

  // const [cursorX, setCursorX] = useState();
  // const [cursorY, setCursorY] = useState();

  // window.addEventListener('mousemove', e => {
  //   setCursorX(e.pageX)
  //   setCursorY(e.pageY)
  // });

  // window.addEventListener('click', () => {
  //   const cursor = document.querySelector('.cursor');
  //   cursor.classList.add("expand");
  //   setTimeout(() => {
  //     cursor.classList.remove("expand");
  //   }, 500)
  // })

  useEffect(() => {
    const cachedLoggedIn = localStorage.getItem('loggedIn')
    if (cachedLoggedIn){
      setLoggedIn(JSON.parse(cachedLoggedIn))
    }
  }, [])
  

  return (
    <>
      {/* <div className="cursor"
        style={{
          left: cursorX + "px",
          top: cursorY + "px"
        }}
      ></div> */}
        <Navbar />
        <Outlet />
    </>
  )
}

export default Layout
