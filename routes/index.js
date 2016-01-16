var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('__dirname:',__dirname);
  //res.render('index', { title: 'Express' });
  //res.sendfile('/views/main.html')
  res.sendfile('main.html', {root: 'c:\\Users\\Shai\\WebstormProjects\\BeatMe\\public\\views' })
  //res.send('Hello World!');
});

module.exports = router;
