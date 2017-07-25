/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
window.onload = function(){
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  'nowSelectCity':'北京',
  'nowGraTime': "day"
}

var citySelect = document.getElementById('city-select');
var formGraTime = document.getElementById('form-gra-time');
var wrap = document.getElementById('wrap');
var cityName = {};//选择的城市
/**
 * 渲染图表
 */
function renderChart() {
  initAqiChartData();
  var time,html = '';
  for(time in chartData){
     html += '<div class="'+time+'"style="background-color:#'+parseInt(Math.random()*1000000)+';height:'+chartData[time]+'px;"></div>';
  }  //每次点击颜色都会变啊
  wrap.innerHTML = html;
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(val) {
  // 确定是否选项发生了变化 
   if(val == pageState.nowGraTime) return;
  // 设置对应数据
  pageState.nowGraTime = val;
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(value) {
  // 确定是否选项发生了变化 
    //通过change事件直接排除了？？？
  // 设置对应数据
    pageState.nowSelectCity = value;
  // 调用图表渲染函数
   renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var form = document.getElementById('form-gra-time');
  form.addEventListener('click',function(e){ 
    if (e.target.tagName == 'INPUT') {
    //在这里判断原因：点击label后会再执行一次点击input事件，去重；另注意判断条件的大小写
         var val = e.target.value;
         graTimeChange(val);
    }
  },false);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var name,html="";
    for(name in aqiSourceData){
      cityName[name] = name;
      html += '<option>'+name+'</option>';
    }
    citySelect.innerHTML = html;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelect.addEventListener('change',function(e){
        citySelectChange(e.target.value);
    });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
   var time = pageState.nowGraTime;
   var address = pageState.nowSelectCity;
   switch (time){
      case 'day':
          chartData = {};
          chartData = aqiSourceData[address]; 
      break;
      case 'week':
          chartData = {};
         //通过判断星期几来实现每周数据，就可以规避长度问题
         var key,day,week=0,dayData=0,countday=0;
         for(key in aqiSourceData[address]){
           day =new Date(key).getDay();//获取星期几
           dayData+=aqiSourceData[address][key];//天降雨量
           countday++;//计算天数，被除数除数
           if (day == 6) {
              week++;//第几周
              chartData['第'+week+'周'] = Math.floor(dayData/countday);
              dayData = 0; countday=0;
           }
         }
          if(countday!=0){//上面循环完后，未满一周的数据在这里加入
              week++;
              chartData['第'+week+'周'] = Math.floor(dayData/countday);
           }
      break;
      case 'month':
          //计算月降雨量思路与星期相同
         chartData = {};
         var key,month=0,dayData=0,countday=0;
         for(key in aqiSourceData[address]){
            countday++;
            if(new Date(key).getMonth()!=month){
              month++;
              dayData = 0;
              countday = 0;
            }
            dayData+=aqiSourceData[address][key];
            chartData['第'+month+'月'] = Math.floor(dayData/countday);
         }

      break;
   }//switch结束标签
   
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}
init();
}


