import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ContextProvider from './Context/ContextProvider.jsx'
import { RouterProvider } from 'react-router'
import router from './Routes/RouteProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
   <ContextProvider>
    <RouterProvider router={router}></RouterProvider>
   </ContextProvider>
  </StrictMode>,
)
