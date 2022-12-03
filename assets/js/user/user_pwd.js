$(function () {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 新密码校验规则，不能和旧密码相同
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新旧密码不能一致！";
      }
    },
    // 比较新密码要和确认密码相同
    confirmPwd: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次输入密码不相同，请重新输入！";
      }
    },
  });

  $(".layui-form").on("submit", function (e) {
    // console.log(res)
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res)
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        // 重置表单内容   $(".layui-form")[0] 转换为dom元素
        $(".layui-form")[0].reset()
      }
    })
  });
});
