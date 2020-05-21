const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment_text: String,
    postedBy:String,
    postedBy_id:String,
    posted_at:Date,
    post_id:String
  })

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;