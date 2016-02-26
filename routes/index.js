var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log('__dirname:',__dirname);
  //res.render('index', { title: 'Express' });
  //res.sendfile('/views/main.html')
  res.sendFile('main.html', {root: 'c:\\Users\\MS\\WebstormProjects\\BeatMe\\public\\views' });
 //   res.sendFile('main.html', {root: '/webapps/BeatMe/public/views' });
  //res.send('Hello World!');
});

router.get('/getName', function(req, res, next) {
    //console.log('__dirname:',__dirname);
    //res.render('index', { title: 'Express' });
    //res.sendfile('/views/main.html')
    //res.sendFile('main.html', {root: 'c:\\Users\\Sport-Zone\\wsProjects\\BeatMe\\public\\views' })
    res.send('[shai,martha,bu]');
});

router.post('/doLogin', function(req, res, next) {
    //console.log('__dirname:',__dirname);
    //res.render('index', { title: 'Express' });
    //res.sendfile('/views/main.html')
   // res.sendFile('main.html', {root: 'c:\\Users\\Sport-Zone\\wsProjects\\BeatMe\\public\\views' })
    res.send('approved user!');
});

module.exports = router;
