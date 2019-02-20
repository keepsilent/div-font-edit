# DIV-font-edit
DIV 文字编辑器


# 功能
* 插入表情符
* 记录光标的位置
* 限制字符串长度

# DIV 激活编辑模式
````
 <div class="edit-inner" id="wx-contentedit" contenteditable="true" onkeyup="editor.input()"></div>
````
* 设置 {contenteditable} 属性为 {true}

# 解决点击 DIV 以外失去当前光标位置
````
 <span class="emoji-btn" onclick="editor.showFace(event)" unselectable="on" onmousedown="return false;">表情</span>
````
* 设置 {unselectable} 属性为 {on}
* 设置 {onmousedown} 属性为 {return false;}

# 环境要求
* IE 6 以上

# 参考资料
* [DIV可编辑模式在光标位置插入内容](https://canlynet.iteye.com/blog/2340751)
* [可编辑div在光标位置插入指定内容](https://blog.csdn.net/mafan121/article/details/79280529)
* [JS在可编辑的div中的光标位置插入内容的方法](https://www.jb51.net/article/57650.htm)

# 样式
* bilibili 评论样式