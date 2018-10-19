import React, { Component } from 'react'
import classnames from 'classnames';
import axios from 'axios';

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      FirstName: '',
      LastName: '',
      UserPass: '',
      UserName: '',
      errors: {}
    }
    
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();
    const newUser = {
      FirstName: this.state.FirstName,
      LastName: this.state.LastName,
      UserPass: this.state.UserPass,
      UserName: this.state.UserName,
    };
    
    axios
      .post('http://localhost:5000/users/register', newUser)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response }));
  }

  render() {

    const errors = {};
    
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create QnA Account
              </p>
              

              <form noValidate onSubmit={this.onSubmit}>

               
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.FirstName
                    })}
                    placeholder="First Name"
                    name="FirstName"
                    value={this.state.FirstName}
                    onChange={this.onChange}
                  />
                  {errors.FirstName && (
                    <div className="invalid-feedback">{errors.FirstName}</div>
                  )}
                </div>

              
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.LastName
                    })}
                    placeholder="Last Name"
                    name="LastName"
                    value={this.state.LastName}
                    onChange={this.onChange}
                  />
                  {errors.LastName && (
                    <div className="invalid-feedback">{errors.LastName}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.UserName
                    })}
                    placeholder="User Name"
                    name="UserName"
                    value={this.state.UserName}
                    onChange={this.onChange}
                  />
                  {errors.UserName && (
                    <div className="invalid-feedback">{errors.UserName}</div>
                  )}
                </div>
          
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.UserPass
                    })}
                    placeholder="Password"
                    name="UserPass"
                    value={this.state.UserPass}
                    onChange={this.onChange}
                  />
                  {errors.Password && (
                    <div className="invalid-feedback">{errors.UserPass}</div>
                  )}
                </div>

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;