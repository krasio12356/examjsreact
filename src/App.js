import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home';
import Register from './components/Register';
function App() 
{
  return (
    <Router>
      <div>
        <nav>
          <ul className='navul'>
            <li className='navli'>
              <Link to="/" className='navlink'>Home</Link>
            </li>
            <li className='navli'>
              <Link to="/register" className='navlink'>Register</Link>
            </li>
            <li className='navli'>
              <Link to="/users" className='navlink'>Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/register" component={Register}/>
            
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
