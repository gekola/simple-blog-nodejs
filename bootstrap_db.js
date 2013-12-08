if (!db.users.findOne()) {
  db.users.save({ "first_name" : "ok", "last_name" : "ok", "email" : "asdf@1.a", "username" : "ok2", "password" : "$2a$04$v0hUh4dek2Dho2CQ/jaSze4qjvMG5BQ/UYkChRkTU9Gts7/Tw7MRW", "created_at" : ISODate("2013-12-04T21:49:17.871Z"), "__v" : 0, "role": "author" });
  db.users.save({ "__v" : 0, "created_at" : ISODate("2013-11-30T22:15:33.967Z"), "email" : "ok@affdsf.vvvv", "first_name" : "Nick", "last_name" : "Herman", "password" : "$2a$04$uRivXHqY9bk7sdgpZrL71.krLLaNaX7qAczNFvPZnN189ZH8VmveC", "username" : "ok", "role" : "admin" });
}

if (!db.keywords.findOne()) {
  "animals architecture art asia australia autumn bike birds birthday canada car cat china christmas church city clouds concert dog england europe family fashion festival film flowers food football france fun garden germany halloween hawaii holiday house india island italy japan kids lake landscape love mexico museum music nature night ocean party people photo river sea sky snow spain spring summer sun taiwan thailand travel usa vacation winter".split(' ').forEach(function(k){ db.keywords.save({_id: k}) });
}

