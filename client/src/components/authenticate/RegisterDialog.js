import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import { registerUser } from '../../redux/actions/authAction';
import {connect} from 'react-redux';
import PropsTypes from 'prop-types';
import LoginDialog from './LoginDialog';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'center',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dialogContent: {
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center'
  }
})


class RegisterDialog extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        errors: "",
        registerSuccess: false,
      };
      this.onChange = this.onChange.bind(this); 
    };

    componentWillReceiveProps(nextProps) {
      if(nextProps.errors) {
        this.setState({errors: nextProps.errors});
      }
      // check  is register success? then render an alert 
      if(nextProps.auth.isRegisterSuccess){
        // console.log('understand');
        this.setState({registerSuccess: nextProps.auth.isRegisterSuccess});
      }
    }

    handleOpen = () => {
      this.setState({ open: true });
    };

    handleClose = () => {
      this.setState({ open: false, registerSuccess: false });
    }

    onChange(e) {
      // console.log( `target name ${e.target.name} value  ${e.target.value}`);
      this.setState({ [e.target.name]: e.target.value });
    }
  
    onsubmit = (event) => {
      event.preventDefault();
      const newUser = {
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        UserName: this.state.userName,
        UserPass: this.state.password,
      }
      // console.log(newUser);
      
      this.props.registerUser(newUser);
      
    }

    render () {
      const { errors } = this.state;
      const { style, classes } = this.props;

      const renderRegisterSuccess = (
        <div>
          <Dialog
            open={this.state.registerSuccess}
            onClose={this.handleClose}
            aria-labelledby="Register"
          >
            <DialogTitle className={classes.dialogTitle}>Register Success !!!</DialogTitle>
            <DialogActions>
              <LoginDialog />
              <Button onClick={this.handleClose} color='primary'>Ok</Button>            
            </DialogActions>
          </Dialog>
        </div>
      );
      return (
        <div>
          <Button onClick={this.handleOpen} variant={style.variant} color='primary'>Sign Up</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="Register"
          >
            <DialogTitle id="Sign Up" className={classes.dialogTitle}>Register</DialogTitle>
            
            <DialogContent className={classes.dialogContent}>
              <FormControl>
                <TextField
                  id="outlined-fname"
                  label="First Name"
                  name="firstName"
                  className={classes.textField}
                  margin='dense'
                  variant="outlined"
                  value ={this.state.firstName}
                  onChange={this.onChange}
                  error ={errors.firstName}
                
                />
                <TextField
                  id="outlined-lname"
                  label="Last Name"
                  name="lastName"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  value ={this.state.lastName}
                  error ={errors.lastName}
                  onChange={this.onChange}
                />
                <TextField
                  id="outlined-username"
                  label="Name"
                  name="userName"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  value ={this.state.userName}
                  error ={errors.userName}
                  onChange={this.onChange}
                />
                <TextField   
                  id="outlined-password-input"
                  label="Password"
                  name="password"
                  className={classes.textField}
                  type="password"
                  autoComplete="current-password"
                  margin="dense"
                  variant="outlined"
                  value ={this.state.password}
                  error ={errors.password}
                  onChange ={this.onChange}
                />
              </FormControl>
              
           </DialogContent>
           <DialogActions>
             <Button onClick={this.handleClose} color='primary'>Cancel</Button>
             <Button onClick={this.onsubmit} color='primary'>Submit</Button>
           </DialogActions>
          </Dialog>
          {renderRegisterSuccess}
        </div>
      );
    }
}  

RegisterDialog.propTypes = {
  registerUser: PropsTypes.func.isRequired,
  auth: PropsTypes.object.isRequired,
  errors: PropsTypes.object.isRequired,
};


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

// export default withStyles(styles)(RegisterDialog);
export default connect(mapStateToProps, {registerUser})(withStyles(styles)(RegisterDialog));