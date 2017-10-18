//定义全局变量
//var serverPath = "http://localhost:8080/"
//var serverPath = "https://www.artapp.cn/"
var serverPath = "http://test.artapp.cn:9999/"
var  path = "ArtAppInst2/"
var url = "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/"

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//转换日期格式
function translateTime(now) {
  var time = new Date(now)
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  return year + "-" + month + "-" + date;
} 

//转换日期格式
function translateTime2(now) {
    var time = new Date(now)
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    return month + "-" + date;
} 

'use strict';

/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 */
function formatDate(source, format) {
  var o = {
    'M+': source.getMonth() + 1, // 月份
    'd+': source.getDate(), // 日
    'H+': source.getHours(), // 小时
    'm+': source.getMinutes(), // 分
    's+': source.getSeconds(), // 秒
    'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
    'f+': source.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
// function disableButton(num) {
//     if (num > 0) {
//         $(".code").text("请" + num + "秒后重试");
//         $('.code').css("background", "#ccc");
//         num--;
//         setTimeout("disableButton(" + num + ")", 1000);
//     } else {
//         $('.code').text("获取验证码");
//         $('.code').css("background", "#f44a33");
//     }
//     return disableButton();
// }
module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  translateTime: translateTime,
  translateTime2: translateTime2,
  formatDate: formatDate,
  mergeDeep: mergeDeep,
  serverPath: serverPath,
  path: path,
  url: url,
  //disableButton: disableButton
}
