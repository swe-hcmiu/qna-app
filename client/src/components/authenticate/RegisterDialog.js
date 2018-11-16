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
            <DialogContent className={classes.dialogContent}>
              <TextField
                id="outlined-name"
                label="First Name"
                className={classes.textField}
                margin='dense'
                variant="outlined"
              />
              <TextField
                id="outlined-name"
                label="Last Name"
                className={classes.textField}
                margin="dense"
                variant="outlined"
              />
              <TextField
                id="outlined-name"
                label="Name"
                className={classes.textField}
                margin="dense"
                variant="outlined"
              />
              <TextField   
                id="outlined-password-input"
                label="Password"
                className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="dense"
                variant="outlined"
                
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