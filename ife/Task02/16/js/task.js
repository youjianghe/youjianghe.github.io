
//验证
window.onload = function(){
	 var city = document.getElementById('aqi-city-input');
	 var index = document.getElementById('aqi-value-input');
	 var span = document.getElementsByTagName('span');
	 var addbtn = document.getElementById('add-btn');
	 var aqitable = document.getElementById('aqi-table');
	 var btn = aqitable.getElementsByTagName('button');
	 var aqitable = document.getElementById('aqi-table');

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {}; //{}对象，[]数组

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	re = /[ ]{1,}/ //正则的开始结束标签到底要还是不要？？？/^ $/
	aqiData[city.value.toString().replace(re,"")] = index.value.replace(re,"");
	return aqiData;
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  	var target = event.target;
  	if (target.tagName.toUpperCase() == 'BUTTON') {
  		var city = target.parentNode.previousSibling.previousSibling.innerText.toString();
  		//事件代理event.target(注意ie和其他浏览器的区别，参考文章有说明)获取被点击的dom，参考阅读：http://www.cnblogs.com/silence516/archive/2009/09/03/delegateEvent.html
  		//parentNode 获取当前元素父节点，previousSibling获取当前节点上一个同级节点，没有则返回null
  		delete aqiData[city]
  		renderAqiList();
  	}
}
/**
 * 渲染aqi-table表格
 */

function renderAqiList() {
	var html = "";
	for(var a in aqiData ){
		html+='<tr>'+'<td>'+a+'</td>'+'<td>'+aqiData[a]+'</td>'+'<td>'+"<button>"+'删除'+'</button>'+'</td>'+'</tr>';
	}
	aqitable.innerHTML = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>'+html;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}




function init() {
  //验证输入内容
	var regCity = /^[\u4E00-\u9FA5,a-z,A-Z,\s]{1,}$/;//也可写 /^[\u4E00-\u9FA5a-zA-Z]{1,}$/
	var regIndex = /^[0-9\s]+$/;
	city.onblur = function(){console.log(reg(regCity,city,0))}
	index.onblur = function(){console.log(reg(regIndex,index,1))}
	
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
 	addbtn.onclick = function(){
		var k = reg(regCity,city,0)
		var j = reg(regIndex,index,1)
		if (k&&j) {addBtnHandle();}
  	}

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  aqitable.onclick = function(event){delBtnHandle()}
}
init();


//输入错误提示
function reg(reg,arg,num){
	var flag = true;
	switch (num){
		case 0:
			if (arg.value.match(reg)) {
				span[0].innerText="";
				flag = true;
			}else{
				span[0].innerText="输入错误，请使用汉字或字母";
				flag = false;
			}
		break;
			case 1:
			if (arg.value.match(reg)) {
				span[1].innerText="";
				flag = true;
			}else{
				span[1].innerText="输入错误，只能输入数字";
				flag = false;
			}
		break;
	}
	return flag;
}


}//onload 结束