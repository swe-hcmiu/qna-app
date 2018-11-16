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
            aria-labelledby='form-dialog-title'
          >
            <DialogTitle className={classes.dialogTitle} color='primary'>Login</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <TextField
                id="outlined-name"
                label="User Name"
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

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(LoginDialog);