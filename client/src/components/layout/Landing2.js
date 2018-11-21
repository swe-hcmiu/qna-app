import React, { Component } from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import Background from '../../asset/img/blackboard-background.jpg';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
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
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    if(this.props.isAuthenticated){
      this.props.history.push('/session');
    }
  }

  render() {
    
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      <div className={classes.landing}>      
        <div className={classes.layout}>
          <Typography className={classes.Title} variant="h2" align='center' color="textPrimary" >
              Question And Answers
            </Typography>
            
            <Grid item xs={10} >
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Find Your Session..."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                />
              </div>       
            </Grid>  
        </div>
      </div>
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