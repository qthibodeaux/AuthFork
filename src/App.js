import { RouterProvider, Outlet, createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import { Admin, Editor, Footy, Home, LinkPage, Login, Lounge, Missing, Navbar, Nest, Profile, Register, RequireAuth,  Unauthorized } from './components/index'
import { AuthProvider } from './useAuth'

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

/***
 * Current Blockers
 * talking to supabase
 * supabase not initialized | initial routing thruu RequireAuth goes to home page |
 * query not talking to database
 * 
 * default 
 */

const routing = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/*  Public Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="linkpage" element={<LinkPage />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      <Route path="/:nest" element={<Nest />} />

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