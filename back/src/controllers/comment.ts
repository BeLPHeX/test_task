import async from "async";
import { Comment, CommentDocument } from "../models/Comment";
import { Request, Response, NextFunction } from "express";
import { WriteError } from "mongodb";
import _ from "lodash";
import winston from "winston";

/**
 * POST /create
 * Create a new comment
 */
export const postCreate = async (req: Request, res: Response, next: NextFunction) => {
    const comment = new Comment({
        author: req.body.author || "anon",
        positive: !_.isUndefined(req.body.positive) ? req.body.positive : true,
        text: req.body.text || "",
        parent: req.body.parent || null
    });
    comment.save((err) => {
        if (err) {
            return res.status(400).send({ error: { message: "Error occured during saving" } });
        }
        return res.status(200).send({ error: false, message: "Comment saved!" });
    });
};

/**
 * POST /update
 * Update existing comment
 */
export const postUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.body.id;
    Comment.updateOne({ _id: commentId }, {
        positive: !_.isUndefined(req.body.positive) ? req.body.positive : true,
        text: req.body.text || "",
        updated: true
    }, (err, comment: CommentDocument) => {
        if (err) {
            return res.status(400).send({ error: { message: "Some internal error" } });
        }
        return res.status(200).send({ error: false, message: "Comment updated!" });
    });
};

/**
 * GET /read
 * Get comment for editing
 */
export const getRead = (req: Request, res: Response) => {
    Comment.findById(req.query.id, (err, comment: CommentDocument) => {
        if (err) {
            return res.status(400).send({ error: { message: "Some internal error" } });
        } else if (!comment) {
            return res.status(400).send({ error: { message: "Can't find comment" } });
        }
        return res.status(200).send({ error: false, message: "Comment data", comment: _.pick(comment, ["positive", "text", "_id", "author"]) });
    });
};

const deleteRelatedComments = (id: string) => {
    Comment.find({ parent: id, deleted: false }, (err, commentsArray: Array<CommentDocument>) => {
        commentsArray.map(comment => {
            Comment.updateOne({ _id: comment.id }, { deleted: true }, (err, response) => {
                deleteRelatedComments(comment._id);
            });
        });
    });
    // Comment.updateMany(
    //     { parent: id },
    //     { deleted: true },
    //     (err, response) => {
    //         console.log(response);
    //     });
    // Comment.findOneAndUpdate(
    //     { parent: id, deleted: false },
    //     { deleted: true },
    //     { new: false, useFindAndModify:false },
    //     function (err, documents) {
    //        console.log((documents);
    //     }
    // );

    // Comment.updateOne({ parent: id, deleted: false }, {
    //     deleted: true
    // }, (err, comment: CommentDocument) => {
    //     if (err) {
    //         return err;
    //     }
    //     deleteRelatedComments(comment._id);
    // });
    // Comment.deleteMany({ parent: id }).then((result) => { console.log(result); });

};

/**
 * GET /delete
 * Delete comment
 */
export const getDelete = (req: Request, res: Response) => {
    const commentId = req.query.id;
    Comment.updateOne({ _id: commentId }, {
        deleted: true
    }, (err, comment: CommentDocument) => {
        if (err) {
            return res.status(400).send({ error: { message: "Some internal error" } });
        }
        deleteRelatedComments(commentId);
        return res.status(200).send({ error: false, message: "Comment deleted!" });
    });

    // Comment.deleteOne({ _id: req.query.id }, (err) => {
    //     if (err) { return res.status(400).send({ error: { message: "Error occured during deleting" } }); }
    //     deleteRelatedComments(req.query.id);
    //     return res.status(200).send({ error: false, message: "Comment deleted!" });
    // });
};


/**
 * GET /comments
 * Get all comments
 */
export const getComments = (req: Request, res: Response) => {
    Comment.find({ deleted: false }, (err, commentsArray: Array<CommentDocument>) => {
        if (err) { return res.status(400).send({ error: { message: "Some internal error" } }); }
        return res.status(200).send({ error: false, message: "All comments", comments: commentsArray });
    });
};
