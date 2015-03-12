var router = require('express').Router();

router.route('/').get(function(req, res) {
    res.end('{"restaurant": "all"}');
  });

router.route('/:id').get(function(req, res) {
    res.end('{"restaurant": "' + req.params.id +'"}');
  });

module.exports = router;
