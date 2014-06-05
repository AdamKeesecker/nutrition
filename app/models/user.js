var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User{
  static register(obj, fn){
    users.findOne({email:obj.email}, (e,u)=>{
      if(u){
        fn(null);
      }else{
        var user = new User();
        user.email = obj.email;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.intake = [];
        user.stats = {};
        users.save(user, ()=>fn(user));
      }
    });
  }

  static login(obj, fn){
    users.findOne({email:obj.email}, (e,u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          fn(u);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }


  static findByUserId(id, func){
    if(typeof id === 'string'){
      if(id.length !== 24){func(null); return;}
      id = Mongo.ObjectID(id);
    }
    users.findOne({_id: id}, (error, result)=>{
      result = _.create(User.prototype, result);
      func(result);
    });
  }

  updateIntake(foodData, fn){
    console.log(foodData);
    this.intake.push(foodData);
    users.save(this, ()=>fn(this));
  }

  updateStats(user, fn){
    var totalCals = 0;
    var totalChol = 0;
    var totalFiber = 0;
    var totalProtein = 0;
    var totalSodium = 0;
    var totalSugar = 0;
    var totalCarbs = 0;
    var totalFat = 0;

    for(var i=0; i<user.intake.length; i++){
      totalCals += user.intake[i].calories * 1;
      totalChol += user.intake[i].cholesterol * 1;
      totalFiber += user.intake[i].fiber * 1;
      totalProtein += user.intake[i].protein * 1;
      totalSodium += user.intake[i].sodium * 1;
      totalSugar += user.intake[i].sugar * 1;
      totalCarbs += user.intake[i].carbs * 1;
      totalFat += user.intake[i].fat * 1;

      user.stats.totalCals = parseInt(totalCals);
      user.stats.totalChol = parseInt(totalChol);
      user.stats.totalFiber = parseInt(totalFiber);
      user.stats.totalProtein = parseInt(totalProtein);
      user.stats.totalSodium = parseInt(totalSodium);
      user.stats.totalSugar = parseInt(totalSugar);
      user.stats.totalCarbs = parseInt(totalCarbs);
      user.stats.totalFat = parseInt(totalFat);
    }

    users.save(this, ()=>fn(this));
  }




}

module.exports = User;
