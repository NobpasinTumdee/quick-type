import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom';
import Rootlayout from './page/layout/Rootlayout';
import Home from './page/Home';

import { SettingsProvider } from './context/SettingsContext';
import Settings from './page/Settings';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <h1>Not found this page...</h1>,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "settings", element: <Settings /> },
    ]
  }
]);

function App() {

  return (
    <>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </>
  )
}

export default App