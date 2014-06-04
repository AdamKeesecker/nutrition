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
    var user = this.userId;
    users.findByUserId(user, (e,u)=>{
      u.intake = foodData.intake;
      u.stats = foodData.stats;
      u.save(user);
    });
  }

  save(fn){
    if(this._id){
      saveUser(this);
    }else{
      User.findByEmail(this.email, user=>{
        if(user){
          fn(null);
        }else{
          saveUser(this);
        }
      });
    }




}

module.exports = User;
