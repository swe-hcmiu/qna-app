import React from 'react'
import { withStyles } from '@material-ui/core/styles';

const styles = theme =>({

});

const SessionComponent = (props) => {
  const { data } = props;
  
  return (
    <div>
     {
       data.map(item => (<li key={item.SessionId}>{item.SessionName}</li>))
     }
    </div>
  );
  
}


export default withStyles(styles)(SessionComponent);