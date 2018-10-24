import React, { Component } from 'react'
import Line from './WavingLine'
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
      <div>
         <div className="modal fade" id="registerModal">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Sign Up</h4>
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
              </div>
              {/* Modal body */}
              <div className="modal-body">
              <div class="input input--nao">
                  <input class="input__field input__field--nao" placeholder="Username" type="text" id="username" />
                  <Line />
                </div>
                <div class="input input--nao">
                  <input class="input__field input__field--nao" placeholder="Email" type="email" id="email" />
                  <Line />
                </div>
                <div class="input input--nao">
                  <input class="input__field input__field--nao" placeholder="Password" type="password" id="password" />
                  <Line />
                </div>
                <div class="input input--nao">
                  <input class="input__field input__field--nao" placeholder="Confirm Password" type="password" />
                  <Line />
                </div>
              </div>
              {/* Modal footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  data-dismiss="modal"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;