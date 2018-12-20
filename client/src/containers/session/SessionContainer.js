import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import SessionComponent from '../../components/session/SessionComponent';
import { getListOfSession } from '../../redux/actions/sessionAction';

class SessionContainer extends Component {
  constructor(props) { 
    super(props);
    
  }

  componentDidMount() {
    this.props.getListOfSession();
  }

  componentDidUpdate() {
    //console.log(this.props.data);
   // console.log(this.props.data);
    
  }

  render() {

    const { loading, data } = this.props; 
    console.log('session', data);
    
    
    if(loading) {
     // console.log(loading);
      
      return(
        <div>loading</div>
      );
    }
    
    if(data) {
      return(
        <Fragment>
          <SessionComponent data={data}/>
        </Fragment>
      );
    
    }
  }
   

}

const mapStateToProps = (state) => ({
  data: state.session.data,
  loading: state.session.loading,
  session: state.session
});



export default connect(mapStateToProps, {getListOfSession})(SessionContainer);