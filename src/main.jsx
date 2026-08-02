// src/main.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// React entry point. Wraps the app in ChakraProvider, BrowserRouter, and our theme.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
)
