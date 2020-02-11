import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentsLength: 0,
      positive: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.comments.comments) {
      this.setState({
        commentsLength: nextProps.comments.comments.length,
        positive: nextProps.comments.comments.filter(comment => comment.positive).length
      })
    }
  }
  render() {
    const { commentsLength, positive } = this.state;
    return (
      <>
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <Link to="/" className="navbar-brand">
            <img src="https://static1.squarespace.com/static/52050743e4b061002eab9e17/t/5a8ae768c83025f59acc48f9/1576864922118/?format=100w" alt="Fancy" />
          </Link>
          <div className="collpase navbar-collapse">
            <span className="text_white">Comments number: {commentsLength}</span><br />
            <span className="text_white">Positive/Negative: {positive}/{commentsLength - positive}</span>
          </div>
        </nav>
      </>
    );
  }
}

Navbar.propTypes = {
  comments: PropTypes.object.isRequired,

};
const mapStateToProps = state => ({
  comments: state.comments
});
export default connect(
  mapStateToProps,
  {}
)(withRouter(Navbar));