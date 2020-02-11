import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillReceiveProps(nextProps) {
  }
  render() {
    const { commentsLength } = this.state;
    const year = new Date().getFullYear()
    return (
      <>
        <footer className="footer fixed-bottom">
          <div className="container">
            <span className="text-muted">Made by Alex. Please don't show this anybody... ({year})</span>
          </div>
        </footer>
      </>
    );
  }
}

Footer.propTypes = {
};
const mapStateToProps = state => ({
});
export default connect(
  mapStateToProps,
  {}
)(withRouter(Footer));