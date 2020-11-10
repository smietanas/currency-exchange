//current date
var today = new Date();
var weekday = [0,1,2,3,4,5,6]
var now = today.getDay()

var result = {
  start : '',
  end : ''
}

//day difference
var countDays = function(now) {
  
  if(now===0)
  return 13
  else return now+6
}
var diff = countDays(now);

//Expected last Monday
var getExpectedDay = function(diff){
  
  var expectedDay = new Date().setDate(today.getDate()-diff);
  return new Date(expectedDay)
}
var monday = getExpectedDay(diff);

//convert date to api format yyyy-mm-dd
var convertDate = function (date){
  day = [
    date.getFullYear(),
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2)
  ].join('-');
  
return day
}

//set start and end date for exchange rate
var setStartEnd = function(today,monday){
result.start = convertDate(monday)
result.end = convertDate(today)
}

setStartEnd(today,monday)

var urlPln = 'https://api.exchangeratesapi.io/latest?base=PLN';
var urlRateByDays = 
"https://api.exchangeratesapi.io/history?start_at="+result.start+"&end_at="+result.end+"&base=PLN"

var getCurrencyData = function() {
  fetch(urlPln)
  .then(response => response.json())
  .then(function(data){

    for (var rt in data.rates) {
      elem = rt+" : "+data.rates[rt].toFixed(2);
      var li = document.createElement('li');
      li.classList.add("list-group-item","link-container");
      var a = document.createElement('a')
      a.classList.add("link");
      a.innerHTML = elem;
      a.setAttribute('data-key', rt);
      a.addEventListener('click', function(event){
      var curr = event.currentTarget.dataset.key;
      renderByDays(curr)
    })     
      li.appendChild(a);
      document.querySelector('.kw').appendChild(li);
    }
}).catch(function(err){
console.log(err);

})
}

getCurrencyData();

var renderByDays = function(curr) {
  var ul = document.querySelector('.kd');
  ul.textContent = '';
  fetch(urlRateByDays+"&symbols="+curr)
  .then(response => response.json())
  .then(function(data){

  var sortedList = Object.keys(data.rates).sort(function(a,b) {
    return a > b;
  });
  
  sortedList.forEach(function(elem) {
    var resultCurr = elem+" [-->] " + data.rates[elem][curr].toFixed(2);
    var li = document.createElement('li');
    li.classList.add("list-group-item","link-container");
    var a = document.createElement('a')
    a.innerHTML = resultCurr;
    li.appendChild(a);
    document.querySelector('.kd').appendChild(li);
  });
}).catch(function(err){
  console.log(err);
  
  })
}