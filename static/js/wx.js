var wx=function(window,undefined){
    var D=window.document
        ,ua=function(){
            var o={},s,ua=navigator.userAgent.toLowerCase();
            (s = ua.match(/msie (\d+)/)) ? o.ie = s[1] :
                (s = ua.match(/firefox\/(\d+)/)) ? o.firefox = s[1] :
                    (s = ua.match(/chrome\/(\d+)/)) ? o.chrome = s[1] :
                        (s = ua.match(/opera.(\d+)/)) ? o.opera = s[1] :
                            (s = ua.match(/version\/(\d+).*safari/)) ? o.safari = s[1] : 0;
            return o;
        }()
        ,et=function(dst, src) {
            for(var p in src)
                dst[p] = src[p];
            return dst;
        }
        ,$a=function(mix) {
            if (!mix) return [];
            if (mix.toArray) return mix.toArray();
            var l = mix.length,
                a = new Array(l);
            while (l--) a[l] = mix[l];
            return a;
        }
        ,each=function(arr,fn){
            for(var i=0,l=arr.length;i<l;i++)
                if(fn(arr[i])===false)
                    return;
        }
        ,inArray=function(nd,arr){
            var l=arr.length;
            while(l--)
                if(arr[l]===nd)
                    return true;
            return false;
        }
        ,merge=function(){
            var r=arguments[0];
            for(var i=1,l=arguments.length;i<l;i++)
                if(arguments[i]&&typeof arguments[i].length=='number')
                    for(var ii= 0,ll=arguments[i].length;ii<ll;ii++)
                        r[r.length]=arguments[i][ii];
            return r;
        }
        ,ltrim=function(s){
            return s.replace(/^[\s\uFEFF\xA0]+/g,'');
        }
        ,rtrim=function(s){
            return s.replace(/[\s\uFEFF\xA0]+$/g,'');
        }
        ,trim=function(s){
            return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
        }
        ,stripTag=function(s){
            var ss;
            while(1){
                ss= s.replace(/<[^<>]*?>/g,'');
                if(ss.length==s.length){
                    break;
                }
                s=ss;
            }
            return ss;
        }
        ,addSlash=function(s) {
            return s.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
        }
        ,stripSlash=function(s) {
            return s.replace(/\\(.?)/g,
                function(s, n1) {
                    switch (n1) {
                        case '\\':
                            return '\\';
                        case '0':
                            return '\u0000';
                        case '':
                            return '';
                        default:
                            return n1;
                    }
                });
        }
        ,getById=function(id,ctx){
            return typeof id=='string'?(ctx||D).getElementById(id):id;
        }
        ,getByTag=function(tagname,ctx){
            return (ctx||D).getElementsByTagName(tagname);
        }
        ,loadScript=function(src,loaded,charset,doc){
            var el = D.createElement('script');
            el=et(el,{async:true,charset:charset||'utf-8',type:'text/javascript'});
            el.onload = el.onreadystatechange = function(){
                if (!el.readyState || /loaded|complete/.test(el.readyState)) {
                    el.onload = el.onreadystatechange = null;
                    if (el.parentNode)
                        el.parentNode.removeChild(el);
                    el = null;
                    if(loaded)
                        loaded();
                }
            };
            el.src = src;
            getByTag('head',doc)[0].appendChild(el);
        }
        ,txt2json=function(txt){
            return eval('('+txt+')');
        };

    var div=D.createElement('div'),a;
    div.innerHTML='<link/><table></table><a class="c" href="/a">a</a><input type="checkbox"/><label for="n"></label>';
    a=getByTag('a',div)[0];
    a.style.cssText='float:left;filter:alpha(opacity=10);opacity:0.2';
    var attrClass=a.getAttribute('class')=='c'?'class':'className'
        ,attrFor=getByTag('label',div)[0].getAttribute('for')=='n'?'for':'htmlFor'
        ,floatProp='left'==a.style['cssFloat']?'cssFloat':'styleFloat';

    var _attr=function(el,k,v){
            switch(k){
                case 'for':
                    k=attrFor;
                    break;
                case 'class':
                    k=attrClass;
                    break;
            }
            if(v!==undefined)
                el.setAttribute(k,v);
            else
                return el.getAttribute(k);
        }
        ,attr=function(el,k,v){
            if(typeof k=='object'){
                for(var p in k)
                    _attr(el,p,k[p]);
            }else{
                if(v===undefined)
                    return _attr(el,k);
                else
                    _attr(el,k,v);
            }
        }
        ,getByClass=D.getElementsByClassName?function(cn,ctx){
            return (ctx||D).getElementsByClassName(cn);
        }:function(cn,ctx,tag){
            var els=getByTag(tag||'*',ctx),r=[];
            for(var i=0,l=els.length;i<l;i++)
                if(-1!=(' '+(attr(els[i],'class')||'')+' ').indexOf(' '+cn+' '))
                    r[r.length]=els[i];
            return r;
        }
        ,_computedStyle=a.currentStyle?function(el,k){
            return (el.currentStyle[k]||el.style[k]);
        }:function(el,k){
            return (getComputedStyle(el,'')[k]||el.style[k]);
        }
        ,ralpha=/alpha\s*\([^)]*\)/i
        ,setOpacity=a.filters?function(el,v/*0~1*/){
            var st=el.style;
            v='alpha(opacity='+(v*100)+')';
            st.zoom=1;
            st.filter=ralpha.test(st.filter)?st.filter.replace(ralpha,v):st.filter+' '+v;
        }:function(el,v){
            el.style.opacity=v;
        }
        ,getOpacity=a.filters?function(el){
            var f=el.style.filter;
            if (f.indexOf('opacity=')!=-1)
                return f.match(/opacity\s*=\s*([^)]*)/i)[1]/100;
            else
                return 1;
        }:function(el){
            var op=_computedStyle(el,'opacity');
            return op == '' ? 1 : parseFloat(op);
        }
        ,setStyle=function(el,k,v){
            switch (k){
                case 'float':
                    el.style[floatProp]=v;
                    break;
                case 'opacity':
                    setOpacity(el,v);
                    break;
                default :
                    el.style[k]=v;
            }
        }
        ,getStyle=function(el,k){
            switch (k){
                case 'float':
                    return _computedStyle(el,floatProp);
                case 'opacity':
                    return getOpacity(el);
                default :
                    return _computedStyle(el,k);
            }
        }
        ,css=function(el,k,v){
            if(typeof k=='object'){
                for(var p in k)
                    setStyle(el,p,k[p]);
            }else{
                if(v!==undefined)
                    setStyle(el,k,v);
                else
                    return getStyle(el,k);
            }
        }
        ,prev=function(el){
            while(el=el.previousSibling)
                if(el.nodeType==1)
                    return el;
        }
        ,next=function(el){
            while(el=el.nextSibling)
                if(el.nodeType==1)
                    return el;
        }
        ,addBefore=function(nel,el){
            el.parentNode.insertBefore(nel,el);
        }
        ,addAfter=function(nel,el){
            var n=next(el);
            if(n)
                addBefore(nel,n);
            else
                el.parentNode.appendChild(nel);
        }
        ,destroy=function(el){
            el.parentNode.removeChild(el);
        }
        ,sibling=function(el,toel){/*[el-toel)之间的兄弟节点*/
            var r=[];
            for(;el;el=el.nextSibling)
                if(el.nodeType==1 && el!==toel)
                    r[r.length]=el;
            return r;
        }
        ,firstChild=function(el){
            for(var c=el.firstChild;c;c=c.nextSibling)
                if(c.nodeType==1)
                    return c;
        }
        ,lastChild=function(el){
            for(var c=el.lastChild;c;c=c.previousSibling)
                if(c.nodeType==1)
                    return c;
        }
        ,children=function(el){
            return sibling(firstChild(el));
        }
        ,compare=function(v1,op,v2){
            switch (op){
                case '='://完全等于
                    return v1 == v2;
                case '*='://包含
                    return v1.indexOf(v2) >= 0;
                case '~='://匹配单词
                    return (' '+v1+' ').indexOf(' '+v2+' ') >= 0;
                case '^='://开头
                    return v1.indexOf(v2)===0;
                case '$='://结尾
                    return v1.substr(-v2.length)==v2;
                case '|='://X或X-开头
                    return v1==v2||v1.substring(0,v2.length+1)==v2+'-';
            }
        }
        ,getByAttr=D.querySelectorAll?function(xpr,ctx){
            ctx = ctx || D;
            var rels = [],els,i=0,l,addid=0;
            if(ctx!==D){
                if(!ctx.getAttribute('id')){
                    ctx.setAttribute('id','__tmpid__');
                    addid=1;
                }
                xpr = '#'+ctx.getAttribute('id')+' '+xpr;
            }
            els = D.querySelectorAll(xpr);
            for(l = els.length;i < l;i++){
                rels[rels.length]=els[i];
            }
            if(addid>0) ctx.removeAttribute('id');
            return rels;
        }:function(xpr,ctx){
            ctx = ctx || D;
            var tag = /([\*a-zA-Z1-6]*)?(\[(\w+)\s*(\^|\$|\*|\||~)?=?\s*([\w\u00C0-\uFFFF\s\-_\.]+)?\])?/,
                m = xpr.match(tag),
                tag = m[1] || '*',
                qattr = m[3],
                op =  m[4]+'=',
                qval = m[5],
                rels = [],
                els,i=0, l;
            els = (tag === '*' && ctx.all)? ctx.all : getByTag(tag,ctx);//IE5.5不支持“*”
            for(l = els.length;i<l;i++){
                if(qval){
                    if(compare(attr(els[i],qattr)||'',op,qval))
                        rels[rels.length]=els[i];
                }else{
                    rels[rels.length]=els[i];
                }
            }
            return rels;
        }
        ,deOrbd=(D.compatMode == 'CSS1Compat' && ua.safari)?'documentElement':'body'
        ,getBox=function(k,el){/*[scroll|offset|client][left|top|height|width]*/
            return (el||D[deOrbd])[k];
        }
        ,setBox=function(k,v,el){
            (el||D[deOrbd])[k]=v;
        }
        ,getXY=div.getBoundingClientRect?function(el){
            var box = el.getBoundingClientRect(), oDoc = el.ownerDocument, _fix = ua.ie ? 2 : 0;
            return [box.left-_fix+getBox('scrollLeft',oDoc), box.top-_fix+getBox('scrollTop',oDoc)];
        }:function(el){
            var t=0,l=0;
            while (el.offsetParent) {
                t += el.offsetTop;
                l += el.offsetLeft;
                el = el.offsetParent;
            }
            return [l,t];
        }
        ,setXY=function(el,x,y){
            var st=el.style,
                ml=parseInt(st.marginLeft)||0,
                mt=parseInt(st.marginTop)||0;
            st.left=parseInt(x)-ml+'px';
            st.top=parseInt(y)-mt+'px';
        }
        ,getSize=function(el) {
            var _fix = [0, 0],st=el.style;
            each(['Left', 'Right', 'Top', 'Bottom'],function(v) {
                _fix[v == 'Left' || v == 'Right' ? 0 : 1] += (parseInt(st['border'+v+'Width'])||0)+(parseInt(st['padding'+v])||0);
            });
            return [el.offsetWidth-_fix[0], el.offsetHeight-_fix[1]];
        }
        ,html=function(el,v){
            if(v===undefined){
                return el.innerHTML;
            }else{
                el.innerHTML=v;
            }
        }
        ,html2fragment=(function(){
            var tmpdiv=D.createElement('div');
            return function(html){
                var frag=D.createDocumentFragment();
                tmpdiv.innerHTML=html;
                for(var c=firstChild(tmpdiv);c;c=next(c))
                    frag.appendChild(c);
                tmpdiv.innerHTML="";
                return frag;
            };
        })();

    var wev=window.event
        ,ev={
        add:ua.ie ? function(el,evName,f){
            el.attachEvent('on'+evName, f);
        }:function(el,evName,f){
            el.addEventListener(evName, f, false);
        }
        ,remove:ua.ie ? function(el,evName,f){
            el.detachEvent('on'+evName, f);
        }:function(el,evName,f){
            el.removeEventListener(evName, f, true);
        }
        ,stop:wev ? function(){
            wev.cancelBubble = true;
            wev.returnValue = false;
        }:function(e){
            e.stopPropagation();
            e.preventDefault();
        }
        ,target:wev ? function(){
            return wev.srcElement;
        }:function(e){
            return e.target;
        }
        ,getPointerXY:wev?function(){
            return [
                wev.clientX+getBox('scrollLeft'),
                wev.clientY+getBox('scrollTop')
            ];
        }:function(e){
            return [e.pageX,e.pageY];
        }
    };

    var ajax={
        getReq:function(){
            var req=null;
            try{
                req=new XMLHttpRequest();
            }catch (e){
                try{
                    req=new ActiveXObject("Msxml2.XMLHTTP");
                }catch (e){
                    req=new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            return req;
        },
        send:function(onwait,onok,ontimeout,method,url,querystr,asyn,timeout,headers){
            timeout=timeout||5000;
            var req=this.getReq(),timer,p;
            timer = setTimeout(function(){ontimeout(req);},timeout);
            req.onreadystatechange=function(){
                if(req.readyState==4 && req.status==200){
                    clearTimeout(timer);
                    onok(req);
                }else{
                    onwait(req);
                }
            };
            req.open(method,url,Boolean(asyn));
            if(method=='POST'){req.setRequestHeader('content-Type','application/x-www-form-urlencoded');}
            if(headers) for(p in headers) req.setRequestHeader(p, headers[p]);
            req.send(querystr);
        },
        get:function(url,onok,onwait,ontimeout,headers){
            this.send(onwait,onok,ontimeout,'GET',url,null,true,0,headers);
        },
        post:function(querystr,url,onok,onwait,ontimeout,headers){
            this.send(onwait,onok,ontimeout,'POST',url,querystr,true,0,headers);
        }
    };

    var wx=function(xpr,ctx,els){
        if(typeof xpr=='function')
            return ev.add(window,'load',xpr);
        return new wx.obj(xpr,ctx,els);
    };

    var _query=getByAttr;
    if(window.query){
        _query=window.query;
    }else if(window.jQuery){
        _query=function(xpr,ctx){
            return window.jQuery(xpr,ctx).get();
        };
    }

    //对象方法
    wx.obj=function(xpr,ctx,els){
        var _els=[];
        if(xpr){
            if(typeof xpr=='string'){
                _els=_query(xpr,ctx);
            }else if(xpr.nodeType){
                _els[_els.length]=xpr;
            }else if(xpr._type_&&xpr._type_=='wx.obj'){
                _els=xpr.els;
            }else if(typeof xpr.length=='number'){
                for(var i= 0,l=xpr.length;i<l;i++)
                    if(typeof xpr[i]=='string')
                        _els=merge(_els,_query(xpr[i],ctx));
                    else if(xpr[i])
                        _els[_els.length]=xpr[i];
            }
        }

        this.els=merge(_els,els);
    };

    wx.obj.prototype={
        _type_:'wx.obj'
        ,len:function(){
            return this.els.length;
        }
        ,each:function(f){
            each(this.els,f);
            return this;
        }
        ,css:function(k,v){
            var _els=this.els;
            if(typeof k=='object'||v!==undefined)
                each(_els,function(el){
                    css(el,k,v);
                });
            else
                return _els[0]?css(_els[0],k):'';
            return this;
        }
        ,attr:function(k,v){
            var _els=this.els;
            if(typeof k=='object'||v!==undefined)
                each(_els,function(el){
                    attr(el,k,v);
                });
            else
                return _els[0]?attr(_els[0],k):'';
            return this;
        }
        ,hide:function(){
            each(this.els,function(el){
                if(!attr(el,'oldshow')){
                    var t=css(el,'display');
                    if(t&&t!='none')
                        attr(el,'oldshow',t);
                }
                css(el,'display','none');
            });
            return this;
        }
        ,show:function(){
            each(this.els,function(el){
                css(el,'display',attr(el,'oldshow')||'');
            });
            return this;
        }
        ,toggle:function(){
            each(this.els,function(el){
                alert(css(el,'display'));
                if(css(el,'display')=='none')
                    css(el,'display',attr(el,'oldshow')||'');
                else{
                    if(!attr(el,'oldshow')){
                        var t=css(el,'display');
                        if(t&&t!='none')
                            attr(el,'oldshow',t);
                    }
                    css(el,'display','none');
                }
            });
            return this;
        }
        ,addClass:function(c){
            each(this.els,function(el){
                var cs=attr(el,'class')||'';
                if((' '+cs+' ').indexOf(' '+c+' ')==-1)
                    attr(el,'class',trim(cs+' '+c));
            });
            return this;
        }
        ,removeClass:function(c){
            each(this.els,function(el){
                var cs=attr(el,'class')||'';
                if((' '+cs+' ').indexOf(' '+c+' ')!=-1)
                    attr(el,'class',trim((' '+cs+' ').replace(' '+c+' ','')));
            });
            return this;
        }
        ,toggleClass:function(c){
            each(this.els,function(el){
                var cs=attr(el,'class')||'';
                if (-1==(' '+cs+' ').indexOf(' '+c+' '))
                    attr(el,'class',trim(cs+' '+c));
                else
                    attr(el,'class',trim((' '+cs+' ').replace(' '+c+' ','')));
            });
            return this;
        }
        ,children:function(){
            var r=[];
            if(this.els[0])
                r=children(this.els[0]);
            return wx(r);
        }
        ,firstChild:function(){
            var r;
            if(this.els[0])
                r=firstChild(this.els[0]);
            return wx(r);
        }
        ,lastChild:function(){
            var r;
            if(this.els[0])
                r=lastChild(this.els[0]);
            return wx(r);
        }
        ,prev:function(){
            var pr;
            if(this.els[0])
                pr=prev(this.els[0]);
            return wx(pr);
        }
        ,next:function(){
            var pr;
            if(this.els[0]){
                pr=next(this.els[0]);
            }
            return wx(pr);
        }
        ,parent:function(){
            var p;
            if(this.els[0])
                p=this.els[0].parentNode;
            return wx(p);
        }
        ,addBefore:function(el){
            if(this.els[0])
                addBefore(el,this.els[0]);
            return this;
        }
        ,addAfter:function(el){
            if(this.els[0])
                addAfter(el,this.els[0]);
            return this;
        }
        ,getXY:function(ctx){
            if(this.els[0])
                return getXY(this.els[0],ctx);
            return [0,0];
        }
        ,setXY:function(x,y){
            if(this.els[0])
                return setXY(this.els[0],x,y);
            return [0,0];
        }
        ,html:function(v){
            if(v!==undefined){
                each(this.els,function(el){
                    html(el,v);
                });
                return this;
            }else{
                var s='';
                if(this.els[0])
                    s=this.els[0].innerHTML;
                return s;
            }
        }
        ,val:function(v){
            if(v!==undefined){
                each(this.els,function(el){
                    el.value = v;
                });
                return this;
            }else{
                var s='';
                if(this.els[0])
                    s=this.els[0].value;
                return s;
            }
        }
        ,on:function(k,v){
            if(v!==undefined) k={k:v};
            for(var p in k){
                each(this.els,function(el){
                    ev.add(el,p,k[p]);
                });
            }
            return this;
        }
    };

    //静态方法
    wx.compat={
        attrFor:attrFor
        ,attrClass:attrClass
        ,floatProp:floatProp
    };
    wx.ev=ev;
    wx.ua=ua;
    wx.fn={
        et:et
        ,$a:$a
        ,each:each
        ,merge:merge
        ,ltrim:ltrim
        ,rtrim:rtrim
        ,trim:trim
        ,stripTag:stripTag
        ,addSlash:addSlash
        ,stripSlash:stripSlash
        ,txt2json:txt2json
        ,inArray:inArray
        ,compare:compare
    };
    wx.ajax=ajax;
    wx.dom={
        loadScript:loadScript
        ,get:_query
        ,getById:getById
        ,getByClass:getByClass
        ,getByAttr:getByAttr
        ,attr:attr
        ,css:css
        ,prev:prev
        ,next:next
        ,addBefore:addBefore
        ,addAfter:addAfter
        ,destroy:destroy
        ,sibling:sibling
        ,children:children
        ,firstChild:firstChild
        ,lastChild:lastChild
        ,getBox:getBox
        ,setBox:setBox
        ,getXY:getXY
        ,setXY:setXY
        ,getSize:getSize
        ,html:html
        ,html2fragment:html2fragment
    };

    if(window.load&&window.load.modules){
        window.load.modules['wx'].obj=wx;
    }

    return wx;
}(window);