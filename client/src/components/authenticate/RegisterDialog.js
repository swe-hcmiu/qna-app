import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'center',
  }
})


class RegisterDialog extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
      };
    };

    handleOpen = () => {
      this.setState({ open: true });
    };

    handleClose = () => {
      this.setState({ open: false });
    }

    render () {
      const { style, classes } = this.props;
      return (
        <div>
          <Button onClick={this.handleOpen} variant={style.variant} color='primary'>Sign Up</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="Register"
          >
            <DialogTitle id="Sign Up" className={classes.dialogTitle}>Register</DialogTitle>
            <DialogContent>
              <TextField   
                margin='dense'
                id='firstName'
                label='First Name'
                fullWidth
              />
              <TextField   
                margin='dense'
                id='lastName'
                label='Last Name'
                fullWidth
              />
              <TextField
                margin='dense'
                id='userName'
                label='User Name'
                fullWidth
              />
              <TextField   
                margin='dense'
                id='userPass'
                label='Password'
                type='password'
                fullWidth
              />
              
           </DialogContent>
           <DialogActions>
             <Button onClick={this.handleClose} color='primary'>Cancel</Button>
             <Button onClick={this.handleClose} color='primary'>Login</Button>
           </DialogActions>
          </Dialog>
        </div>
      );
    }
}  

export default withStyles(styles)(RegisterDialog);