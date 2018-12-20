import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';


const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    background: "#363D42",
    position: 'relative',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  button: {
    marginRight: 10,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },

  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

const AppBarComponent = (props) => {
  const { 
    classes, 
    onLoginButton, 
    onLogoutButton,
    onSignInButton, 
  } = props;


  return(
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            QnA
          </Typography>
          <Button color="inherit" onClick={onLoginButton}>Login</Button>
          <Button color="inherit" onClick={onSignInButton}>Sign In</Button>
        </Toolbar>
      </AppBar>

    </React.Fragment>
  );
}

AppBarComponent.propTypes = {

};

export default withStyles(styles)(AppBarComponent);