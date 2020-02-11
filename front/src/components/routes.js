import React, { Component } from 'react';
import { Route, Link, withRouter, Redirect, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Home from "./pages/home";
import Navbar from "./navbar.component"
import Footer from "./footer.component"
class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: null
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        return (
            <div className="container">
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Redirect to="/" />
                </Switch>
                <Footer/>
            </div>
        )
    }
}

Routes.propTypes = {
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    {}
)(withRouter(Routes));