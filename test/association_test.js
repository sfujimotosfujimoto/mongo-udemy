const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');
const assert = require('assert');

describe('Associations', () => {
  let joe, blogPost, comment;
  beforeEach((done) =>  {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is great!', content: 'Yep it really is.'});
    comment = new Comment({ content: 'Congrats on great post.'});

    joe.blogPosts.push(blogPost); //mongoose guesses that you're trying to make an association so it only adds the ObjectId
    blogPost.comments.push(comment);
    comment.user = joe; //mongoose magic - just adds ref

    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done());
  });

  it('saves a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is great!');
        done();
      });
  });
});
