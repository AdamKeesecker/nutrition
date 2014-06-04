/* jshint camelcase:false, unused:false */
/* global ajax */


(function(){
  'use strict';

  $(document).ready(init);

  var foodObject;

  function init(){
    $('#search').click(search);
    $('body').on('click', '.food-result', selectFoodObject);
    $('#submit-food').click(submitFood);
  }

  function search(){
    var phrase = $('#foodInput').val();
    getFoods(phrase);
  }

  function selectFoodObject(){
    foodObject = {};
    foodObject.name = $(this).find('.name').text();
    foodObject.cholesterol = $(this).find('.cholesterol').text() * 1;
    foodObject.fiber = $(this).find('.fiber').text() * 1;
    foodObject.protein = $(this).find('.protein').text() * 1;
    foodObject.sodium = $(this).find('.sodium').text() * 1;
    foodObject.sugar = $(this).find('.sugar').text() * 1;
    foodObject.carbs = $(this).find('.carbs').text() * 1;
    foodObject.fat = $(this).find('.fat').text() * 1;
  }

  function submitFood(){
    var userId = $('#user').attr('data-id');
    ajax(`/${userId}/addFood`, 'post', foodObject, html=>{
      console.log(html);
    });
  }

  function getFoods(phrase){
    var url = 'https://api.nutritionix.com/v1_1/search/'+phrase+'?results=0:20&fields=item_name,brand_name,item_id,nf_calories,nf_sodium,nf_cholesterol,nf_total_fat,nf_total_carbohydrate,nf_dietary_fiber,nf_sugars,nf_protein&appId=150e4141&appKey=a051faca05aa7496587241ed5d5399b2';
    $.getJSON(url, data=>{
      console.log(data.hits);
      for(var i =0; i<data.hits.length; i++){
        var listItem = `<div class='food-result' data-id=${i}>
                          <h3 class='brand'>${data.hits[i].fields.brand_name}</h3>
                          <p class='name'>${data.hits[i].fields.item_name}</p>
                          <p class='cholesterol hidden'>${data.hits[i].fields.nf_cholesterol}</p>
                          <p class='fiber hidden'>${data.hits[i].fields.nf_dietary_fiber}</p>
                          <p class='protein hidden'>${data.hits[i].fields.nf_protein}</p>
                          <p class='sodium hidden'>${data.hits[i].fields.nf_sodium}</p>
                          <p class='sugar hidden'>${data.hits[i].fields.nf_sugars}</p>
                          <p class='carbs hidden'>${data.hits[i].fields.nf_total_carbohydrate}</p>
                          <p class='fat hidden'>${data.hits[i].fields.nf_total_fat}</p>
                          <hr>
                        </div>`;
        $('#results').append(listItem);
      }
    });
  }

})();
