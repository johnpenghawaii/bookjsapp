var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/node_test');

db.bind('contacts');

db.contacts.remove({name: 'George'}, function(err, result) {
  if (err) console.log(err);
  else console.log(result); // result 是刪除資料筆數
  db.close();
});
