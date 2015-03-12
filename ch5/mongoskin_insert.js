var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/node_test');

var jack = {
   name: "Jack",
   email: "jack@bef.com",
   age: 16,
   phone_number: {"mobile":["656-2222"]}
};

db.bind('contacts');
db.contacts.insert(jack, function(err, result) {
  if (err) console.log(err);
  else console.log(result); // 傳回新增的資料
  db.close();
});
