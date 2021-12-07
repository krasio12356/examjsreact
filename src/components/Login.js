import './RegisterPlayer.module.css';
import React from "react";
import { Redirect } from 'react-router';

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            name: '',
            password: '',
            temp: undefined
        };
        this.redirect = false;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.errors = '';
    }
    handleChange(e)
    {
        if (e.target.name === 'name')
        {
            this.setState({name: e.target.value});
        }
        else if (e.target.name === 'password')
        {
            this.setState({password: e.target.value});
        }
    }
    async handleSubmit(e)
    {
        e.preventDefault();
        this.errors = '';
        if (this.state.name === '')
        {
            this.errors += '<br>Name is compulsory.';
        }
        if (this.state.password.length < 3)
        {
            this.errors += '<br>Password must be at least 3 symbols long.';
        }
        if (this.errors === '')
        {
            try
            {
                let obj =
                {
                    playername: this.state.name,
                    password: this.state.password,
                };
                let response = await fetch('http://localhost:5000/login',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify(obj)
                });
                let data = await response.json();
                sessionStorage.setItem('playername',data.playername);
                sessionStorage.setItem('_id',data._id);
                sessionStorage.setItem('token',data.token);
                sessionStorage.setItem('rank', data.rank);
                window['handleLogin']();
                
                this.redirect = true;
            }
            catch(er)
            {
                console.log(er.message);
            }
        }
        this.setState({temp: undefined});
    }
    render()
    {
        if (this.redirect)
        {
            return <Redirect to='/'/>;
        }
        return (
            <div className="main">
                <form className='regform' onSubmit={this.handleSubmit}>
                    <p className='errorText' dangerouslySetInnerHTML={{__html: this.errors}}></p>
                    <p><label>Name:</label></p>
                    <p><input className='reginput' type="text" name='name' value={this.state.name} onChange={this.handleChange} /></p>        
                    <p><label>Password:</label></p>
                    <p><input className='reginput' type="password" name='password' value={this.state.password} onChange={this.handleChange} /> </p>       
                    <p><input className='reginput' type="submit" value="Submit" /></p>
                </form>
            </div>
        );
    }
}

export default Login