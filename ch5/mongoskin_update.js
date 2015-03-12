var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/node_test');

db.bind('contacts');

db.contacts.findOne({name: 'Jack'}, function(err, contact) {
  if (!err) {
    contact.email = 'jack3@bef.com';
    db.contacts.save(contact, function(err, result) {
      if (err) console.log(err);
      if (!err) console.log(result);
      db.close();
    });
  } else {
    db.close();
  }
});
