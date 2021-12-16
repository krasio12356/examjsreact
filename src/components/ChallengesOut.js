import './PlayerList.module.css';
import React from "react";
import { Redirect } from 'react-router';

class ChallengesOut extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      tmp: undefined
    }
    this.data = undefined;
    this.deleteChallenge = this.deleteChallenge.bind(this);
  }
  async deleteChallenge(e)
  {
    try
    {
      let response = await fetch('http://localhost:5000/deleteChallenge',
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
      let response = await fetch('http://localhost:5000/challengesOut',
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
        <tr key='trshe'>
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
              Action
            </th>
        </tr>
      );
      for (let i = 0; i < this.data.length; i++)
      {
        trs.push(
          <tr key={'trse' + i}>
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
              <button id={this.data[i]._id} className='niceButton' onClick={this.deleteChallenge}>
                Withdraw
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

export default ChallengesOut;