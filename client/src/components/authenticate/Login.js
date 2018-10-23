import React, { Component } from 'react'
import Line from './WavingLine'
class Login extends Component {
  render() {
    return (
      <div>
        <div className="modal fade" id="loginModal">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Login</h4>
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
                  <input class="input__field input__field--nao" placeholder="Password" type="password" id="password" />
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;