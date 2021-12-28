import './PlayerList.module.css';
import React from "react";
import { Redirect } from 'react-router';

class PlayerList extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      tmp: undefined
    }
    this.handleChallenge = this.handleChallenge.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
    this.clean = this.clean.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.data = undefined;
    this.dataChallenge = undefined;
  }

  async handleChallenge(e)
  {
    try
    {
      let response = await fetch('http://localhost:5000/challenge',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token'), _id: e.target.id})
                });
                this.dataChallenge = await response.json();
                this.showPopup();
    }
    catch(er)
    {
      
    }
  }

  async getPlayers()
  {
    try
    {
      let response = await fetch('http://localhost:5000/playerList',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token')})
                });
                this.data = await response.json();
    }
    catch(er)
    {
      
    }
    this.setState({tmp: undefined});
  }

  clean(pop)
  {
    document.body.removeChild(pop);
  }

  showPopup()
  {
    if (this.dataChallenge)
    {
      if (this.dataChallenge.status == 'yes')
      {
        let pop = document.createElement('div');
        pop.className = 'centerPopup';
        pop.textContent = 'Challenge registered';
        document.body.appendChild(pop);
        setTimeout(this.clean, 2000, pop)
      }
    }
    this.dataChallenge = undefined;
  } 

  async componentDidMount()
  {
    await this.getPlayers();
  }

  render()
  {  
    let trs = [];
    if (this.data)
    {
      trs.push(
        <tr key='trsh'>
          <th>
              Name
            </th>
            <th>
              Rank
            </th>
            <th>
              Games
            </th>
            <th>
              Action
            </th>
        </tr>
      );
      for (let i = 0; i < this.data.length; i++)
      {
        if (this.data[i].playername != sessionStorage.getItem('playername'))
        {
          trs.push(
            <tr key={'trs' + i}>
              <td>
                {this.data[i].playername}
              </td>
              <td style={{textAlign : 'center'}}>
                {this.data[i].rank}
              </td>
              <td style={{textAlign : 'center'}}>
                {this.data[i].gamesPlayed.length}
              </td>
              <td style={{textAlign : 'center'}}>
                <button id={this.data[i]._id} className='niceButton' onClick={this.handleChallenge}>
                  Challenge
                </button>
              </td>
            </tr>
          );
        }
      } 
    }
    return (
      <div className='playerListParent'>
        <table className='plTable'>
          {trs}
        </table>
      </div>
    );
  }
}

export default PlayerList