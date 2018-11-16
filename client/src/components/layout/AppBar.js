import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import LoginIcon from '@material-ui/icons/AccountCircle';
import LoginDialog from '../authenticate/LoginDialog';
import RegisterDialog from '../authenticate/RegisterDialog';

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

class AppBarComponent extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="primary">
            <LoginIcon />
          </IconButton>
          <LoginDialog />
        </MenuItem>
        <MenuItem>
          <IconButton color="primary">
            <LoginIcon onClick={this.handleMenuClose}/>
          </IconButton>
          <RegisterDialog style={{variant: 'text'}} />
        </MenuItem>

      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h5" color="inherit" noWrap>
              QnA
            </Typography>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {/* <Button variant="contained" color="primary" className={classes.button}>Login</Button>
              <Button variant="contained" color="primary">Sign Up</Button> */}
              <LoginDialog />
              <RegisterDialog style={{variant: 'contained'}} />
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    );
  }
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBarComponent);