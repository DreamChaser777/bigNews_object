$(function () {
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  // 自定义校验
  // 利用layui提供的form.verify(）方法
  const form = layui.form;
  const layer = layui.layer;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repwd: function (value) {
      let pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次输入的密码不一致！";
      }
    },
  });

  // 监听注册表单提交事件
  $("#form_reg").on("submit", function (e) {
    // 阻止默认行为
    e.preventDefault();
    $.post(
      "/api/reguser",
      {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      function (res) {
        if (res.status !== 0) {
          return layer.msg(`注册失败！${res.message}`);
        }
        layer.msg("注册成功！请登录");
        // 成功后跳转到登陆页面
        $("#link_login").click();
      }
    );
  });

  // 登陆表单的提交事件
  $("#form_login").submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      // serialize()快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          // 登陆失败
          return layer.msg(`登陆失败！${res.message}`);
        }
        // 登陆成功
        layer.msg("登陆成功！");
        // 登陆成功后拿到服务器返回的token值，存储到本地存储中
        localStorage.setItem("token", res.token);

        // 跳转到index首页
        location.href = "/index.html";
      },
    });
  });
});
