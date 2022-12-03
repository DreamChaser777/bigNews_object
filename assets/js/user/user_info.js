$(function () {
  let form = layui.form;

  let layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称必须在1 - 6 个字符之间";
      }
    },
  });
  initUserInfo();
  // 初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          layer.meg("获取用户信息失败！");
        }
        // console.log(res)
        // 使用form.val进行给表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  }
  // 重置表单的数据
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  $(".layui-form").on("submit", function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 发起请求
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改用户信息失败！");
        }
        layer.msg("更新用户信息成功！");

        // 更新用户头像信息 // 这里的window就是fm
        window.parent.getUserInfo()
      },
    });
  });
});
