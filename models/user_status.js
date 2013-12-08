var mongoose = require('mongoose')
,   Schema = mongoose.Schema;

var UserStatusSchema = new Schema({
  status: {type: String},
  user: {type: Schema.ObjectId, ref: 'User'},
  created_at: {type: Date, default: Date.now, index: true}
});

UserStatusSchema.index({user_id: 1, created_at: 1});
