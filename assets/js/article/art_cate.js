$(function () {
  let layer = layui.layer;
  let form  = layui.form

  initArtCateList();

  // 获取文章了分类列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res);
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }
  // 添加按钮
  let indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog_add").html(),
    });
  });

  // 通过代理的形式给表达绑定提交事件
  $("body").on("submit", "#form_add", function (e) {
    e.preventDefault();
    // console.log("ok");
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增分类失败！" + res.message);
        }
        initArtCateList();
        layer.msg("新增成功！" + res.message);
        layer.close(indexAdd);
      },
    });
  });

  //  编辑
  let indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "编辑文章分类",
      content: $("#dialog_edit").html(),
    });
    var id = $(this).attr("data-id");
    // 发起请求
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success:function(res){
        console.log(res)
        form.val('form-edit',res.data)
      }
    });
  });


  $("body").on('submit','#form_edit',function(e){
    e.preventDefault()
    $.ajax({
      method:"POST",
      url:"/my/article/updatecate",
      data:$(this).serialize(),
      success:function(res){
        // console.log(res)
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  $("tbody").on("click",".btn-delete",function(e){
    var id  = $(this).attr('data-Id')
    layer.confirm('确定要删除?', {icon: 3, title:'提示'}, function(index){

      $.ajax({
        method:"GET",
        url:"/my/article/deletecate/" + id,
        success:function(res){
          if(res.status !== 0 ){
            return layer.msg(res.message)
          }
          layer.msg(res.message)
          layer.close(index);
          initArtCateList() 
        }
      })
    });
  })
});
