'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');



  app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.get('/users/search', dbg, users.search);

  // app.get('/users/dashboard', dbg, users.dashboard);
  // app.get('/users/foodStats', dbg, users.foodStats);
  // app.get('/users/showFood/:id', dbg, users.show);

  app.post('/register', dbg, users.register);
  app.post('/login', dbg, users.login);

  app.post('/:id/addFood', dbg, users.update);

  app.post('/:userId/addFood', dbg, users.update);


  console.log('Routes Loaded');
  fn();
}
