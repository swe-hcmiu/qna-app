import React, { Component } from 'react'
import {connect} from 'react-redux';
import LoginComponent from '../../components/authenticate/LoginComponent';
import {loginUser} from '../../redux/actions/authAction';

class LoginContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors});
    }
  }

  componentDidMount() {
   
   
  }

  onChangeText = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  signButton = (e) => {
    e.preventDefault();
    this.props.history.push('/register');
  };

  loginButton = (e) => {
    
    e.preventDefault();
    
    const userInput = {
      username: this.state.userName,
      password: this.state.password,
    };

    this.props.loginUser(userInput);
      
  };


  render() {
  
    console.log(this.state);
    return (
      <div>
        <LoginComponent 
          data={this.state} 
          onChangeText={this.onChangeText}
          signButton={this.signButton}
          loginButton={this.loginButton}
      />
      </div>
    );

  }
}

LoginContainer.propTypes = {
  
};


const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, {loginUser})(LoginContainer);