const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function formatLocal(inputTime) {
  if (!inputTime && typeof inputTime !== 'number') {
    return '';
  }
  var localTime = '';
  inputTime = new Date(inputTime).getTime();
  const offset = (new Date()).getTimezoneOffset();
  localTime = (new Date(inputTime)).toISOString();
  localTime = localTime.substr(0, localTime.lastIndexOf('.'));
  localTime = localTime.replace('T', ' ');
  return localTime;
}


function formatMoney(number, places, thousand, decimal) {
  number = number || 0;
  //保留的小位数 可以写成 formatMoney(542986,3) 后面的是保留的小位数，否则默 认保留两位
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  //symbol表示前面表示的标志是￥ 可以写成 formatMoney(542986,2,"$")
  // symbol = symbol !== undefined ? symbol : "￥";
  //thousand表示每几位用,隔开,是货币标识
  thousand = thousand || ",";
  //decimal表示小数点
  decimal = decimal || ".";
  //negative表示如果钱是负数有就显示“-”如果不是负数 就不显示负号
  //i表示处理过的纯数字
  var negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "￥1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}


module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatLocal: formatLocal,
  formatMoney: formatMoney
}
