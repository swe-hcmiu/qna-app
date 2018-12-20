import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AppBarComponent from '../../components/layout/AppBarComponent';


class AppBarContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
    };
  }

  onLoginButton = (e) => {
    this.props.history.push('/login');
  }

  onLogoutButton = (e) => {
    this.props.history.push('/');
  }

  onSignInButton = (e) => {
    this.props.history.push('/register');
  }

  render() {


    return (
      <div>
        <AppBarComponent 
          data={this.state}
          onLoginButton={this.onLoginButton}
          onSignInButton={this.onSignInButton}
          onLogoutButton={this.onLogoutButton}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, {})(withRouter(AppBarContainer));