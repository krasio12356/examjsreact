async function waitEnemy()
{
    try
    {
        let response = await fetch('http://localhost:5000/waitEnemy',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({authorization: sessionStorage.getItem('token'), id: sessionStorage.getItem('playGameId'), notation})
        });
        let data = await response.json();
        if (data.notation !== 'not updated')
        {
            this.data.notation = data.notation;
            this.setState({info: this.state.info});
        }
    }
    catch(er)
    {
      
    }
}

export default waitEnemy;