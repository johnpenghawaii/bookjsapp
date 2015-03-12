var router = require('express').Router();

router.route('/')
  .get(function(req, res) {
    res.report('OK', {'users': [req.user.toJObj()]});
  });

module.exports = router;