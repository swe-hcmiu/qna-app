import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button' ;



const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '90',
  },
  typo: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing.unit * 4,
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'column wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 2,
  },
  button: {
    display: 'flex',
    justifyContent: 'space-between',
    flexFlow: 'row',
    wrap: 'wrap',
    margin: theme.spacing.unit * 3,
    textTransform: 'none',
  },
  grid: {
    height: '80vh',
  }

});

const Login = (props) => {
  const { classes, onChangeText, data, signButton, loginButton } = props;
  return (
    <React.Fragment >
      <div className={classes.root}>
        <Grid container direction='row' justify='center' alignItems='center' className={classes.grid}> 
          <Grid item>
            <Paper className={classes.paper} > 
              <Typography variant='display1' gutterBottom className={classes.typo}> Login </Typography>
           
              <FormControl className={classes.textField}>
                <InputLabel>User Name</InputLabel>
                  <Input
                    autoFocus
                    name='userName'
                    value={data.userName}
                    onChange={onChangeText}
                  />
              </FormControl>
              <FormControl className={classes.textField}>
                <InputLabel>Password</InputLabel>
                  <Input
                    name='password'
                    type='password'
                    value={data.password}
                    onChange={onChangeText}
                  />
              </FormControl>
             
              <div className={classes.button}>
                <Button color='primary' onClick={signButton}>sign up</Button>
                <Button variant='contained' color='primary' onClick={loginButton}>Login</Button>
              </div>
              
            </Paper>
          </Grid>
          
        </Grid>
      </div>
    </React.Fragment>
  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);

