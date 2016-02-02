var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log('__dirname:',__dirname);
  //res.render('index', { title: 'Express' });
  //res.sendfile('/views/main.html')
  res.sendFile('main.html', {root: 'C:\\Users\\Benr\\WebstormProjects\\BeatMe\\public\\views' })
  //res.send('Hello World!');
});

module.exports = router;
