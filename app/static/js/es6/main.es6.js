/* exported ajax */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    //alert('loaded');
    $('#form-register').hide();
    $('#btn-register').click(showRegister);
    $('#btn-login').click(showLogin);
  }

  function showRegister(){
    $('#btn-register').addClass('btn-selected');
    $('#btn-login').removeClass('btn-selected');
    $('#form-login').hide();
    $('#form-register').slideToggle();
  }

  function showLogin(){
    $('#btn-login').addClass('btn-selected');
    $('#btn-register').removeClass('btn-selected');
    $('#form-register').hide();
    $('#form-login').slideToggle();
  }


})();
function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}
