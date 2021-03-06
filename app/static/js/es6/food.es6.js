/* jshint camelcase:false, unused:false */
/* global ajax, _, AmCharts */
/*jshint -W019 */


(function(){
  'use strict';

  $(document).ready(init);

  var foodObject;

  function init(){
    $('#search').click(search);
    $('body').on('click', '.food-result', selectFoodObject);
    $('body').on('click', '.eaten', showEatenDetails);
    $('body').on('click', '.close-deets', closeDeets);
    $('#submit-food').click(submitFood);
    //initChart();
  }

  // function initChart(){
  //   submitFood();
  //   makeChart();
  // }

  function search(){
    var phrase = $('#foodInput').val();
    getFoods(phrase);
  }

  function selectFoodObject(){
    $(this).addClass('result-selected');

    foodObject = {};
    foodObject.name = $(this).find('.name').text();
    foodObject.cholesterol = $(this).find('.cholesterol').text() * 1 || 0;
    foodObject.fiber = $(this).find('.fiber').text() * 1 || 0;
    foodObject.protein = $(this).find('.protein').text() * 1 || 0;
    foodObject.sodium = $(this).find('.sodium').text() * 1 / 100  || 0;
    foodObject.sugar = $(this).find('.sugar').text() * 1 || 0;
    foodObject.carbs = $(this).find('.carbs').text() * 1 || 0;
    foodObject.fat = $(this).find('.fat').text() * 1 || 0;
  //  foodObject.calories = $(this).find('.calories').text() * 1 / 1000 || 0;

    var keys = Object.keys(foodObject);

  }

  var userObject;
  function submitFood(){
    var userId = $('#user').attr('data-id');
    console.log(userId);

    ajax(`/${userId}/addFood`, 'post', foodObject, obj=>{

      userObject = obj.user;
      console.log(userObject);

      var standardsObject = {};
    //  standardsObject.calories = 2000;
      standardsObject.cholesterol = 300;
      standardsObject.fiber = 25;
      standardsObject.protein = 50;
      standardsObject.sodium = 24;
      standardsObject.sugar = 25;
      standardsObject.carbohydrates = 300;
      standardsObject.fat = 65;

      var standardKeys = Object.keys(standardsObject);
      var userKeys = Object.keys(userObject.stats);

      console.log(standardKeys);
      console.log(userKeys);

      $('.md-close').trigger('click');
      $('#graph').empty();
      $('#foodInput').empty();
      $('#results').empty();

      makeChart();

      for(var i = 0; i < standardKeys.length; i++){
        var graphObj = {};
        graphObj.nutritionCategory = standardKeys[i];
        graphObj.userStat = userObject.stats[`${userKeys[i]}`];
        graphObj.standardStat = standardsObject[`${standardKeys[i]}`];
        graph.dataProvider.push(graphObj);
      }

      graph.validateData();

      //var htmlz = `<h2>${userObject.intake[j].name}</h2>`;
      $('#foods').empty();

      for(var j = 0; j < userObject.intake.length; j++){
        var htmlz =  `<a data-modal=modal-${j} class="md-trigger eaten">${userObject.intake[j].name}</a>
                      <div id=modal-${j} class="hidden deets">
                        <div class="md-content">
                          <h3>${userObject.intake[j].name}</h3>
                          <p>Fat: ${userObject.intake[j].fat}</p>
                          <p>Cholesterol: ${userObject.intake[j].cholesterol}</p>
                          <p>Fiber: ${userObject.intake[j].fiber}</p>
                          <p>Protein: ${userObject.intake[j].protein}</p>
                          <p>Sodium: ${userObject.intake[j].sodium}</p>
                          <p>Sugar: ${userObject.intake[j].sugar}</p>
                          <p>Carbohydrates: ${userObject.intake[j].carbs}</p>
                          <button class="close-deets">Close Window</button>
                        </div>
                      </div>`;
        $('#foods').prepend(htmlz);
      }
      //location.reload();

    }, 'json');
  }

  function showEatenDetails(){
    $(this).next().fadeIn();
  }

  function closeDeets(){
    $(this).parent().fadeOut();
  }

  function getFoods(phrase){
    var url = 'https://api.nutritionix.com/v1_1/search/'+phrase+'?results=0:20&fields=item_name,brand_name,item_id,nf_calories,nf_sodium,nf_cholesterol,nf_total_fat,nf_total_carbohydrate,nf_dietary_fiber,nf_sugars,nf_protein&appId=150e4141&appKey=a051faca05aa7496587241ed5d5399b2';
    $.getJSON(url, data=>{
      for(var i =0; i<data.hits.length; i++){
        var listItem = `<div class='food-result' data-id=${i}>
                          <h4 class='brand'>${data.hits[i].fields.brand_name}</h3>
                          <p class='name'>${data.hits[i].fields.item_name}</p>
                          <p class='calories hidden'>${data.hits[i].fields.nf_calories}</p>
                          <p class='cholesterol hidden'>${data.hits[i].fields.nf_cholesterol}</p>
                          <p class='fiber hidden'>${data.hits[i].fields.nf_dietary_fiber}</p>
                          <p class='protein hidden'>${data.hits[i].fields.nf_protein}</p>
                          <p class='sodium hidden'>${data.hits[i].fields.nf_sodium}</p>
                          <p class='sugar hidden'>${data.hits[i].fields.nf_sugars}</p>
                          <p class='carbs hidden'>${data.hits[i].fields.nf_total_carbohydrate}</p>
                          <p class='fat hidden'>${data.hits[i].fields.nf_total_fat}</p>
                        </div>`;
        $('#results').append(listItem);
      }
    });
  }

  var graph;

  function makeChart(){

    graph = AmCharts.makeChart('graph', {
        'theme': 'light',
        'type': 'serial',
        'dataProvider': [
        // {
        //     'nutritionCategory': 'Sodium(g)',
        //     'userStat': 24,
        //     'standardStat': 0
        // }, {
        //     'nutritionCategory': 'Protein(g)',
        //     'userStat': 50,
        //     'standardStat': 0
        // }, {
        //     'nutritionCategory': 'Fat(g)',
        //     'userStat': 65,
        //     'standardStat': 0
        // }, {
        //     'nutritionCategory': 'Sugar(g)',
        //     'userStat': 25,
        //     'standardStat': 0
        // }, {
        //     'nutritionCategory': 'Cholesterol(mg)',
        //     'userStat': 300,
        //     'standardStat': 0
        // }, {
        //     'nutritionCategory': 'Fiber(g)',
        //     'userStat': 25,
        //     'standardStat': 0
        // },{
        //     'nutritionCategory': 'Carbs(g)',
        //     'userStat': 300,
        //     'standardStat': 0
        // }
        ],
        'valueAxes': [{
            // 'unit': '%',
            'position': 'left',
            'title': 'Nutritions',
        }],
        'startDuration': 1,
        'graphs': [{
            'balloonText': 'Recommended: [[category]]: <b>[[value]]</b>',
            'fillAlphas': 0.9,
            'lineAlpha': 0.2,
            'title': 'Recommended Intake',
            'type': 'column',
            'valueField': 'standardStat'
        }, {
            'balloonText': 'Your [[category]] today: <b>[[value]]</b>',
            'fillAlphas': 0.9,
            'lineAlpha': 0.2,
            'title': 'Your Intake',
            'type': 'column',
            'clustered':false,
            'columnWidth':0.5,
            'valueField': 'userStat'
        }],
        'plotAreaFillAlphas': 0.1,
        'categoryField': 'nutritionCategory',
        'categoryAxis': {
            'gridPosition': 'start'
        }
    });

  }

})();
