import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import defaultAvatar from '../../asset/avatar/default.jpg';
import LogOutIcon from '@material-ui/icons/PowerSettingsNewSharp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { logOutUser } from '../../redux/actions/authAction';
import { withRouter } from 'react-router-dom';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
    wrap: 'nowrap',
    
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
  logOutButton: {

  },
};

class UserAppBar extends Component {
  constructor(props) {
    super(props);
  }

  handleLogOut = (event) => {
    event.preventDefault();
    this.props.logOutUser();
    this.props.history.push('/');
  }

  render () {
    const { DisplayName } = this.props.auth.user;
    console.log('displayname:', this.props);
    
    const { classes } = this.props;
    return (
        <div className={classes.row}>
          <Tooltip title={DisplayName}>
            <Avatar alt={DisplayName} src={defaultAvatar} className={classes.avatar} />
          </Tooltip>
          <Tooltip title="Log Out">
            <IconButton onClick={this.handleLogOut}>
              <LogOutIcon />
            </IconButton>
          </Tooltip>
        </div>
      );
  }
}


UserAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {logOutUser})(withRouter(withStyles(styles)(UserAppBar)));