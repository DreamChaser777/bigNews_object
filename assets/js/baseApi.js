// 每次调用ajax都会调用ajaxPrefilter这个函数

$.ajaxPrefilter(function(options){
  options.url = 'http://www.liulongbin.top:3007' + options.url

  // console.log(options.url)
})