/*
** Create by JX12138 on 2019/4/28
*/

$(function () {
    /*一级分类*/
    //1.一级分类默认渲染，第一个一级分类对应的二级分类
    getFirstCategoryData(function (data) {
        // console.log(data);
        //一级分类默认渲染
        // 模板的使用顺序： json 数据，定义模板，调用模板，返回HTML
        $('.cate_left ul').html(template('firstTemplate', data));

        //绑定事件
        /*initSecondTapHandle();*/

        // 第一个一级分类对应的二级分类
        var categoryId = $('.cate_left ul li:first-child').find('a').attr('data-id');
        render(categoryId);
    });
});

// 2. 点击一级分类加载对应的二级分类
/*var initSecondTapHandle = function () {

}*/
$('.cate_left').on('tap', 'a', function () {
    // 当前选中的时候，不去加载 => 优化
    if ($(this).parent().hasClass('now')) return false;

    // 样式的选中
    $('.cate_left li').removeClass('now');
    $(this).parent().addClass('now');

    // 数据的渲染
    var categoryId = $(this).attr('data-id');
    // console.log(categoryId);
    render(categoryId);

    /*二级分类*/
});

// 获取一级分类的数据
var getFirstCategoryData = function (callback) {
    $.ajax({
        url: '/category/queryTopCategory',
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            // window.data = data;
            callback && callback(data);
        }
    });
};

// 获取er级分类的数据
//
var getSecondCategoryData = function (params, callback) {
    $.ajax({
        url: '/category/querySecondCategory',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
};


// 渲染二级分类的方法
var render = function (categoryId) {
    getSecondCategoryData(
        {
            id: categoryId
        },
        function (data) {
            $('.cate_right ul').html(template('secondTemplate', data));
        });
};
