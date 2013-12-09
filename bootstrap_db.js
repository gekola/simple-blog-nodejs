if (!db.users.findOne()) {
  db.users.insert([{
    first_name: "ok",
    last_name: "ok",
    email: "asdf@1.a",
    username: "ok2",
    password: "$2a$04$v0hUh4dek2Dho2CQ/jaSze4qjvMG5BQ/UYkChRkTU9Gts7/Tw7MRW",
    created_at: ISODate("2013-12-04T21:49:17.871Z"),
    role: "author"
  }, {
    created_at: ISODate("2013-11-30T22:15:33.967Z"),
    email: "ok@affdsf.vvvv",
    first_name: "Nick",
    last_name: "Herman",
    password: "$2a$04$uRivXHqY9bk7sdgpZrL71.krLLaNaX7qAczNFvPZnN189ZH8VmveC",
    username: "ok",
    role: "admin"
  }]);

  var id = db.users.find({username: "ok"})["_id"];
  db.userstatuses.insert([{
    status: "Hi!",
    user: id,
    created_at: ISODate("2013-11-15T22:15:33.967Z")
  }, {
    status: "Anyone?",
    user: id,
    created_at: ISODate("2013-11-18T12:13:33.927Z")
  }, {
    status: "Let's blog!",
    user: id,
    created_at: ISODate("2013-11-28T03:43:13.927Z")
  }]);
}

if (!db.articles.findOne()) {
  db.articles.insert([{
    author: "ok",
    body: {data: [{data: {text: "QWERTYUIOP{}"}, type: "text"}]},
    comments: [{
      author: "ok",
      comment: "AAAAAAAAAAAAAAAAAAAA",
      comments: [{
        author: "ok",
        comment: "BBBBBBBBBBBBBBB",
        comments: [{
          author: "ok",
          comment: "CCCCCCCCCCCC",
          comments: [{
            author: "ok",
            comment: "DDDDDDDDDDDDDDDDDDDDDDDDDDD",
            created_at: ISODate("2013-12-06T01:36:53.013Z")
          }, {
            author: "ok2",
            comment: "D2D2D2D2D2D2D2D2D2D2D2D2D2",
            created_at: ISODate("2013-12-06T15:00:16.148Z")
          }],
          created_at: ISODate("2013-12-06T00:56:46.103Z")
        }],
        created_at: ISODate("2013-12-06T00:55:12.750Z")
      }],
      created_at: ISODate("2013-12-06T00:55:07.417Z")
    }, {
      author: "ok",
      comment: "-------------------------",
      comments: [{
        author: "ok2",
        comment: "+++++++++++++++++++++++",
        created_at: ISODate("2013-12-06T14:59:57.591Z")
      }],
      created_at: ISODate("2013-12-06T01:36:40.333Z")
    }],
    created_at: ISODate("2013-12-06T00:55:03.210Z"),
    preview: "--------------------------",
    seo_options: {
      author: "Nick Herman <gerkola@gmail.com>",
      description: "--------------------------",
      keywords: []
    },
    tags: [],
    title: "Asdfghjkl"
  }, {
    approved: true,
    author: "ok2",
    body: {data: [
     {data: {text : "> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
             cite : "AAAAAAAAAAAAAAAAA"},
      type: "quote"}
    ]},
    comments: [{
      author: "ok2",
      comment: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      comments: [{
        author: "ok2",
        comment: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
        created_at: ISODate("2013-12-06T15:05:38.223Z")
      }],
      created_at: ISODate("2013-12-06T15:05:33.171Z")
    }],
    created_at: ISODate("2013-12-06T15:05:18.955Z"),
    preview: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    seo_options: {
      author: "Nick Herman <gerkola@gmail.com>",
      description: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      keywords: ["animals", "art", "asia"]
    },
    tags: ["animals", "art", "asia"],
    title: "AAAAAAAAAAAAA"
  }, {
    approved: true,
    author: "ok",
    body: {data: [
      {data: {file: {large: {url: "/uploads/31201-1n8se41.png"},
              url: "/uploads/31201-1n8se41.png"}},
       type: "image"
      }
    ]},
    comments: [],
    created_at: ISODate("2013-12-07T00:26:17.164Z"),
    preview: "asdfasdfasdfasdfasd",
    seo_options: {
      author: "Nick Herman <gerkola@gmail.com>",
      description: "asdfasdfasdfasdfasd",
      keywords: ["architecture", "art", "asia"]
    },
    tags: ["architecture", "art", "asia"],
    title: "a"
  }]);
}

if (!db.keywords.findOne()) {
  "animals architecture art asia australia autumn bike birds birthday canada car cat china christmas church city clouds concert dog england europe family fashion festival film flowers food football france fun garden germany halloween hawaii holiday house india island italy japan kids lake landscape love mexico museum music nature night ocean party people photo river sea sky snow spain spring summer sun taiwan thailand travel usa vacation winter".split(' ').forEach(function(k){ db.keywords.save({_id: k}); });
}

if (!db.categories.findOne()) {
  db.categories.insert([{
    clear_url: "it",
    name: "Computers",
    description: "Computer/Internet security, security articles category.",
    seo_options: {
      author: "Nick Herman <gerkola@gmail.com>",
      description: "Computer/Internet security, security articles category.",
      keywords: ["usa", "taiwan", "china", "canada"]
    }
  }, {
    clear_url: "animals",
    name: "Animals",
    description: "Animals articles category.",
    seo_options: {
      author: "Nick Herman <gerkola@gmail.com>",
      description: "Animals articles category.",
      keywords: ["animals", "cat", "dog", "food"]
    }
  }]);
}

if (!db.groups.findOne()) {
  db.groups.insert([{
    cleat_url: 'it',
    description: 'IT bloggers group',
    seo_options: {
      author: "Nick Herman <gerkola@gmail.com>",
      description: "Computer/Internet security, security articles group.",
      keywords: ["usa", "taiwan", "china", "canada"]
    },
    title: 'IT'
  }]);

  var id = db.groups.findOne()['_id'];
  db.users.update({}, {$addToSet: {groups: id}}, {multi: true});
  db.groupcomments.insert([{
    comment: {
      author: "ok",
      comment: "-------------------------",
      comments: [{
        author: "ok2",
        comment: "+++++++++++++++++++++++",
        created_at: ISODate("2013-12-06T14:59:57.591Z")
      }],
      created_at: ISODate("2013-12-06T01:36:40.333Z")
    },
    group: id
  }]);
}
