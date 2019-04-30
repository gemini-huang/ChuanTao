/*
** Create by JX12138 on 2019/4/27
*/
$(function () {
    /*区域滚动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators:false // 去掉滚动条
    });
    /*轮播图*/
    mui('.mui-slider').slider({
        interval:2000,

    });
});
