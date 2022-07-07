import React from 'react'
import './index.css'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
const root = createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
        <CssBaseline />
        <App />
    </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
