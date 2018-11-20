import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loginUser} from '../../redux/actions/authAction';
import {withRouter} from 'react-router-dom';
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dialogContent: {
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'column wrap',
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'center',
  }
});

class LoginDialog extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        errors: {},
        userName: '',
        password: '',
      };
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.auth.isAuthenticated) {
        this.props.history.push('/session');
      }

      if(nextProps.errors) {
        this.setState({errors: nextProps.errors});
      }
    }
  
    handleClickOpen = () => {
      this.setState({ open: true });
    };

    handleClose = () => {
      this.setState({ open: false });
    };

    onChange = (event) => {
      this.setState({ [event.target.name]: event.target.value });
    }

    onsubmit = () => {
      const user = {
        username: this.state.userName,
        password: this.state.password,
      };

      this.props.loginUser(user);
    }

    render() {
      const { classes } = this.props;
      console.log(this.state);
      return (
        <div className={classes.root}>
          <Button onClick={this.handleClickOpen} color='primary'>Login</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby='form-dialog-title'
          >
            <DialogTitle className={classes.dialogTitle} color='primary'>Login</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <TextField
                  id="outlined-name"
                  label="User Name"
                  name="userName"
                  className={classes.textField}
                  margin="dense"
                  value={this.state.userName}
                  onChange={this.onChange}
                  variant="outlined"
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
                  value={this.state.password}
                  onChange={this.onChange}
                />
              
              
           </DialogContent>
           <DialogActions>
             <Button onClick={this.handleClose} color='primary'>Cancel</Button>
             <Button onClick={this.onsubmit} color='primary'>Submit</Button>
           </DialogActions>
          </Dialog>
        </div>
      );
    }
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  logginUser: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(mapStateToProps, {loginUser})(withRouter(withStyles(styles)(LoginDialog)));