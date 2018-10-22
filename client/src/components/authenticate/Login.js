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
                  <svg class="graphic graphic--nao" width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
                    <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0" />
                  </svg>
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