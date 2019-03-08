(function($){
  $(function(){

    $('.sidenav').sidenav()

    Chart.defaults.global.defaultFontColor = "#fff"
    let options_match_alerts = {
      responsive:true,
      legend: { display:false
              },
      scales: {
          xAxes: [{
              gridLines: {
                  display:false
              }
          }],
          yAxes: [{
              gridLines: {
                  display:false
              }
          }]
      }
    }
    let ctx = document.getElementById("chart");
    chart = new Chart(ctx, {
        type: 'line',
        options: options_match_alerts,
        data: {
          datasets: [{
              data: [],
              label: "default",
              borderColor:"#ef9a9a" ,
              backgroundColor:"#ffcdd2"
          }],
          labels: [
          ]
        }

    })
    chart.count = 0
    chart.dataQty = 0
    chart.dataLength = 50


  }); // end of document ready
 
})(jQuery); // end of jQuery name space
