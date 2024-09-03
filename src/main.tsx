import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'

import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primereact/resources/themes/lara-dark-cyan/theme.css";

import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css";                                //icons
import '@/assets/css/styles.scss'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)