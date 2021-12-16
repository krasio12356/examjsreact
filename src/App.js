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
import Login from './components/Login';
import PlayerList from './components/PlayerList';
import ChallengesIn from './components/ChallengesIn';
import ChallengesOut from './components/ChallengesOut';
import CurrentGames from './components/CurrentGames';

class  App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = 
    {
      navHeightValue : undefined,
      temp : undefined
    }
    this.navHeight = React.createRef();
    this.handleResize = this.handleResize.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    window['handleLogin'] = this.handleLogin.bind(this);
  }
  handleLogin()
  {
    this.setState({temp : undefined});
  }
  handleLogout()
  {
    sessionStorage.clear();
    this.setState({temp : undefined});
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
    window['playGameId'] = undefined;
    window.addEventListener('resize', this.handleResize);
    let player = [];
    player.push(
              <li key='player0' className='navli'>
                <Link to="/play" className='navlink'>Play</Link>
              </li>);
    player.push(          
              <li key='player1' className='navli'>
                <Link onClick={this.handleLogout} to='/' className='navlink'>Logout</Link>
              </li>);
    player.push(
              <li key='player2' className='navli'>
              <Link to='playerList' className='navlink'>Player List</Link>
              </li>);  
    player.push(
              <li key='player3' className='navli'>
              <Link to='challengesIn' className='navlink'>Challenges in</Link>
              </li>);
    player.push(
              <li key='player4' className='navli'>
              <Link to='challengesOut' className='navlink'>Challenges out</Link>
              </li>); 
    player.push(
              <li key='player5' className='navli'>
              <Link to='currentGames' className='navlink'>Current games</Link>
              </li>);               
    let kibitzer = [];
    kibitzer.push(
              <li key='kibitzer1' className='navli'>
                <Link to="/registerPlayer" className='navlink'>Register Player</Link>
              </li>);
    kibitzer.push(
              <li key='kibitzer2' className='navli'>
                <Link to="/login" className='navlink'>Login</Link>
              </li>);
    return (
      <Router>
        <div>
          <nav className="pack" ref={this.navHeight}>
            <ul className='navul'>
              <li className='navli'>
                <Link to="/" className='navlink'>Home</Link>
              </li>
              {sessionStorage.getItem('token') == null && kibitzer}
              {sessionStorage.getItem('token') != null && player}
            </ul>
          </nav>
          
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/registerPlayer">
              <RegisterPlayer />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/play">
              <Play ht={this.state.navHeightValue}/>
            </Route>
            <Route path="/playerList">
              <PlayerList ht={this.state.navHeightValue}/>
            </Route>
            <Route path="/challengesIn">
              <ChallengesIn ht={this.state.navHeightValue}/>
            </Route>
            <Route path="/challengesOut">
              <ChallengesOut ht={this.state.navHeightValue}/>
            </Route>
            <Route path="/currentGames">
              <CurrentGames ht={this.state.navHeightValue}/>
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
