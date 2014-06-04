(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#search').click(search);
  }

  function search(){
    var phrase = $('#foodInput').val();
    getFoods(phrase);
  }

  function getFoods(phrase){
    var url = 'https://api.nutritionix.com/v1_1/search/'+phrase+'?results=0:20&fields=item_name,brand_name,item_id,nf_calories,nf_sodium,nf_cholesterol&appId=150e4141&appKey=a051faca05aa7496587241ed5d5399b2';

    $.getJSON(url, data=>{
      // $('#charts').prepend(`<div class="chartdiv" data-place=${place}>`);
      // generateChart(place);
      // //populateChart(data);
      // data.forecast.simpleforecast.forecastday.forEach(f=>chart[place].dataProvider.push({day: f.date.weekday,lowtemp: f.low.fahrenheit,hightemp: f.high.fahrenheit}));
      // $('.chartdiv[data-place="'+place+'"]').prepend(`<h2>${name}</h2>`);
      // chart[place].validateData();
      $('#results').empty().append(data);
    });
  }

})();
