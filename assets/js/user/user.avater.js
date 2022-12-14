$(function () {
  let layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  $("#btnChooseImage").on("click", function (e) {
    // 为上传按钮绑定点击事件
    $("#file").click();
  });
  // 监听文件选择框的change事件
  $("#file").on("change", function (e) {
    // console.log(e)
    let fileList = e.target.files;
    console.log(fileList);
    if (fileList.length === 0) {
      return layer.msg("您还没有选择图片，请选择！");
    }
    // 拿到用户选择的文件
    var file = e.target.files[0];
    // 将文件转换为路径
    var imageURL = URL.createObjectURL(file);
    // 重新初始化裁剪区域
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", imageURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  //   绑定按钮，绑定点击事件
  $("#btnUpload").on("click", function (e) {
    // 拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");
    // 调用接口，把头像上传都服务器
    $.ajax({
      method:"POST",
      url:"/my/update/avatar",
      data:{
        avatar : dataURL
      },
      success:function(res){
        if(res.status !== 0) {
          // 更新失败
          return layer.msg(res.message)
        }
        // 更新成功
        layer.msg(res.message)
        // 渲染首页的头像
        window.parent.getUserInfo()
      }
    })
  });
});
