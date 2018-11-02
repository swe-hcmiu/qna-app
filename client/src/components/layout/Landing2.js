import React, { Component } from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import Background from '../../asset/img/blackboard-background.jpg';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  landing: {
    position: 'relative',
    backgroundPosition: 'center',
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',
    height: '100vh',
  },
  Title: {
    position: 'relative',
    top: '200px',
    justifyContent: 'center',
  },
  search: {
    position: 'absolute',
    top: '350px',
    left: '350px',
    right: '350px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.45),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.75),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    position: 'relative',
    color: 'inherit',
    width: 'auto',
    height: 60,
    fontSize: 20,
  },
  inputInput: {
    position: 'absolute',
    left: '-500px',
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
});

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
          <div className={classes.landing}>
            <Grid >
              <Typography className={classes.Title} variant="h1" color="textPrimary" noWrap>
                Question And Answers
              </Typography>
            </Grid>
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
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(Landing);