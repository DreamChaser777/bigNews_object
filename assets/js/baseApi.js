// 每次调用ajax都会调用ajaxPrefilter这个函数

$.ajaxPrefilter(function (options) {
  options.url = "http://www.liulongbin.top:3007" + options.url;

  // console.log(options.url)

  // 添加token
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = { Authorization: localStorage.getItem("token") || "" };
  }

  // 提升到全局，校验
  options.complete = function(res){
    console.log(res);
      // 可以使用 ：responseJSON: {status: 1, message: '身份认证失败！'} 校验是否信息获取成功
      if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        // 强制清空token
        localStorage.removeItem('token')
        // 强制转条到登陆页面
        location.href = '/login.html'
      }
  }
});
