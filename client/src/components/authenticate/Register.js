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
    this.setState({ [event.target.name]: event.target.value });
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
      .catch(err => {
        this.setState({ errors: err.response.data.errors })
      });
  }

  render() {

    const { errors } = this.state;
    console.log(errors.description);
    
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
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description.FirstName}</div>
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
                  {errors.description && (
                    <div className="invalid">{errors.description.LastName}</div>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.description
                    })}
                    placeholder="User Name"
                    name="UserName"
                    value={this.state.UserName}
                    onChange={this.onChange}
                  />
                  {errors.description && (
                    <div className="invalid">{errors.description.UserName}</div>
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
                   {errors.description && (
                    <div className="invalid-feedback">{errors.description.UserName}</div>
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