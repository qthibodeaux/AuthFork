import { RouterProvider, Outlet, createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import { Admin, Auth, Editor, Footy, Home, LinkPage, Lounge, Missing, Navbar, Nest, Profile, Register, RequireAuth,  Unauthorized, Welcome } from './components/index'
//import { AuthProvider } from './useSession'
import { AuthProvider } from './useSessionOne'

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

const routing = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/*  Public Routes */}
      <Route path="register" element={<Register />} />
      <Route path="linkpage" element={<LinkPage />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      <Route path="/:nest" element={<Nest />} />

      <Route path="profile" element={<Profile />} />

      <Route path="welcome" element={<Welcome />}  />

      <Route path="auth" element={<Auth />}/>

      <Route path="/" element={<Home />} />

      {/*  Protected Routes */}
      <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
        <Route path="editor" element={<Editor />} />
      </Route>


      <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
        <Route path="admin" element={<Admin />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
        <Route path="lounge" element={<Lounge />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
        <Route path="profile" element={<Profile />} />
      </Route>

        

      {/*  Catch All */}
      <Route path="*" element={<Missing />}/>
    </Route>
  )
)

function App() {
  return <RouterProvider router={routing}/>
}

export default App;

function Layout () {
  return (
    <main>
      <AuthProvider>
        <Navbar />
        <div className="App">
          <Outlet />
        </div>
        <Footy />
      </AuthProvider>
    </main>
  )
}

//npx supabase db reset