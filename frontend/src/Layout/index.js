import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom';
import React from 'react'
import './index.scss'

const Layout = () => {
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
