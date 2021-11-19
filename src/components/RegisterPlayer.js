import './RegisterPlayer.module.css';
import React from "react";

class RegisterPlayer extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            name: '',
            password: '',
            confirm: '',
            errors: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        else if (e.target.name === 'confirm')
        {
            this.setState({confirm: e.target.value});
        }
    }
    async handleSubmit(e)
    {
        e.preventDefault();
        let err = '';
        this.setState({errors: err});
        if (this.state.name === '')
        {
            err += '<br>Name is compulsory.';
            this.setState({errors: err});
        }
        if (this.state.password.length < 3)
        {
            err += '<br>Password must be at least 3 symbols long.';
            this.setState({errors: err});
        }
        if (this.state.password !== this.state.confirm)
        {
            err += '<br>Password and confirm password must be the same.';
            this.setState({errors: err});
        }
        if (this.state.errors === '')
        {
            try
            {
                let obj =
                {
                    playername: this.state.name,
                    password: this.state.password,
                };
                let response = await fetch('http://localhost:5000/registerPlayer',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify(obj)
                });
                let data = await response.json();
                
                
                this.props.history.push('/');
            }
            catch(er)
            {

            }
        }
    }
    render()
    {
        return (
            <div class="main">
                <form className='regform' onSubmit={this.handleSubmit}>
                    <p><label>Name:</label></p>
                    <p><input className='reginput' type="text" name='name' value={this.state.name} onChange={this.handleChange} /></p>        
                    <p><label>Password:</label></p>
                    <p><input className='reginput' type="password" name='password' value={this.state.password} onChange={this.handleChange} /> </p>       
                    <p><label>Confirm password:</label></p>
                    <p><input className='reginput' type="password" name='confirm' value={this.state.confirm} onChange={this.handleChange} /> </p>
                    <p><input className='reginput' type="submit" value="Submit" /></p>
                    <p className='errorText' dangerouslySetInnerHTML={{__html: this.state.errors}}></p>
                </form>
            </div>
        );
    }
}

export default RegisterPlayer