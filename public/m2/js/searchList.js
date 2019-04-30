/*
** Create by JX12138 on 2019/4/28
*/
$(function () {
    /*区域滚动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators: false // 去掉滚动条
    });

    /*1.页面初始化的时候，关键字在文本框显示*/
    /*1.1 获取关键字*/
    /*这个方法可能会多次使用，所以我们将其封装*/
    /*var getParamByUrl = function () {
        /!*以对象存储地址栏信息*!/
        var params = {};
        var search = location.search;
        if (search) {
            search = search.replace('?','');
            /!*如果有多个键值对*!/
            var arr = search.split('&');
            arr.forEach(function (item, i) {
                var itemArr = item.split('=');
                // ['key','1']
                params[itemArr[0]] = itemArr[i];
            })
        }
        console.log(params);
        return params;
    };*/

    var urlParams = CT.getParamByUrl();

    var $input = $('input').val(urlParams.key || '');

    /*2.页面初始化的时候：根据关键字，查询第一页数据4条*/
    /*getSearchData(
        {
            proName: urlParams.key,
            page: 1,
            pageSize: 4
        },
        function (data) {
            // console.log(data);
            /!*渲染数据*!/
            $('.ct_product').html(template('list', data));
        }
    );*/


    /*3.客户点击搜索的时候，根据关键字重置商品列表*/
    $('.ct_search a').on('tap', function () {
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        // console.log(true);
        // 重置商品列表，就是重新渲染
        getSearchData({
            proName: key,
            page: 1,
            pageSize: 4
        }, function (data) {
            /*渲染数据*/
            $('.ct_product').html(template('list', data));
        });
    });

    /*4.用户点击排序的时候， 根据排序的选项进行排序(默认是降序，再次点击是升序)*/
    $('.ct_order a').on('tap', function () {
        // 当前点击的a
        var $this = $(this);

        // 如果之前没有被选中
        if (!$this.hasClass('now')) {
            /*选中，其他的不选中， 箭头默认朝下*/
            $this.addClass('now').siblings().removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        /*没有now 的时候*/
        else {
            if ($this.find('span').hasClass('fa-angle-down')) {
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }

        /*获取当前点击的功能参数   price 1 2  num  1 2*/
        var order = $(this).attr('data-order');
        // console.log(order);
        var orderVal = $(this).find('span').hasClass('fa-angle-up') ? 1 : 2;

        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }


        /*获取数据*/
        var params = {
            proName: key,
            page: 1,
            pageSize: 4,
            /*排序方式*/
        };
        // 在这个对象里面添加一个新的属性 order
        params[order] = orderVal;

        getSearchData(params, function (data) {
            $('.ct_product').html(template('list', data));
        })

    });


    /*5.用户下拉的时候，根据当前条件刷新，上拉加载要重置,排序功能也要重置*/
    mui.init({
        /*下拉容器*/
        pullRefresh: {
            container: "#refreshContainer",
            /*下拉*/
            down: {
                auto: true,
                callback: function () {
                    /*组件对象*/
                    var that = this;

                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }

                    /*排序功能也重置*/
                    $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

                    getSearchData(
                        {
                            proName: key,
                            page: 1,
                            pageSize: 4
                        },
                        function (data) {
                            // console.log(data);

                            setTimeout(function () {
                                /*渲染数据*/
                                $('.ct_product').html(template('list', data));
                                /*停止下拉刷新*/
                                /* mui('#refreshContainer').pullRefresh().endPulldown();*/
                                that.endPulldownToRefresh();
                            }, 1000);
                        }
                    );
                }
            },
            /*6.用户上拉的时候，加载下一页，（没有的数据就不去加载）*/
            up: {
                callback: function () {
                    window.page++;

                    /*组件对象*/
                    var that = this;

                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }

                    var order = $('.ct_order a.now').attr('data-order');
                    // console.log(order);
                    var orderVal = $('.ct_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;

                    /*获取数据*/
                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4,
                        /*排序方式*/
                    };
                    // 在这个对象里面添加一个新的属性 order
                    params[order] = orderVal;


                    getSearchData(params, function (data) {
                            // console.log(data);
                            setTimeout(function () {
                                /*渲染数据*/
                                $('.ct_product').append(template('list', data));
                                /*注意：停止上拉加载*/
                                if (data.data.length) {
                                    that.endPullupToRefresh();
                                } else {
                                    that.endPullupToRefresh(true);
                                }
                            },1000);
                        }
                    );
                }
            }
        }
    });

});

var getSearchData = function (params, callback) {
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            // 保存当前的页码
            window.page = data.page;
            callback && callback(data);
        }
    });
};
