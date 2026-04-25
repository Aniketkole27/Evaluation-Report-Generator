import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Providers from "./app/provider";
import App from './App.tsx'
import './index.css'


// import React from "react";
// import ReactDOM from "react-dom/client";
// import { RouterProvider } from "react-router-dom";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
