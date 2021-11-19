import './App.module.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home';
import RegisterPlayer from './components/RegisterPlayer';
import Play from './components/Play';
class  App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = 
    {
      navHeightValue : undefined
    }
    this.navHeight = React.createRef();
    this.handleResize = this.handleResize.bind(this)
  }
  handleResize()
  {
    this.setState({navHeightValue: document.documentElement.clientHeight - this.navHeight.current.clientHeight + 'px'});
  }
  componentDidMount()
  {
    if (this.state.navHeightValue == undefined)
    this.setState({navHeightValue: document.documentElement.clientHeight - this.navHeight.current.clientHeight + 'px'});
    else return;
  }
  render()
  {
    window.addEventListener('resize', this.handleResize);
    return (
      <Router>
        <div>
          <nav className="pack" ref={this.navHeight}>
            <ul className='navul'>
              <li className='navli'>
                <Link to="/" className='navlink'>Home</Link>
              </li>
              <li className='navli'>
                <Link to="/registerPlayer" className='navlink'>RegisterPlayer</Link>
              </li>
              <li className='navli'>
                <Link to="/users" className='navlink'>Users</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/registerPlayer">
              <RegisterPlayer />
            </Route>
            <Route path="/play">
              <Play ht={this.state.navHeightValue}/>
            </Route>
            <Route path="/">
              <Home ht={this.state.navHeightValue}/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}



export default App;
