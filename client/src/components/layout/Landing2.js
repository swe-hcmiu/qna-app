import React, { Component } from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Background from '../../asset/img/blackboard-background.jpg';

const styles = theme => ({
 
  landing: {
    backgroundPosition: 'center',
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',
    height: '100vh',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  Title: {
    maxWidth: '600',
    margin: '0 auto',
    padding: `${theme.spacing.unit * 12}px 0 ${theme.spacing.unit * 8}px`,
  },
  search: {
    display: 'flex',
    position: 'relative', 
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.45),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.75),
    },
    marginLeft: '20%',
    maxWidth: '600',
    
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    top: theme.spacing.unit * 2,
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    align: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    
    height: 60,
    fontSize: 15,
  },
  inputInput: {
    position: 'absolute',
    padding: '50px',
    maxWidth: '600',
  },
});

class Landing extends Component {
  

  componentDidMount () {
    if(this.props.isAuthenticated){
      this.props.history.push('/session');
    }
  }

  render() {
    
    const { classes } = this.props;

    return (  
      <div className={classes.landing}>      
     
      </div>
    );
  }
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})
 
export default connect(mapStateToProps)(withStyles(styles)(Landing));