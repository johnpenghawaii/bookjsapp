var model = require('./model');
var User = model.User;

User.createHash(process.argv[3], function(err, hash) {
    var user = new User({'email': process.argv[2],
                     'password': hash,
                     'name': process.argv[4],
                     'gender': process.argv[5],
                     'dob': process.argv[6]});

    user.save(function(err, result) {
      if (!err)
        console.log('user generated');
      else {
        console.error('error');
      }
      process.exit(1);
    });
});
