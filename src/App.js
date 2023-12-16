import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom'
import { Admin, Editor, Footy, Home, LinkPage, Login, Lounge, Main, Missing, Navbar, Nest, NestTwo, Register, RequireAuth,  Unauthorized } from './components/index'
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
        element: <Home />,
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
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "linkpage",
        element: <LinkPage />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "*",
        element: <Missing />,
      },
      {
        path: "req",
        element: <RequireAuth />,
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