$(function () {
  let layer = layui.layer;
  let form = layui.form;

  initCate();
  initEditor();
  // 定义加载文章分类方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        //  渲染分类的下来菜单
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);

        form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 为选择封面的按钮绑定事件
  $("#btnChooseImage").on("click", function (e) {
    $("#coverFile").click();
  });

  $("#coverFile").on("change", function (e) {
    // 获取到文件的列表
    let files = e.target.files;
    // 判断是否选择了
    if (files.length == 0) {
      return layer.msg("您还没有选择！");
    }
    let newImgURL = URL.createObjectURL(files[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  let art_state = "已发布";

  $("#btnSave2").on("click", function (e) {
    art_state = "草稿";
  });

  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    // 基于form表单快速创建formData对象
    var fd = new FormData($(this)[0]);
    fd.append("state", art_state);

    // 将封面裁剪后输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 存入到fd
        fd.append("cover_img", blob);
        // 发起请求
        publishArticle(fd);
      });
  });
  // 发布文章
  function publishArticle(fd) {
    $.ajax({
      method: "post",
      url: "/my/article/add",
      data: fd,
      // 如果是formData要配置下面两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        // 发布成功后跳转到列表页面
        location.href = "/article/art_list.html";
      },
    });
  }
});
