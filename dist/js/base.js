/**
 * 基础类函数
 *
 * @author keepsilent
 * @version 1.0.0
 */
var base = (function () {

    /**
     * 字符串是否在数组里
     * @method base.inArray
     * @param {Array} arr 数组
     * @param {String} obj 字符串
     * @returns {boolean}
     */
    var inArray = function (arr, obj) {
        for (var i in arr) {
            if (arr[i] == obj) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取url的get参数
     * @param  {String} name 参数名称
     * @return {String}
     */
    var getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    /**
     * 不四舍五入保留所需要的小数位数,如果是小数位都是0，格式化为正整数
     * @method setNumberDecimals
     * @param {Number} number 需要格式化的数字
     * @param {Number} decimal 保留小数位，10是一位，100是两位，默认是两位小数
     * @return {Number}
     */
    var setNumberDecimals = function(number,decimal){
        decimal = decimal || 2;
        number = (number != undefined && number != null && number != '') ? number : 0;

        if(number > parseInt(number) && number > 0) {
            number = getRound(number,decimal);
            return number.toFixed(decimal);
        }

        if(number < parseInt(number) && number < 0) {
            number = getRound(number,decimal);
            return number.toFixed(decimal);
        }

        return (parseInt(number)).toFixed(decimal);
    }

    var getRound = function (num, len) {
        return Math.round(num * Math.pow(10, len)) / Math.pow(10, len);
    }

    /**
     * 获取日期
     * @method getDateStr
     * @param {Number} offset 日期偏移量,0:代表今天, 1:代表明天
     * @return {String}
     */
    var getDate = function(offset) {
        var date = new Date();
        date.setDate(date.getDate() + offset); //获取offset天后的日期
        var y = date.getFullYear();
        var m = date.getMonth() + 1;//获取当前月份的日期
        var d = date.getDate();

        if(parseInt(m) < 10) {
            m =  '0'+m;
        }

        if(parseInt(d) < 10) {
            d =  '0'+d;
        }

        return y + "-" + m + "-" + d;
    }

    /**
     * 获取日期数据
     * @getDateArray
     * @param {String} time
     */
    var getDateArray = function(time) {
        time = time.replace(/-/g,':').replace(' ',':');
        return time.split(':');
    }

    /**
     * 对日期进行格式化，
     * @param date 要格式化的日期
     * @param format 进行格式化的模式字符串
     *     支持的模式字母有：
     *     y:年,
     *     M:年中的月份(1-12),
     *     d:月份中的天(1-31),
     *     h:小时(0-23),
     *     i:分(0-59),
     *     s:秒(0-59),
     *     S:毫秒(0-999),
     *     q:季度(1-4)
     * @return String
     */
    var setDateFormat = function(format,time) {
        //time = time.replace(/-/g,':').replace(' ',':');
        //time = time.split(':');

        //var date = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);
        var date = new Date(time);
        var map = {
            'Y': date.getFullYear(), //年
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "i": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yYMdhisqS])+/g, function(all, t){
            var v = map[t];
            if(v !== undefined){
                if(all.length > 1){
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                if(t === 'M' || t === 'd' || t === 'h' || t === 'i' || t === 's') {//时分秒
                    if(parseInt(map[t]) < 10 ) {
                        v = '0' + parseInt(map[t]);
                    }
                }
                return v;
            } else if(t === 'y'){
                return (date.getFullYear() + '').substr(3 - all.length);
            }
            return all;
        });
        return format;
    }


    /**
     * 获取数据长度
     * @method getDataLength
     * @param {Object} data
     */
    var getDataLength = function (data) {
        var len = 0;
        for(var i in data){
            len++;
        }
        return len;
    }

    /**
     * 跳转url
     * @method jumpUrl
     * @param {String} url 链接
     * @param {String} type 类型
     * @return {Bloon}
     */
    var jumpUrl = function (url,target) {
        var target = target || '';
        if(!base.isEmptyValue(target)) {
            var a = document.createElement('a');
            a.setAttribute('target', target);// href链接
            a.setAttribute('href', url);// href链接
            a.click();
            return false;
        }
        window.location.href = url;
        return false;
    }

    /**
     * 获取日期范围
     * @method getDateScope
     * @param {String} type 范围类型
     * @param {String} separator 分隔符,默认' - '
     * @param {Date|String} data 设定日期
     * @return String
     */
    var getDateScope = function (type, separator, date) {
        if(date && !(date instanceof Date)){
            date = new Date(date);
        }

        if(!date){
            date = new Date();
        }

        var type = type || 'all';
        var begin = '', end = '';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var week = date.getDay() || 7; //今天本周的第几天
        var day = date.getDate();

        var last = new Date(); //上月日期
        last.setDate(1);
        last.setMonth(last.getMonth() - 1);
        var lastYear = last.getYear();
        var lastMonth = last.getMonth();


        var quarterStartMonth = 0;
        var separator = separator || ' - ';
        switch (type) {
            case 'yesterday':
                begin = end = getDate(-1);
                break;
            case 'today':
                begin = end = getDate(0);
                break;
            case 'last-week':
                begin = setDateFormat('Y-M-d',new Date(year, month - 1, day - week - 6));
                end = setDateFormat('Y-M-d',new Date(year, month - 1, day - week));
                break;
            case 'week':
                begin = getDate((-date.getDay() || -7) + 1);
                end = getDate((-date.getDay()|| -7) + 7);
                break;
            case 'last-month':
                if(lastMonth == 11) {
                    begin = setDateFormat('Y-M-d',new Date(year - 1, lastMonth, 1));
                    end = setDateFormat('Y-M-d',new Date(year - 1, lastMonth, getMonthDays(lastMonth)));
                } else {
                    begin = setDateFormat('Y-M-d',new Date(year, lastMonth, 1));
                    end = setDateFormat('Y-M-d',new Date(year, lastMonth, getMonthDays(lastMonth)));
                }
                break;
            case 'month':
                day = getMonthDays(month - 1);
                month = month < 10 ? '0' + month : month;
                begin = year +'-' + month + '-01';
                end = year +'-' + month + '-' + day ;
                break;
            case 'last-quarter':
                if (month < 4) {
                    year--;
                    quarterStartMonth = 10;
                }

                if ( month > 3 && month < 7) {
                    quarterStartMonth = 1;
                }

                if( month > 6 && month < 10) {
                    quarterStartMonth = 4;
                }

                if(month > 9) {
                    quarterStartMonth = 7;
                }

                var quarterEndMonth = quarterStartMonth + 2;
                day = getMonthDays(quarterEndMonth - 1);
                quarterStartMonth = quarterStartMonth < 10 ? '0' + quarterStartMonth : quarterStartMonth;
                begin = year +'-' + quarterStartMonth + '-01';
                quarterEndMonth = quarterEndMonth < 10 ? '0' + quarterEndMonth : quarterEndMonth;
                end = year +'-' + quarterEndMonth + '-' + day ;
                break;
            case 'quarter':
                if (month < 4) {
                    quarterStartMonth = 1;
                }

                if ( month > 3 && month < 7) {
                    quarterStartMonth = 4;
                }

                if( month > 6 && month < 10) {
                    quarterStartMonth = 7;
                }

                if(month > 9) {
                    quarterStartMonth = 10;
                }

                var quarterEndMonth = quarterStartMonth + 2;
                day = getMonthDays(quarterEndMonth - 1);
                quarterStartMonth = quarterStartMonth < 10 ? '0' + quarterStartMonth : quarterStartMonth;
                begin = year +'-' + quarterStartMonth + '-01';
                quarterEndMonth = quarterEndMonth < 10 ? '0' + quarterEndMonth : quarterEndMonth;
                end = year +'-' + quarterEndMonth + '-' + day ;
                break;
            case 'year':
                begin = year+'-01-01';
                end = year +'-12-31';
                break;
            case 'all':
                return '';
        }

        return begin + separator + end;
    }

    /**
     * 获得某月的天数
     * @method getMonthDays
     * @param  {String} month 月
     * @return {number}
     */
    var getMonthDays = function(month) {
        var date = new Date();
        var year = date.getFullYear();
        var begin = new Date(year, month, 1);
        var end = new Date(year, month + 1, 1);
        var days = (end - begin) / (1000 * 60 * 60 * 24);
        return days;
    }


    /**
     * 获得范围时间
     * @method getScopeDate
     * @param {Number} scope 范围
     */
    var getScopeDate = function (scope) {
        var index = 0;
        var begin = getDate(-scope);
        var end = getDate(0);

        switch (scope) {
            case 14:
                index = 1;
                break;
            case 30:
                index = 2;
                break;
            default:
                index = 0;
                break;
        }

        $('#wx-date-box').find('div.left').removeClass('selected');
        $('#wx-date-box').find('div.left').eq(index).addClass('selected');
        $('#wx-date').val(begin+' -  '+ end);
    }


    /**
     * 获取字符长度
     * @method getStrLen
     * @param {String} str 字符串
     */
    var getStrLen = function (str){
        var totallength = 0;
        for (var i = 0;i < str.length; i++) {
            var intCode = str.charCodeAt(i);
            if(intCode >= 0 && intCode <= 128) {
                totallength = totallength + 1;//非中文单个字符长度加 1
            } else {
                totallength = totallength + 2;//中文字符长度则加 2
            }
        }
        return totallength;
    }

    /**
     * 数组对象排度,默认倒序,desc
     * @param {String} key 键名
     * @param {string} order 排序
     * @return boolen
     */
    var compare = function (key,order) {
        var order = order || 'desc'
        return function (obj1, obj2) {
            var val1 = obj1[key];
            var val2 = obj2[key];
            if(order == 'desc') {
                if (val1 > val2) {
                    return -1;
                }

                if (val1 < val2) {
                    return 1;
                }
            }

            if(order == 'asc') {
                if (val1 < val2) {
                    return -1;
                }

                if (val1 > val2) {
                    return 1;
                }
            }

            return 0;
        }
    }

    /**
     * 数组元素向上移
     * @method upData
     * @param {Array} data 数组
     * @param {Number} index 数组索引
     * @return Array
     */
    var upData = function (data, index) {
        if (data.length > 1 && index !== 0) {
            return swapItems(data, index, index - 1)
        }

        return data;
    }

    /**
     * 数组元素向下移
     * @method downData
     * @param {Array} data 数组
     * @param {Number} index 数组索引
     * @return Array
     */
    var downData = function(data, index) {
        if (data.length > 1 && index !== (data.length - 1)) {
            return  swapItems(data, index, index + 1)
        }

        return data;
    }


    /**
     * 数组元素互换
     * @method swapItems
     * @param {Array} data 数组
     * @param {Number} index 数组索引
     * @return Array
     */
    var swapItems = function(data, index1, index2){
        data[index1] = data.splice(index2,1,data[index1])[0];
        return data;
    }

    /**
     * 删除左右两端的空格
     * @param {String} str 字符
     * @param {String} type 删除类型
     * @return {String}
     */
    var trim = function(str,type) {
        var regular = '';
        switch (type) {
            case ',':
                regular = /(^,*)|(,*$)/g;
                break;
            default:
                regular = /(^\s*)|(\s*$)/g;
                break;
        }

        return str.replace(regular, "");
    }

    /**
     * 删除左边的空格
     * @param {String} str 字符
     * @param {String} type 删除类型
     * @return {String}
     */
    var ltrim = function(str,type) {
        var regular = '';
        switch (type) {
            case ',':
                regular = /(^,*)/g;
                break;
            default:
                regular = /(^\s*)/g;
                break;
        }

        return str.replace(regular,"");
    }

    /**
     * 删除右边的空格
     * @param {String} str 字符
     * @param {String} type 删除类型
     * @return {String}
     */
    var rtrim = function(str,type) {
        var regular = '';
        switch (type) {
            case ',':
                regular = /(,*$)/g;
                break;
            case ';':
                regular = /(;*$)/g;
                break;
            default:
                regular = /(\s*$)/g;
                break;
        }
        return str.replace(regular,"");
    }


    /**
     * 首字母大写
     * @method capitalize
     * @param {String} str 字符串
     * @return {String}
     */
    var capitalize = function (str) {
        return str.substring(0,1).toUpperCase()+str.substring(1);
    }

    /**
     * 是否空对象
     * @member isEmptyObject
     * @param {Object} obj 对象
     * @return boolen
     */
    var isEmptyObject = function (obj) {
        for(var key in obj){
            return false;
        }

        return true;
    }

    /**
     * 是否空值
     * @method isEmptyValue
     * @param {String} value 值
     * @return {Bloen}
     */
    var isEmptyValue = function (value) {
        if(value != '' && value != undefined && value != null) {
            return false;
        }

        return true;
    }


    /**
     * 是否数字
     * @method isNumber
     * @param {Number} val 值
     * @return {boolean}
     */
    var isNumber = function(val,type) {
        var type = type || 'number';
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数

        if(type == 'decimal') {
            regPos = /^\d+(\.)?$/;
        }

        if(regPos.test(val)) {
            return true;
        }

        return false;
    }

    /**
     * 是否整数
     * @method isIntNum
     * @param {Number} val 值
     * @return {boolean}
     */
    var isIntNum = function(val){
        var regPos = /^\d+$/;
        if(regPos.test(val)){
            return true;
        }

        return false;
    }

    /**
     * 获取对象数据
     * @method getItemObject
     * @param {Object} item
     */
    var getItemObject = function (item) {
        var object = {};
        for(var i in item) {
            object[i] = '';
        }

        return object;
    }

    /**
     * 设置数字
     * @method setNumber
     * @param {Number} value 值
     * @param {Sting} type 类型
     * @return {Number}
     */
    var setNumber = function (value,type) {
        if(isEmptyValue(value)) {
            return  0;
        }

        type = type || 'int';
        if(type == 'int') {
            return parseInt(value);
        }

        return parseFloat(value);
    }


    /**
     * 生成Url
     * @method createUrl
     * @param {String} control 控制器
     * @param {String} action 动作
     * @return {String}
     */
    var createUrl = function (control, action) {
        return config.getUrl('/' + control + '/' + action);
    }

    /**
     * 生成id
     * @method createId
     * @params {String} id 元素id
     * @params {String} type 类型
     */
    var createId = function (id,type) {
        var type = type || '#';
        return type + id;
    }

    /**
     * 生成模版
     * @method createTemplate
     * @param {String} path 路径
     * @param {String} name 模版名
     * @return {String}
     */
    var createTemplate = function (path,name) {
        return path + '/' + name;
    }


    /**
     * 字符串连接
     * @method  strJoin
     * @param {String} p1 参数1
     * @param {Sgring} p2 参数2
     * @param {String} sign 分割符
     */
    var createStrJoin = function (p1,p2,sign) {
        var sign = sign || '-';
        if(isEmptyValue(p2)) {
            return p1;
        }

        return p1 + sign + p2;
    }

    /**
     * 移除字符串前缀
     * @method removeStrPrefix
     * @param {String} str 字符串
     * @param {String} sign 分割符
     * @return {String}
     */
    var removeStrPrefix = function (str,sign) {
        var prefix = ''
        var sign = sign || '-';
        if(str.indexOf(sign) == -1) {
            return str;
        }

        prefix = getIdentifyType(str,sign);
        return str.replace(prefix+'-','');
    }

    /**
     * 获取值
     * @method getVal
     * @param {String} id
     * @param {String} type
     * @return {String}
     */
    var getVal = function (id,type) {
        var type = type || '';
        switch (type) {
            default:
                return $(id).val();
        }
    }

    /**
     * 下载
     * @method download
     * @param {String} url 链接
     */
    var download = function (url) {
        var iframe = config.getOptions('iframe');
        var id = createId(iframe);

        $(id).attr('src',url)
    }

    /**
     * 后退
     * @method backup
     */
    var backup = function () {
        window.history.go(-1)
    }

    return {
        inArray: inArray
        ,getDate: getDate
        ,getDateArray: getDateArray
        ,getQueryString: getQueryString
        ,setNumberDecimals: setNumberDecimals
        ,setDateFormat: setDateFormat
        ,getDataLength: getDataLength
        ,getScopeDate: getScopeDate
        ,jumpUrl: jumpUrl
        ,getDateScope: getDateScope
        ,getStrLen: getStrLen
        ,compare: compare
        ,upData: upData
        ,downData: downData
        ,swapItems: swapItems
        ,trim: trim
        ,ltrim: ltrim
        ,rtrim: rtrim
        ,capitalize: capitalize


        ,isNumber: isNumber
        ,isIntNum: isIntNum
        ,isEmptyValue: isEmptyValue
        ,isEmptyObject: isEmptyObject

        ,getVal:getVal
        ,getItemObject: getItemObject

        ,removeStrPrefix: removeStrPrefix


        ,setNumber: setNumber

        ,createId: createId
        ,createUrl: createUrl
        ,createStrJoin: createStrJoin
        ,createTemplate: createTemplate

        ,download: download
        ,backup: backup
    }
})();
