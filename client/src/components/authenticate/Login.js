import React, { Component } from 'react'
import Line from './WavingLine'
class Login extends Component {
  render() {
    return (
      <div>
        <div className="modal fade" id="loginModal">
          <div className="modal-dialog">
            <form className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Login</h4>
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
              </div>
              {/* Modal body */}
              <div className="modal-body">
                <div className="input input--nao">
                  <input className="input__field input__field--nao" 
                    placeholder="Username" 
                    type="text" 
                    name="UserName" 
                  />
                   <Line />
                </div>
                
                <div className="input input--nao">
                  <input 
                    className="input__field input__field--nao" 
                    placeholder="Password" 
                    type="password" 
                    name="UserPass" 
                  />
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
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;