const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const diffTime = function(startDate, endDate) {
  var diff = endDate - startDate; //时间差的毫秒数  

  //计算出相差天数  
  var days = Math.floor(diff / (24 * 3600 * 1000));

  //计算出小时数  
  var leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数  
  var hours = Math.floor(leave1 / (3600 * 1000));
  hours = hours > 9 ? hours : `0${hours}`;
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000));
  minutes = minutes > 9 ? minutes : `0${minutes}`;
  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${hours}:${minutes}:${seconds}`
  // var returnStr = seconds + "秒";
  // if (minutes > 0) {
  //   returnStr = minutes + "分" + returnStr;
  // }
  // if (hours > 0) {
  //   returnStr = hours + "小时" + returnStr;
  // }
  // if (days > 0) {
  //   returnStr = days + "天" + returnStr;
  // }
  // return returnStr;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const modal = (obj) => {
  return new Promise(function(resolve, reject) {
    wx.showModal({
      title: obj.title||'',
      content: obj.content||'',
      success(res) {
        if (res.confirm) {
          resolve('成功')
        } else if (res.cancel) {
          reject('取消')
        }
      }
    })
  })
}
const toast = (obj) => {
  wx.showToast({
    title: obj.title,
    icon: obj.icon || 'none',
    duration: obj.time || 2000
  })
}
const cutShift = (obj) => {
  let str = '';
  for (let i in obj) {
    if (i && i != 'path') {
      str += `${i}=${obj[i]}&`
    }
  }
  str = str.slice(0, -1)
  return str;
}

const base64_encode = (str) => { // 编码，配合encodeURIComponent使用
  console.log(str)
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0,
    len = str.length,
    strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}

const base64_decode = (input) => { // 解码，配合decodeURIComponent使用
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  return utf8_decode(output);
}

function utf8_decode(utftext) { // utf-8解码
  var string = '';
  let i = 0;
  let c = 0;
  let c1 = 0;
  let c2 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c1 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      i += 2;
    } else {
      c1 = utftext.charCodeAt(i + 1);
      c2 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      i += 3;
    }
  }
  return string;
}
module.exports = {
  formatTime: formatTime,
  toast: toast,
  modal: modal,
  cutShift: cutShift,
  base64_encode,
  base64_decode,
  diffTime
}