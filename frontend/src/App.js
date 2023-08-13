import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Users from "./components/users";
import UsersList from "./components/users-list";
import Login from "./components/login";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/users" className="navbar-brand">
          Fitness App
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/users"} className="nav-link">
              Users
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}

          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path='/' element={<UsersList />} />
          <Route path='/users' element={<UsersList />} />
          {/* <Route 
            path="/restaurants/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          /> */}
          <Route 
            path='/users/:id'
            // render={(props) => (
            //   <Users {...props} user={user} />
            // )}
            element={<Users user={user} />}
          />
          <Route 
            path='/login'
            // render={(props) => (
            //   <Login {...props} login={login} />
            // )}
            element={<Login login={login} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
