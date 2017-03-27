//设置点击确定执行函数fun1  点击取消执行函数fun2
	function pop(){
	fun1 = function(){alert(1);}
	fun2 = function(){alert(2);}
	str = "对话框的内容"; 
	showWindow('我的提示框',str,850,250,true,['确定',fun1,'取消',fun2]); 
	
	}
	//title：标题  html：对话框内容  width、height：对话框宽高 modal：模态（）true，非模态(false)  buttons：按钮数组
	function showWindow(title,html,width,height,modal,buttons) 
	{ 
		//避免窗体过小 
		if (width < 300){ width = 300;}
		if (height < 200){ height = 200;} 
		//声明mask的宽度和高度（也即整个屏幕的宽度和高度） 
		var w,h; 
		//可见区域宽度和高度 
		var cw = document.body.clientWidth; 
		var ch = document.body.clientHeight; 
		//正文的宽度和高度 
		var sw = document.body.scrollWidth; 
		var sh = document.body.scrollHeight; 
		//可见区域顶部距离body顶部和左边距离 
		var st = document.body.scrollTop; 
		var sl = document.body.scrollLeft; 
		w = cw > sw ? cw:sw; 
		h = ch > sh ? ch:sh; 
		//避免窗体过大 
		if (width > w){ width = w;} 
		if (height > h){ height = h;}

		//如果modal为true，即模式对话框的话，就要创建一透明的掩膜，即一个div
		if (modal) 
		{ 
		var mask = createEle('div'); 
		mask.style.cssText = "position:absolute;left:0;top:0px;background:#B3B3B3;filter:Alpha(Opacity=30);opacity:0.5;z-index:10000;width:" + w + "px;height:" + h + "px;"; 
		appChild(mask); 
		} 
		
		//这是主窗体 
		var win = createEle('div'); 
		win.style.cssText = "position:absolute;left:" + (sl + cw/2 - width/2) + "px;top:" + (st + ch/2 - height/2) + "px;background:#f0f0f0;z-index:10001;width:" + width + "px;height:" + height + "px;"; 
		//标题栏 
		var tBar = createEle('div'); 
		//afccfe,dce8ff,2b2f79   设置各个浏览器width不同值
		tBar.style.cssText = "margin:0;width:" +width+"px; *width:"+(width+10) + "px; _width:"+(width+10) + "px;height:30px;background:#2599F2;cursor:move;"; 
		//标题栏中的文字部分 
		var titleCon = createEle('div'); 
		titleCon.style.cssText = "float:left;margin:6px;color:white;"; 
		titleCon.innerHTML = title;//firefox不支持innerText，所以这里用innerHTML 
		tBar.appendChild(titleCon); 
		//标题栏中的“关闭按钮” 
		var closeCon = createEle('div'); 
		closeCon.style.cssText = "float:right;width:20px;margin:6px;cursor:pointer;color:white;";//cursor:hand在firefox中不可用 
		closeCon.innerHTML = "×"; 
		tBar.appendChild(closeCon); 
		win.appendChild(tBar); 
		//窗体的内容部分，CSS中的overflow使得当内容大小超过此范围时，会出现滚动条 
		var htmlCon = createEle('div'); 
		htmlCon.style.cssText = "margin-top:12px;margin-left:12px;text-align:left;width:" + width + "px;height:" + (height - 50) + "px;overflow:auto;"; 
		htmlCon.innerHTML = html; 
		win.appendChild(htmlCon); 
		//窗体底部的按钮部分  设置各个浏览器width不同值
		var btnCon = createEle('div'); 
		btnCon.style.cssText = "width:" +width+"px; *width:"+(width+10) + "px; _width:"+(width+10) + "px;height:50px;text-height:20px;background:#F7F7F7;text-align:center;padding-top:10px;"; 
		//如果参数buttons为数组的话，就会创建自定义按钮 
		if (isArray(buttons)) 
		{ 
			var length = buttons.length; 
			if (length > 0) 
			{ 
				if (length % 2 == 0) 
				{ 
					for (var i = 0; i < length; i = i + 2) 
					{ 
						//按钮数组 
						var btn = createEle('button'); 
						btn.innerHTML = buttons[i];//firefox不支持value属性，所以这里用innerHTML  
						btn.onclick = buttons[i + 1]; 
						btn.style.cssText = "background:#2599F2;width:50px;height:30px;border:none;color:white;"
						btnCon.appendChild(btn); 
						//用户填充按钮之间的空白 
						var nbsp = createEle('label'); 
						nbsp.innerHTML = "　"; 
						btnCon.appendChild(nbsp); 
					} 
				} 
			} 
		} 
		win.appendChild(btnCon); 
		appChild(win);
		
		/*************************************以下为拖动窗体事件*********************/ 
		//鼠标停留的X坐标 
		var mouseX = 0; 
		//鼠标停留的Y坐标 
		var mouseY = 0; 
		//窗体到body顶部的距离 
		var toTop = 0; 
		//窗体到body左边的距离 
		var toLeft = 0; 
		//判断窗体是否可以移动 
		var moveable = false; 
		//标题栏的按下鼠标事件 
		tBar.onmousedown = function() 
		{ 
			var eve = getEvent(); 
			moveable = true; 
			mouseX = eve.clientX; 
			mouseY = eve.clientY; 
			toTop = parseInt(win.style.top); 
			toLeft = parseInt(win.style.left); 
			//移动鼠标事件 
			tBar.onmousemove = function() 
			{ 
				if(moveable) 
				{ 
					var eve = getEvent(); 
					var x = toLeft + eve.clientX - mouseX; 
					var y = toTop + eve.clientY - mouseY; 
					if (x > 0 && (x + width < w) && y > 0 && (y + height < h)) 
					{ 
						win.style.left = x + "px"; 
						win.style.top = y + "px"; 
					} 
				} 
			} 
			//放下鼠标事件，注意这里是document而不是tBar 
			document.onmouseup = function() 
			{ 
				moveable = false; 
			} 
		} 
		//获取浏览器事件的方法，兼容ie和firefox 
		function getEvent() 
		{ 
			return window.event || arguments.callee.caller.arguments[0]; 
		} 
		//顶部的标题栏和底部的按钮栏中的“关闭按钮”的关闭事件 
		closeCon.onclick = function() 
		{ 
			remChild(win); 
			remChild(mask); 
		} 
	} 

	//判断是否为数组 
	function isArray(v) 
	{ 
	  	return v && typeof v.length == 'number' && typeof v.splice == 'function'; 
	} 
	//创建元素 
	function createEle(tagName) 
	{ 
		return document.createElement(tagName); 
	} 
	//在body中添加子元素 
	function appChild(eleName) 
	{ 
		return document.body.appendChild(eleName); 
	} 
	//从body中移除子元素 
	function remChild(eleName) 
	{ 
		return document.body.removeChild(eleName); 
	} 
