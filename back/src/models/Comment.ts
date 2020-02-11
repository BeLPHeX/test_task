import mongoose from "mongoose";

export type CommentDocument = mongoose.Document & {
    author: string;
    positive: boolean;
    text: string;
    parent: string;
    updated: boolean;
    deleted: boolean;
};


const commentSchema = new mongoose.Schema({
    author: { type: String, default: "Anon" },
    positive: { type: Boolean, default: true },
    text: { type: String, default: "" },
    parent: { type: String, default: null },
    updated: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

/**
 * Password hash middleware.
 */
// userSchema.pre("save", function save(next) {
//     const user = this as UserDocument;
//     if (!user.isModified("password")) { return next(); }
//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) { return next(err); }
//         bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
//             if (err) { return next(err); }
//             user.password = hash;
//             next();
//         });
//     });
// });

// const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
//         cb(err, isMatch);
//     });
// };

// userSchema.methods.comparePassword = comparePassword;


export const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);
