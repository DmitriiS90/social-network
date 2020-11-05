import React from 'react';
import styles from './Users.module.css';
import { connect } from 'react-redux';
import Users from './users.jsx';
import { setCurrentPageAC, toggleFolowingProgressAC, getUsersThunkCreator, followThunk, unfollowThunk } from '../../redux/users-reducer';
import Preloader from '../common/preloader/preloader';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import { compose } from 'redux';
import { getPageSize, getTotalUsersCount,getCurrentPage,getIsFetching,getFolowingInProgress, getUsers } from '../../redux/user-selectors';



class UsersContainer extends React.Component {
    componentDidMount() {              
        this.props.getUsersThunk(this.props.currentPage, this.props.pageSize)  
    }
    onPageChanged = (pageNumber) => {
        this.props.getUsersThunk(pageNumber , this.props.pageSize)
    }
    render() {                                           
        return <> 
            {this.props.isFetching ? <Preloader /> : null}           
            <Users totalUsersCount={this.props.totalUsersCount}
                pageSize={this.props.pageSize}
                currentPage={this.props.currentPage}
                users={this.props.users}
                onPageChanged={this.onPageChanged}
                unfollow={this.props.unfollow}
                follow={this.props.follow}
                toggleFolowingProgress={this.props.toggleFolowingProgress}
                folowingInProgress={this.props.folowingInProgress} />
        </>
    }
}


let mapStateToProps = (state) => {
    return {
        users: getUsers(state),            
        pageSize: getPageSize(state),
        totalUsersCount: getTotalUsersCount(state),
        currentPage: getCurrentPage(state),
        isFetching: getIsFetching(state),
        folowingInProgress: getFolowingInProgress(state)
    }
}


export default compose (
    withAuthRedirect,
    connect (mapStateToProps, {
        follow: followThunk,
        unfollow: unfollowThunk ,
        setCurrentPage: setCurrentPageAC, 
        toggleFolowingProgress: toggleFolowingProgressAC,
        getUsersThunk: getUsersThunkCreator
    }),             
) (UsersContainer)

