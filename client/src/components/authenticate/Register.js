import React, { Component } from 'react'
import Line from './WavingLine'
// import classnames from 'classnames';
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
    // console.log('-------------------------------');
    
    // console.log('new user', newUser);
    
    axios
      .post('http://localhost:5000/users/register', newUser)
      .then(res => console.log(res.data))
      .catch(err => {
        let tempErr = Object.values(err.response.data.errors.description);
        var resObject = tempErr.reduce((res, cur) => {
          for(let key in cur) {
            if(cur.hasOwnProperty(key)) {
              res[key] = cur[key];
            }
          }
          return res;
        }, {});
        // console.log('first Name', resObject.FirstName);
        
        this.setState({ errors: resObject })
      });
  }

  render() {

    const { errors } = this.state;
    // console.log(errors);
    // console.log(this.state);
    
    
    return (
      <div>
        <div className="modal fade" id="registerModal">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={this.onSubmit}>
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Sign Up</h4>
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
              </div>
              {/* Modal body */}
              <div className="modal-body">
                <div className="input input--nao">
                  <input 
                    className="input__field input__field--nao" 
                    placeholder="First Name" 
                    type="text" 
                    value={this.state.FirstName}
                    onChange={this.onChange}
                    name="FirstName"
                  />
                  <Line /> 
                </div>   
                {errors.FirstName && (<small className="text-center text-danger"><br />{errors.FirstName}</small>)}
                <div className="input input--nao">
                  <input 
                    className="input__field input__field--nao" 
                    placeholder="Last Name" 
                    type="text"
                    value={this.state.LastName}
                    onChange={this.onChange} 
                    name="LastName" 
                  />
                   <Line /> 
                </div>   
                {errors.LastName && (<small className="text-center text-danger"><br />{errors.LastName}</small>)}
                
                <div className="input input--nao">
                  <input 
                    className="input__field input__field--nao" 
                    placeholder="User Name" 
                    type="UserName" 
                    value={this.state.UserName}
                    onChange={this.onChange}
                    name="UserName" 
                  /> 
                   <Line />  
                </div>   
                {errors.UserName && (<small className="text-center text-danger"><br />{errors.UserName}</small>)}
                <div className="input input--nao">
                  <input 
                    className="input__field input__field--nao" 
                    placeholder="Password" 
                    type="password" 
                    value={this.state.UserPass}
                    onChange={this.onChange}
                    name="UserPass"
                  />
                  <Line /> 
                </div>   
                {errors.UserPass && (<small className="text-center text-danger"><br />{errors.UserPass}</small>)}
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
                <input
                  type="submit"
                  className="btn btn-success"
                > 
                </input>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;