import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import LoginIcon from '@material-ui/icons/AccountCircle';
import {connect} from 'react-redux';
import UserAppBar from './UserAppBar';
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

class AppBarComponent extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  componentDidMount() {
    if(this.props.auth.isAuthenticated === false) {
      //this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.isAuthenticated) {
      console.log('enter!!!');
      this.props.history.push('/session');
    }

    if(nextProps.errors) {
      this.setState({errors: nextProps.errors});
    }
  }


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

  onLogOutClick = (e) => {
    e.preventDefault();

  }

  render() {
    const { mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { isAuthenticated, user } = this.props.auth;

    
    const renderGuest = (
      <div>
        <div className={classes.sectionDesktop}>
          <Button>Login</Button>
          <Button variant='contained' color='primary'>Sign In</Button>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
            <MoreIcon />
          </IconButton>
        </div>
      </div>
    );  

    const renderUser = (
      <div>
        <UserAppBar />
      </div>
    );


    const renderMobileMenu = (
      <div>
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
            <Button>Login</Button>
          </MenuItem>
          <MenuItem>
            <IconButton color="primary">
              <LoginIcon onClick={this.handleMenuClose}/>
            </IconButton>
             <Button variant='contained' color='primary'>Sign In</Button>
          </MenuItem>

        </Menu>
      </div>
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

            {isAuthenticated ? renderUser : renderGuest }
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    );
  }
}

AppBar.propTypes = {

};

const mapStatetoProps = (state) => ({
  auth: state.auth,
});


export default connect(mapStatetoProps)(withRouter(withStyles(styles)(AppBarComponent)));