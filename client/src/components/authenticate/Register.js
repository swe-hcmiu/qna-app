import React, { Component } from 'react'
import Line from './WavingLine'
class Register extends Component {
  render() {
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
    )
  }
}

export default Register;