import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect, isEmpty} from "react-redux-firebase";
import {Grid} from "semantic-ui-react";
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
//import UserDetailedEvents from './UserDetailedEvents';
import UserDetailedSidebar from './UserDetailedSidebar';
import { userDetailedQuery } from "../userDetailedQueries";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }

  return{
      profile,
      userUid,
      auth: state.firebase.auth,
      requesting: state.firestore.status.requesting
    }
  
    };

  class UserDetailedPage extends Component {
    render() {
      const { profile, auth, match, requesting} = this.props;
      const isCurrentUser = auth.uid === match.params.id;
      const loading = Object.values(requesting).some(a => a === true);
      if(loading) return <LoadingComponent />
      return (
        <Grid>
          <UserDetailedHeader profile={profile} />
          <UserDetailedDescription profile={profile}/>
          <UserDetailedSidebar isCurrentUser={isCurrentUser} profile={profile}/>
          
         
        </Grid>
      );
    }
  }

  export default compose(
    connect(mapState),
    firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
  )(UserDetailedPage);