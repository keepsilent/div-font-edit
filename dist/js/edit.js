/**
 * 编辑器
 * 说明: 文字、图文消息、图片和语音
 * @author keepsilent
 * @version 1.0.0
 */
var editor = (function () {

    var options = {
        text: 'wx-contentedit',
        placeholder: 'wx-editor-placeholder',
        faceBox: 'emoji-box',

        cacheText: '',
        limit: {
            id: 'wx-editor-font-num',
            max: 140
        },
        sel: '',
        range: '',
        face: '微笑,撇嘴,色,发呆,得意,流泪,害羞,闭嘴,睡,大哭,尴尬,发怒,调皮,呲牙,惊讶,难过,酷,冷汗,抓狂,吐,偷笑,可爱,白眼,傲慢,饥饿,困,惊恐,流汗,憨笑,大兵,奋斗,咒骂,疑问,嘘,晕,折磨,衰,骷髅,敲打,再见,擦汗,抠鼻,鼓掌,糗大了,坏笑,左哼哼,右哼哼,哈欠,鄙视,委屈,快哭了,阴险,亲亲,吓,可怜,菜刀,西瓜,啤酒,篮球,乒乓,咖啡,饭,猪头,玫瑰,凋谢,示爱,爱心,心碎,蛋糕,闪电,炸弹,刀,足球,瓢虫,便便,月亮,太阳,礼物,拥抱,强,弱,握手,胜利,抱拳,勾引,拳头,差劲,爱你,NO,OK,爱情,飞吻,跳跳,发抖,怄火,转圈,磕头,回头,跳绳,挥手,激动,街舞,献吻,左太极,右太极'
    }

    /**
     * 显示表情
     * @method showFace
     */
    var showFace = function (e) {
        e.stopPropagation();
        var id = base.createId(options.faceBox);
        var status = $(id).attr('data-status');
        var data = (options.face).split(',');

        if(status == 0) {
            var index = ''
            var html = '';
            for(var i in data) {
                index = 100 + i;
                html +='<li><a class="js_emotion" href="javascript:void(0);" data-index="'+i+'" data-id="'+index+'" data-title="'+data[i]+'" title="'+data[i]+'" onclick="editor.selectFace($(this))"></a></li>';
            }
            $(id).find('ul').html(html);
            $(id).attr('data-status',1).show();
            cacheCursorPosition()
        } else {
            $(id).attr('data-status',0).hide();
        }
    }


    /**
     * 隐藏表情
     * @method hideFace
     */
    var hideFace = function () {
        var id = base.createId(options.faceBox);
        $(id).attr('data-status',0).hide();
    }

    /**
     * 选择表情
     * @method selectFace
     * @param {Object} _this 当前对象
     */
    var selectFace = function(_this) {
        var id = options.faceBox;
        var html = '/'+$(_this).attr('data-title');

        $(id).attr('data-status',0).hide();
        document.getElementById(options.text).focus();

        insertHtml(html);
        controlStrLength();
        showPlaceholder();
        hideFace();
    }

    /**
     *  缓存光标位置
     *  @methods cacheCursorPosition
     */
    var cacheCursorPosition = function () {
        document.getElementById(options.text).focus();

        if (!window.getSelection) {
            return false;
        }

        var sel = window.getSelection(), range;     // IE9 and non-IE
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            options.range = range;
            options.sel = sel;
        }
    }

    /**
     * 插入Html
     * @method insertHtml
     * @param {String} html
     */
    var insertHtml = function(html) {
        if (window.getSelection) {
            var sel = options.sel, range = options.range;
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

    /**
     * 控制字符串长度
     * @method controlStrLength
     */
    var controlStrLength = function () {
        var num = 0;
        var tId = base.createId(options.text);
        var nId = base.createId(options.limit.id);
        var val = $(tId).html();
        var len = getLen(val);

        if(len > options.limit.max) {
            $(tId).html(options.cacheText);
            return false;
        }

        options.cacheText = val;
        num = options.limit.max - len;
        $(nId).html(num);
    }

    /**
     * 获取字符串长度
     * @param {String} val
     */
    var getLen = function (val) {
        val = val.replace(/src=\".+\"/g,'');
        val = val.replace(/_data=\".+\"/g,'');
        return base.getStrLen(val);
    }

    /**
     * 输入
     * @method input
     */
    var input = function () {
        controlStrLength();
        showPlaceholder();
    }

    /**
     * 显示提示
     * @method placeholder
     */
    var showPlaceholder = function () {
        var id = base.createId(options.text);
        var val = $(id).html();
        var placeholder = base.createId(options.placeholder);

        if(base.isEmptyValue(val)) {
            $(placeholder).show();
        } else {
            $(placeholder).hide();
        }
    }

    /**
     * 临听事件
     * @method
     */
    var listion = function () {
        var id = base.createId(options.faceBox);
        var status = $(id).attr('data-status');

        if(status == 1) {
            $(id).attr('data-status',0).hide();
        }
    }

    return {
        showFace: showFace,
        selectFace: selectFace,
        input: input,
        listion: listion
    }
})();
