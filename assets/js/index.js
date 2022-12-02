$(function () {
  getUserInfo();

  let layer = layui.layer;

  $("#btnLogout").on("click", function () {
    // 提示是否确认退出
    layer.confirm(
      "确定退出登陆?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        // 1.清空 ‘token’
        localStorage.removeItem("token");
        // 2.跳转到登陆页面
        location.href = "/login.html";
        // 关闭提示框
        layer.close(index);
      }
    );
  });
});

function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // 请求头 headers
    // headers:  {
    //   Authorization:localStorage.getItem('token') || ''
    // },
    success: function (res) {
      console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      // 成功获取
      // 进行渲染头像
      readerAvatar(res.data);
    },
    // 不管回调函数结果是否成功还是失败最终都会调用 complete 回调函数
    // complete: function (res) {
    //   console.log(res);
    //   // 可以使用 ：responseJSON: {status: 1, message: '身份认证失败！'} 校验是否信息获取成功
    //   if(res.responseJSON.status === 1 && res.responseJSON.status === '身份认证失败！'){
    //     // 强制清空token
    //     localStorage.removeItem('token')
    //     // 强制转条到登陆页面
    //     location.href = '/index.html'
    //   }


    // },
  });
}

function readerAvatar(user) {
  // 获取用户名称
  let username = user.nickname || user.username;
  // 设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + username);
  // 设置头像
  if (user.user_pic !== null) {
    // 有头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    // 隐藏文本头像
    $(".text-avatar").hide();
  } else {
    // 文字头像
    // 隐藏图片头像
    $(".layui-nav-img").hide();
    // 获取名字第一个字符
    let first = username[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
