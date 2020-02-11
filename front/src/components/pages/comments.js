import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getComments, readComment, deleteComment, createComment, updateComment, deleteOperationMessage } from "../../actions/commentActions";
import classnames from "classnames";

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      id: "",
      author: "",
      text: "",
      positive: true,
      modal: {},
      errors: {},
      message: ''
    }
  }

  componentDidMount() {
    this.props.getComments();
    this.setState({
      modal: {
        ...this.state.modal,
        onChange: this.onChange,
        toggleChange: this.toggleChange,
        close: this.closeFormModal,
      },
    })
  }

  commentsNestChildren = comments => {
    let hashTable = Object.create(null)
    comments.forEach(aData => hashTable[aData._id] = { ...aData, childNodes: [] })
    let nested = []
    comments.forEach(aData => {
      if (aData.parent) hashTable[aData.parent].childNodes.push(hashTable[aData._id])
      else nested.push(hashTable[aData._id])
    })
    return nested
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    if (nextProps.comments.comments) {

      this.setState({
        comments: this.commentsNestChildren(nextProps.comments.comments)
      })
    }
    if (nextProps.comments.current) {
      this.setState({
        id: nextProps.comments.current._id || "",
        author: nextProps.comments.current.author || "",
        text: nextProps.comments.current.text || "",
        positive: typeof nextProps.comments.current.positive === 'undefined' ? true : nextProps.comments.current.positive,
      })
    }
    if (nextProps.comments.message && Object.keys(nextProps.comments.message).length) {
      this.setState({
        message: nextProps.comments.message
      }, () => {
        // TODO change this awful statement, use transaction
        let successMessage = ["Comment saved!", "Comment updated!", "Comment deleted!"]
        if (successMessage.indexOf(this.state.message) !== 1) {
          this.props.deleteOperationMessage();
          this.refreshComments();
        }
      })
    }
  }

  refreshComments = () => {
    //TODO optimize for refreshing only updated comment
    this.props.getComments();
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  toggleChange = e => {
    this.setState({
      [e.target.id]: !this.state[e.target.id],
    });
  }

  showUpdateModal = (id) => {
    this.props.readComment(id);
    this.setState({
      modal: {
        ...this.state.modal,
        visible: true,
        update: true,
        action: this.submitUpdateComment,
      }
    })
  }
  showReplyModal = (id) => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: true,
        reply: true,
        action: this.submitReplyComment,
      },
      parent: id
    })
  }
  showCreateModal = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: true,
        create: true,
        action: this.submitCreateComment,
      }
    })
  }

  submitUpdateComment = (e) => {
    e.preventDefault();
    const comment = {
      id: this.state.id,
      positive: this.state.positive,
      text: this.state.text
    }

    this.props.updateComment(comment);
    this.closeFormModal();
  }
  submitCreateComment = (e) => {
    e.preventDefault();
    const comment = {
      author: this.state.author,
      positive: this.state.positive,
      text: this.state.text
    }
    this.props.createComment(comment);
    this.closeFormModal();
  }
  submitReplyComment = (e) => {
    e.preventDefault();
    const comment = {
      parent: this.state.parent,
      author: this.state.author,
      positive: this.state.positive,
      text: this.state.text
    }

    this.props.createComment(comment);
    this.closeFormModal();
  }
  deleteComment = (id) => {
    this.props.deleteComment(id);
  }
  closeFormModal = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false,
        create: false,
        update: false,
        reply: false,
        action: () => { },
      },
      id: "",
      parent: null,
      author: "",
      text: "",
      positive: true,
    })
  }

  render() {

    const { errors, comments, modal, author, text, positive } = this.state
    const form = {
      author,
      text,
      positive
    }
    const actions = {
      update: this.showUpdateModal,
      reply: this.showReplyModal,
      delete: this.deleteComment
    }
    return (
      <>
        {comments.map(comment => {
          return (
            <React.Fragment key={comment._id}>
              <CommentUI
                comment={comment}
                actions={actions}
              />
              <hr />
            </React.Fragment>
          )
        })}
        <button className="btn btn-primary  btn-block" onClick={this.showCreateModal}>Create Comment</button>
        {modal.visible && <CommentFormUI modal={modal} errors={errors} form={form} />}
      </>
    )
  }
}

function CommentUI(params) {
  const { comment, actions } = params;
  const updateDate = new Date(comment.updatedAt);
  let updateDateFormat = 'd-m-Y, h:m:s'
    .replace('d', updateDate.getDate())
    .replace('m', updateDate.getMonth() + 1)
    .replace('Y', updateDate.getFullYear())
    .replace('h', updateDate.getHours())
    .replace('m', updateDate.getMinutes())
    .replace('s', updateDate.getSeconds())


  return (
    <div>
      <h6>{comment.author}</h6>
      <span className={classnames("comment_text", {
        'comment_negative': !comment.positive,
      })}>{comment.text}</span><br />
      {comment.updated && <small className="text-muted">This comment was edited at {updateDateFormat}</small>}<br />
      <button className="btn btn-secondary btn-sm" onClick={() => { actions.update(comment._id) }}>Update</button>
      <button className="btn btn-info btn-sm" onClick={() => { actions.reply(comment._id) }}>Reply</button>
      <button className="btn btn-danger btn-sm" onClick={() => { actions.delete(comment._id) }}>Delete</button>
      {comment.childNodes &&
        comment.childNodes.map(childComment => {
          return (
            <div style={{ marginLeft: "20px" }} key={childComment._id}>
              <CommentUI
                key={childComment._id}
                comment={childComment}
                actions={actions}
              />
            </div>
          )
        })
      }
    </div>
  )
}

function CommentFormUI(params) {
  const { errors, form } = params;
  const { action, update, reply, create, onChange, toggleChange, close } = params.modal;
  // console.log(params)
  const modalShow = { "display": "block", "opacity": "1", "zIndex": "1072" }
  return (
    < div className="modal fade show" id="exampleModal" style={modalShow} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">{update ? "Comment by " + form.author : "New comment"}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={close}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {errors && errors.general && <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>}
            <div className="form-group">
              {!update && <>
                <label>Author: </label>
                <input type="text"
                  error={errors.author}
                  id="author"
                  required
                  className="form-control"
                  value={form.author || ""}
                  onChange={onChange}
                />
              </>
              }
              <label>Comment: </label>
              <input type="text"
                error={errors.text}
                id="text"
                required
                className="form-control"
                value={form.text || ""}
                onChange={onChange}
              />
              <label>Is Positive? </label>
              <input type="checkbox"
                error={errors.positive}
                id="positive"
                className="form-control"
                checked={form.positive}
                onChange={toggleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={close}>Close</button>
            <button type="button" className="btn btn-primary" onClick={action}>Save</button>
          </div>
        </div>
      </div>
    </div >
  )
}

Comments.propTypes = {
  getComments: PropTypes.func.isRequired,
  readComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteOperationMessage: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors,
  comments: state.comments
});
export default connect(
  mapStateToProps,
  { getComments, readComment, deleteComment, createComment, updateComment, deleteOperationMessage }
)(Comments);