import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    flexGrow: 1,
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
      }
    }
    handleClickOpen = () => {
      this.setState({ open: true });
    };

    handleClose = () => {
      this.setState({ open: false });
    };

    render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <Button onClick={this.handleClickOpen} color='primary'>Login</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="Login"
          >
            <DialogTitle id="Login" className={classes.dialogTitle}>Login</DialogTitle>
            <DialogContent>
              <TextField
                margin='dense'
                id='userName'
                label='User Name'
                fullWidth
              />
              <TextField   
                margin='dense'
                id='userName'
                type='password'
                label='Password'
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

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(LoginDialog);