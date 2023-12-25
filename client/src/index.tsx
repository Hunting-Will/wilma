import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
// import App from './App';
import { SubGame } from './player/SubGame'
import reportWebVitals from './reportWebVitals';
import { MainGame } from './main/MainGame';
import { Create } from './main/Create';
import { Login } from './player/Login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Create />,
  },
  {
    path: "/join",
    element: <Login />,
  },
  {
    path: "/sub/:id",
    element: <SubGame />,
  },
  {
    path: "/main/:id",
    element: <MainGame />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
