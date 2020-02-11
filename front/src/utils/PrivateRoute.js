import React from 'react';
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// import { Provider } from "react-redux";
// import store from "./store";
import PropTypes from "prop-types";


const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = rest;
    return (
        <Route
            {...rest}
            render={props => (
                isAuthenticated
                    ? (
                        <Component {...props} />
                    )
                    : (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
            )}
        />
    );
};

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
    isAuthenticated: state.auth.isAuthenticated,
    ...props
})

export default connect(mapStateToProps, null, null, {
    pure: false,
})(PrivateRoute);