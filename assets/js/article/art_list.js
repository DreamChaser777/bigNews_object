$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;

  //  定义时间美化过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  };

  // 补0
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "",
  };

  initTable();
  initCate();

  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 使用模版引擎渲染
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 分页
        renderPage(res.total);
      },
    });
  }

  // 初始化文章分类
  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 重新渲染
        form.render();
      },
    });
  }
  $("#form-serach").on("submit", function (e) {
    e.preventDefault();
    // 获取表单值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();

    q.cate_id = cate_id;
    q.state = state;

    initTable();
  });

  function renderPage(total) {
    // console.log(total)
    laypage.render({
      elem: "pageBox", //注意，这里的 pageBox 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示
      curr: q.pagenum, //默认选中
      limits: [2, 3, 5, 10],
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      jump: function (obj, first) {
        // 分页发生切换是触发,first可以检测到是那种方式触发的jump
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        q.pagenum = obj.curr; // 最新页码值
        // 最新条目数
        q.pagesize = obj.limit;
        //首次不执行
        if (!first) {
          //do something
          initTable();
        }
      },
    });
  }

  // 通过代理为删除按钮绑定处理函数
  $("tbody").on("click", ".btn-delete", function (e) {
    // 获取删除按钮的个数
    let len = $(".btn-delete").length;
    let id = $(this).attr("data-id");
    // console.log("ok")
    // 删除
    layer.confirm("确定要删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        method: "get",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg(res.message);

          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
