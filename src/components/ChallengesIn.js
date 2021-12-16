import './PlayerList.module.css';
import React from "react";
import { Redirect } from 'react-router';

class ChallengesIn extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      tmp: undefined
    }
    this.data = undefined;
    this.acceptChallenge = this.acceptChallenge.bind(this);
    this.rejectChallenge = this.rejectChallenge.bind(this);
  }
  async acceptChallenge(e)
  {
    try
    {
      let response = await fetch('http://localhost:5000/acceptChallenge',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token'), _id: e.target.id})
                });
      let answer = await response.json();
      window['playGameId'] = answer._id;
    }
    catch(er)
    {
      
    } 
    await this.componentDidMount();
    this.setState({temp: undefined});
  }

  async rejectChallenge(e)
  {
    try
    {
      let response = await fetch('http://localhost:5000/rejectChallenge',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token'), _id: e.target.id})
                });
    }
    catch(er)
    {
      
    }
    await this.componentDidMount();
    this.setState({temp: undefined});
  }

  async componentDidMount()
  {
    try
    {
      let response = await fetch('http://localhost:5000/challengesIn',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token')})
                });
                this.data = await response.json();
                let x = this.data;
                let y = x;
    }
    catch(er)
    {
      
    }
    this.setState({tmp: undefined});
  }
  
  render()
  {
    let trs = [];
    if (this.data != undefined && this.data.length != 0)
    {
      trs.push(
        <tr key='trshc'>
          <th>
              Enemy
            </th>
            <th>
              Rank
            </th>
            <th>
              Games
            </th>
            <th>
              Accept
            </th>
            <th>
              Reject
            </th>
        </tr>
      );
      for (let i = 0; i < this.data.length; i++)
      {
        trs.push(
          <tr key={'trsc' + i}>
            <td>
              {this.data[i].playername}
            </td>
            <td style={{textAlign : 'center'}}>
              {this.data[i].rank}
            </td>
            <td style={{textAlign : 'center'}}>
              {this.data[i].gamecount}
            </td>
            <td style={{textAlign : 'center'}}>
              <button id={this.data[i]._id} className='niceButton' onClick={this.acceptChallenge}>
                Accept
              </button>
            </td>
            <td style={{textAlign : 'center'}}>
              <button id={this.data[i]._id} className='niceButton' onClick={this.rejectChallenge}>
                Reject
              </button>
            </td>
          </tr>
        );
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

export default ChallengesIn;