/*
** Create by JX12138 on 2019/4/28
*/
/*$(function () {

    var historyList = getHistoryData();

    var history = $('.ct_history');
    // 渲染列表
    history.html(template('historyTpl', {list: historyList}));

    $('.search_input').val('');

    $('.ct_search a').on('tap', function () {
        // 跳转到搜索列表页，并且需要带上关键字
        var key = $.trim($('input').val());

        //没有关键字就提示用户输入关键字
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        // 记录这一次的搜索
        var arr = getHistoryData();

        /!*1.在正常的10条记录内 正常添加*!/
        /!*2.已经10条记录了    添加一条 并且 删除最早的一条 *!/
        /!*3.如果有相同记录    添加一条 并且 删除相同的一条 *!/
        /!*是否有相同数据*!/

        var isHave = false;
        var haveIndex;

        for (var i = 0; i < arr.length; i++) {
            if (key === arr[i]) {
                isHave = true;
                haveIndex = i;
                break;
            }
        }

        if (isHave) {
            //如果记录相同，添加，然后删除之前相同的数据
            arr.push(key);

            arr.splice(haveIndex, 1);
        } else {
            // 如果数据不同，如果小于10条，正常添加，不然删除第一条
            if (arr.length < 10) {
                arr.push(key);
            } else {
                arr.push(key);
                arr.splice(0, 1);
            }
        }


        // 存起来
        localStorage.setItem('historyList', JSON.stringify(arr));

        location.href = 'searchList.html?key=' + key;
    });

    // 删除单条数据
    history.on('tap', '.mui-icon', function () {
        //获取到当前的index
        var index = $(this).attr('data-index');
        var arr = getHistoryData();
        arr.splice(index, 1);

        localStorage.setItem('historyList', JSON.stringify(arr));
        // 重新渲染
        $('.ct_history').html(template('historyTpl', {list: arr}));
    });

    //清空数据
    history.on('tap', '.fa', function () {
        localStorage.setItem('historyList', '[]');
        // 重新渲染
        $('.ct_history').html(template('historyTpl', {list: []}));

    });

});


var getHistoryData = function () {
    var str = localStorage.getItem('historyList') || '[]';
    var arr = JSON.parse(str);
    return arr;
};*/


$(function () {

    var historyList = getHistoryData();

    var history = $('.ct_history');

    // 渲染数据
    history.html(template('historyTpl',{list: historyList}));

    $('.search_input').val('');

    $('.search_btn').on('tap', function () {
        var key = $.trim($('.search_input').val());

        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }

        var arr = getHistoryData();

        var isHave = false;
        var haveIndex;

        for (var i = 0; i < arr.length; i++) {
            if (key === arr[i]) {
                isHave = true;
                haveIndex = i;
                break;
            }
        }

        if (isHave) {
            //如果记录相同，添加，然后删除之前相同的数据
            arr.push(key);

            arr.splice(haveIndex, 1);
        } else {
            // 如果数据不同，如果小于10条，正常添加，不然删除第一条
            if (arr.length < 10) {
                arr.push(key);
            } else {
                arr.push(key);
                arr.splice(0, 1);
            }
        }

        localStorage.setItem('historyList',JSON.stringify(arr));
        location.href = 'searchList.html?key=' + key;
    });


    // 删除数据
    history.on('tap', '.mui-icon-closeempty', function () {
        // var index = $(this).attr('data-index');
        var index = $(this).data('index');
        var arr= getHistoryData();
        arr.splice(index, 1);

        localStorage.setItem('historyList',JSON.stringify(arr));

        // 重新渲染
        history.html(template('historyTpl', {list: arr}));
    });

    //清空数据
    history.on('tap', '.fa', function () {
        localStorage.setItem('historyList', '[]');
        // 重新渲染
        history.html(template('historyTpl',{list: []}));
    });

});


var getHistoryData = function () {
    var str = localStorage.getItem('historyList') || '[]';
    var arr = JSON.parse(str);
    return arr;
};
