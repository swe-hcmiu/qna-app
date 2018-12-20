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
    margin: theme.spacing.unit * 2,
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
    margin: theme.spacing.unit * 3,
  },
  grid: {
    height: '100vh',
  },
  ticker: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center'
  },
  typoSecondText: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2,  
  }
});

const Register = (props) => {
  const { classes, onChangeText, onTicket, loginButton, submitButton } = props;

  return (
    <React.Fragment >
      <div className={classes.root }>
        <Grid container direction='row' justify='center' alignItems='center' className={classes.grid}> 
          <Grid item>
            <Paper className={classes.paper} > 
              <Typography variant='display1' className={classes.typo}> Register </Typography>
              <FormControl className={classes.textField}>
                <InputLabel>First Name</InputLabel>
                  <Input
                    autoFocus
                    name='firstName'
                    value={props.data.firstName}
                    onChange={onChangeText}
                  />
              </FormControl >
              <FormControl className={classes.textField}>
                <InputLabel>Last Name</InputLabel>
                  <Input
                    name='lastName'
                    value={props.data.lastName}
                    onChange={onChangeText}
                  />
              </FormControl>
              <FormControl className={classes.textField}>
                <InputLabel>User Name</InputLabel>
                  <Input
                    name='userName'
                    value={props.data.userName}
                    onChange={onChangeText}
                  />
              </FormControl>
              <FormControl className={classes.textField}>
                <InputLabel>Password</InputLabel>
                  <Input
                    name='password'
                    type='password'
                    value={props.data.password}
                    onChange={onChangeText}
                  />
              </FormControl>
              <FormControl className={classes.textField}  >
                <InputLabel>Confirm Password</InputLabel>
                  <Input
                    name='password2'
                    type='password'
                    value={props.data.password2}
                    onChange={onChangeText}
                  />
              </FormControl>
              
              <div className={classes.button}>
                <Button onClick={loginButton} color='primary'>Login</Button>
                <Button onClick={submitButton} variant='contained' color='primary'>Submit</Button>
              </div>
              
            </Paper>
          </Grid>
          
        </Grid>
      </div>
    </React.Fragment>
  );
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);

