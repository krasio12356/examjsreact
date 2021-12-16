import './PlayerList.module.css';
import React from "react";
import { Redirect } from 'react-router';

class CurrentGames extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      tmp: undefined
    }
    this.data = undefined;
    this.playGame = this.playGame.bind(this);
  }
  
  playGame(e)
  {
    window['playGameId'] = e.target.id;
    return <Redirect to='/play'/>
  }
  async componentDidMount()
  {
    try
    {
      let response = await fetch('http://localhost:5000/currentGames',
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
        <tr key='trshg'>
          <th>
              Whites
            </th>
            <th>
              Blacks
            </th>
            <th>
              Id
            </th>
            <th>
              Action
            </th>
        </tr>
      );
      for (let i = 0; i < this.data.length; i++)
      {
        trs.push(
          <tr key={'trsg' + i}>
            <td style={{textAlign : 'center'}}>
              {this.data[i].whites}
            </td>
            <td style={{textAlign : 'center'}}>
              {this.data[i].blacks}
            </td>
            <td style={{textAlign : 'center'}}>
              {this.data[i]._id}
            </td>
            <td style={{textAlign : 'center'}}>
              <button id={this.data[i]._id} className='niceButton' onClick={this.playGame}>
                Play
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

export default CurrentGames;