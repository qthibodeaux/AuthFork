import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom'
import { Admin, Editor, Footy, Home, LinkPage, Lounge, Main, Missing, Navbar, Nest, NestTwo, Register,  Unauthorized } from './components/index'
import './App.css';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: ":nest",
        children: [
          {
            path: "",
            element: <Nest />,  
          },
          {
          path: ":nestTwo",
          element: <NestTwo />,  
          }
        ]
      },
      {
        path: "lounge",
        element: <Lounge />,
      },
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App;

function Layout () {
  return (
    <div>
      <Navbar/>
      <Outlet />
      <Footy />
    </div>
  )
}