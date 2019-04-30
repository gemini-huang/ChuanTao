/*
** Create by JX12138 on 2019/4/30
*/
$(function () {
    /*JSON 有兼容性问题， IE6，IE7不支持， 可以使用json2来解决*/
    $('#submit').on('tap', function () {
        //1. 获取表单序列化数据
        //2. 需要有name属性
        var data = $('form').serialize();
        // console.log(data);

        //3. 发送前需要校验
        //4. data的类型是字符串，这样不好检验，转成对象才好校验 key=value&&k=v ===> {key: value, k: v}
        var dataObject = CT.serialize2object(data);
        // console.log(dataObject);

        if (!dataObject.username) {
            mui.toast('请输入用户名');
            return false;
        }

        if (!dataObject.password) {
            mui.toast('请输入密码');
            return false;
        }

        // 登录业务
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: dataObject,
            dataType: 'json',
            success: function (data) {
                if (data.success === true) {
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if (returnUrl) {
                        location.href = returnUrl;
                    } else {
                        location.href = CT.userUrl;
                    }
                }else {
                    mui.toast(data.message);
                }
            }
        });
    });
});
