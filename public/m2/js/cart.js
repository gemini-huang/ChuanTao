/*
** Create by JX12138 on 2019/4/30
*/
$(function () {
    /*区域滚动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators: false
    });

    /*1.自动下拉刷新*/
    /*2.侧滑的时候，点击编辑，弹出对话框(尺码，数量）*/
    /*3.侧滑的时候 点击删除 弹出对话框， 确认框*/
    /*4.点击复选框， 计算总金额*/

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
                    setTimeout(function () {
                        getCartData(function (data) {
                            $('.mui-table-view').html(template('cart', data));
                            /*加载状态隐藏*/
                            that.endPulldownToRefresh();

                            $('.fa-refresh').off('click').on('tap', function () {
                                that.pulldownLoading();
                            })
                        });
                    }, 1000);
                }
            }
        }
    });
    // 编辑
    $('.mui-table-view').on('tap', '.mui-icon-compose', function () {
        var id = parseInt($(this).parent().attr('data-id'));
        var item = CT.getItemById(window.cartData.data, id);
        var html = template('edit', item);

        mui.confirm(html.replace(/\n/g,''), '商品编辑',['确认','取消'], function (e) {
            if (e.index === 0) {
                var size = $('.btn_size.now').html();
                var num = $('.p_number input').val();
                // 发送请求
                CT.loginAjax({
                    type: 'post',
                    url: '/cart/updateCart',
                    data: {
                        id: id,
                        num: num,
                        size: size
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.success === true) {
                            item.num = num;
                            item.size = size;
                            $('.mui-table-view').html(template('cart',window.cartData));
                        }
                    }
                })
            }else {
                // TODO
            }
        });

    });
    $('body').on('tap','.btn_size',function () {
        $(this).addClass('now').siblings().removeClass('now');
    });
    $('body').on('tap','.p_number span',function () {
        var $input = $(this).siblings('input');
        var currNum = $input.val();
        /*字符串 转数字 */
        var maxNum = parseInt($input.attr('data-max'));
        if ($(this).hasClass('jian')) {
            if(currNum <= 1){
                mui.toast('至少一件商品');
                return false;
            }
            currNum--;
        } else {
            /*不超库存*/
            if(currNum >= maxNum){
                /*消息框点击的时候会消失 正好和加号在一块  (击穿 tap,点击穿透)*/
                setTimeout(function () {
                    mui.toast('库存不足');
                },100);
                return false;
            }
            currNum++;
        }
        $input.val(currNum);
    });

    // 删除
    $('.mui-table-view').on('tap', '.mui-icon-trash', function () {
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        mui.confirm('您确认是否删除该商品？', '商品删除', ['确认', '取消'], function(e) {
            if (e.index === 0) {
                CT.loginAjax({
                    type: 'get',
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.success === true) {
                            $this.parent().parent().remove();
                            setAmount();
                        }
                    }
                });
            } else {
                // TODO
            }
        });
    });


    // 计算总金额
    /*5.点击复选框  计算总金额 */
    $('.mui-table-view').on('change','[type=checkbox]',function () {
        /* 总金额 = 每个商品数量*单价 的总和  */
        setAmount();
    });

});

var setAmount = function () {
    var $checkedBox = $('[type=checkbox]:checked');
    var amountSum = 0;
    $checkedBox.each(function (i,item) {
        var id = parseInt($(this).attr('data-id'));
        var item = CT.getItemById(window.cartData.data,id);
        var num = item.num;
        var price = item.price;
        var amount = num * price;
        amountSum += amount;
    });

    if (Math.floor(amountSum * 100) % 10) {
        amountSum = Math.floor(amountSum * 100) / 100;
    }else {
        amountSum = Math.floor(amountSum * 100) / 100;
        amountSum = amountSum.toString() + '0';
    }

    $('#cartAmount').html(amountSum);
};

var getCartData = function (callback) {
    $.ajax({
        url: '/cart/queryCartPaging',
        type: 'get',
        data: {
            page: 1,
            pageSize: 100
        },
        dataType: 'json',
        success: function (data) {
            /*缓存的数据*/
            window.cartData = data;
            callback && callback(data);
        }
    });
};
