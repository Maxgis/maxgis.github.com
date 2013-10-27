window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1000/60)}})();var max={};max.Map=function(b,a){this._canvas=document.getElementById(b);this._context=this._canvas.getContext("2d");this._layers=[];this.extent=a;this.width=canvas.width;this.height=canvas.height;this.resolutions=[156543.0339280406,78271.51696402031,39135.75848201016,19567.87924100508,9783.939620502539,4891.96981025127,2445.984905125635,1222.992452562817,611.4962262814087,305.7481131407043,152.8740565703522,76.43702828517608,38.21851414258804,19.10925707129402,9.554628535647009];this.init();this.wkid=102100;this._pub=new max.event.Publisher();this._sub=new max.event.Subscriber();this.filter=null};max.Map.prototype={init:function(){this.resolution=(this.extent.xmax-this.extent.xmin)/(this._canvas.width);for(var b in this.resolutions){if(this.resolutions[b]<=this.resolution){this.resolution=this.resolutions[b];break}}this.originPoint={x:this.extent.xmin,y:this.extent.ymax};this.extent.xmax=this.extent.xmin+this.resolution*this._canvas.width;this.extent.ymin=this.extent.ymax-this.resolution*this._canvas.height;var c=this;this.dragMap();this.scrollMap();this._addAllEvent();var a=function(){c.draw.call(c);requestAnimFrame(a)};a()},addLayer:function(c,a){for(var b in this._layers){if(this._layers[b]===c){return false}}if(typeof a==="undefined"){this._layers.push(c)}else{if(a<0){a=0}a=a>this._layers.length?this._layers.length:a;this._layers.splice(a,0,c)}c.parentMap=this;this.load(c)},removeLayer:function(b){b.parentMap=null;for(var a in this._layers){if(this._layers[a]===b){this._layers.splice(a,1);return true}}return false},removeLayerByIndex:function(a){if(a>=this._layers.length||a<0){return false}else{this._layers.splice(a,0,layer)}},getLayers:function(){return this._layers},load:function(a){a.load(this)},update:function(){},mapClientToMap:function(b){var a=b.x*this.resolution+this.originPoint.x;var c=this.originPoint.y-b.y*this.resolution;return{x:a,y:c}},draw:function(){this._context.clearRect(0,0,this._canvas.width,this._canvas.height);for(var b in this._layers){var a=this._layers[b];a.draw()}if(typeof this.filter==="function"){try{var d=this._context.getImageData(0,0,this._canvas.width,this._canvas.height);d=this.filter(d);this._context.putImageData(d,0,0)}catch(c){}}},dragMap:function(){var d=null;var b=this;var c=false;var a=function(g){d=max.util.windowToMapClient(b._canvas,g.clientX,g.clientY);c=true;var f=function(m){if(c){var l=max.util.windowToMapClient(b._canvas,m.clientX,m.clientY);var h=l.x-d.x;var n=l.y-d.y;d=l;b.originPoint.x-=h*b.resolution;b.originPoint.y+=n*b.resolution;b.extent={xmin:b.originPoint.x,ymin:b.originPoint.y-b._canvas.height*b.resolution,xmax:b.originPoint.x+b._canvas.width*b.resolution,ymax:b.originPoint.y};for(var k in b._layers){var j=b._layers[k];j.ondrag()}}};var e=function(h){d=null;c=false;max.event.removeHandler(b._canvas,"mousemove",f);max.event.removeHandler(document,"mouseup",e)};max.event.addHandler(b._canvas,"mousemove",f);max.event.addHandler(document,"mouseup",e)};max.event.addHandler(this._canvas,"mousedown",a)},scrollMap:function(){var a=this;var b=function(h){var k=max.util.windowToMapClient(a._canvas,h.clientX,h.clientY);var c=a.mapClientToMap(k);if(h.wheelDelta>0){for(var e in a.resolutions){if(a.resolutions[e]<a.resolution){if(a.resolutions[e]===a.resolution){return false}var j=a.resolution;a.resolution=a.resolutions[e];var g=j/a.resolution;var f=a.originPoint.x+(c.x-a.originPoint.x)/g;var d=a.originPoint.y+(c.y-a.originPoint.y)/g;break}}}else{for(var e in a.resolutions){if(a.resolutions[e]<=a.resolution){var j=a.resolution;if(e==0){a.resolution=a.resolutions[0]}else{a.resolution=a.resolutions[e-1]}if(a.resolutions[e]===a.resolution){return false}var g=a.resolution/j;var f=a.originPoint.x+(a.originPoint.x-c.x)*(g-1);var d=a.originPoint.y+(a.originPoint.y-c.y)*(g-1);break}}}a.originPoint.x=f;a.originPoint.y=d;a.extent={xmin:f,ymin:d-a._canvas.height*a.resolution,xmax:f+a._canvas.width*a.resolution,ymax:d};for(var e in a._layers){a._layers[e].load()}};if(typeof this._canvas.onmousewheel!=="undefined"){max.event.addHandler(this._canvas,"mousewheel",b)}else{max.event.addHandler(this._canvas,"wheel",b)}},addEventListener:function(b,a){this._sub.bind(this._pub,b,a)},removeEventListener:function(b,a){this._sub.unbind(this._pub,b,a)},_addAllEvent:function(){var c=this;var d=null;var a=null;var e=function(f){var g=max.util.windowToMapClient(c._canvas,f.clientX,f.clientY);f.clientPosition=g;f.mapPosition={x:c.originPoint.x-c.resolution*g.x,y:c.originPoint.y-c.resolution*g.y};return f};var b=function(f){max.event.addHandler(c._canvas,f,function(g){if(a===null){return false}g=e(g);g.graphic=d;c._pub.triggerDirectToSub(a._sub,"on"+f,g)})};b("click");b("mouseup");b("mousedown");b("dblclick");b("keydown");b("keypress");b("keyup");max.event.addHandler(this._canvas,"mousemove",function(f){var j=null;var q=null;var o=max.util.windowToMapClient(c._canvas,f.clientX,f.clientY);var h=c._layers.length;var p=false;for(var k=h-1;k!=-1;--k){var n=c._layers[k];var m=n._mousePointInLayer(o.x,o.y);if(m!==null){j=m;q=m.parentLayer;p=true;break}}if(!p){if(d!==null){f=e(f);f.graphic=d;c._pub.triggerDirectToSub(a._sub,"onmouseout",f)}d=null;a=null}else{if(d===null){f=e(f);f.graphic=j;c._pub.triggerDirectToSub(q._sub,"onmouseover",f)}else{if(j===d){f=e(f);f.graphic=d;c._pub.triggerDirectToSub(a._sub,"onmousemove",f)}else{f=e(f);f.graphic=d;c._pub.triggerDirectToSub(a._sub,"onmouseout",f);f.graphic=j;c._pub.triggerDirectToSub(q._sub,"onmouseover",f)}}d=j;a=q}});max.event.addHandler(this._canvas,"mouseout",function(f){if(d!==null){event=e(event);event.graphic=d;c._pub.triggerDirectToSub(a._sub,"onmouseout",event);d=null;a=null}})}};max.Extent=function(a){this.xmin=a.xmin;this.xmax=a.xmax;this.ymin=a.ymin;this.ymax=a.ymax};max.Geometry={};max.tools={};max.event={addHandler:function(a,c,b){if(a.addEventListener){a.addEventListener(c,b,false)}else{if(a.attachEvent){a.attachEvent("on"+c,b)}else{}}},removeHandler:function(a,c,b){if(a.removeEventListener){a.removeEventListener(c,b,false)}else{if(a.detachEvent){a.detachEvent("on"+c,b)}else{a["on"+c]=null}}}};max.event.Subscriber=function(){this.items=[]};max.event.Subscriber.prototype={bind:function(b,a,c){if(typeof(a)!="string"){return false}b._add(this,a,c);return true},unbind:function(b,c,a){b._remove(this,c,a)}};max.event.SubTypeItem=function(a){if(typeof(a)!="undefiend"){this.type=a;this.list=[]}else{return false}};max.event.SubItem=function(a,b){this.sub=a;this.callback=b};max.event.Publisher=function(){this.items=[]};max.event.Publisher.prototype={_add:function(d,c,f){if(typeof(c)!="string"){return false}var e=null;for(var b in this.items){if(this.items[b].type==c){e=this.items[b]}}if(e==null){e=new max.event.SubTypeItem(c);this.items.push(e)}var a=new max.event.SubItem(d,f);e.list.push(a)},_remove:function(a,g,k){var l=false;var h=false;if(typeof g=="undefined"){l=true}if(typeof k=="undefined"){h=true}for(var e=this.items.length-1;e!=-1;--e){var c=this.items[e].list;var f=this.items[e].type;for(var d=c.length-1;d!=-1;--d){var b=c[d];if(a==b.sub){if(l||g==f){if(l||h||b.callback==k){c[d].callback();c.splice(d,1)}}}}if(c.length==0){this.items.splice(e,1)}}},trigger:function(d,e){for(var c in this.items){var b=this.items[c];if(b.type==d){for(var a in b.list){var f=b.list[a];if(typeof f.callback=="function"){f.callback(e)}}}}},triggerDirectToSub:function(e,d,f){for(var c in this.items){var b=this.items[c];if(b.type==d){for(var a in b.list){var g=b.list[a];if(g.sub!==e){continue}if(typeof g.callback=="function"){g.callback(f)}}}}}};max.Layer=function(){this._sub=new max.event.Subscriber();this._eventList=[]};max.Layer.prototype={ondrag:function(){},load:function(){},addEventListener:function(b,a){var c=this;this._sub.bind(this.parentMap._pub,b,function(d){a(d)})},removeEventListner:function(b,a){this._sub.unbind(this.parentMap._sub,b,a)},_mousePointInLayer:function(){return null}};max.Layer.TileLayer=function(a){this.serviceUrl=a;this.parentMap=null;this._imageList=[];this.scaleRate=1;this.cors=false};max.Layer.TileLayer.prototype=new max.Layer();max.Layer.TileLayer.prototype.init=function(){};max.Layer.TileLayer.prototype._calImage=function(e){var b=this.parentMap.extent;var f=Math.floor((b.xmin-this.originPoint.x)/this.picWidth/this.resolution);var c=Math.ceil((b.xmax-this.originPoint.x)/this.picWidth/this.resolution)-1;var d=Math.floor((this.originPoint.y-b.ymin)/this.picHeight/this.resolution);var a=Math.ceil((this.originPoint.y-b.ymax)/this.picHeight/this.resolution)-1;f=f<this._imageRectangle.lmin?this._imageRectangle.lmin:f;c=c>this._imageRectangle.lmax?this._imageRectangle.lmax:c;a=a<this._imageRectangle.dmin?this._imageRectangle.dmin:a;d=d>this._imageRectangle.dmax?this._imageRectangle.dmax:d;return{lmin:f,lmax:c,dmin:a,dmax:d,z:this.z,resolution:this.resolution}};max.Layer.TileLayer.prototype.updateScale=function(a){var a=this.parentMap;var j=this.fullExtent;var h=0;var d=0;for(var e in this.resolutions){if(a.resolution>=this.resolutions[e]){h=e-0+1;d=this.resolutions[e];break}}this.resolution=d;this.z=h;var b=Math.floor((j.xmin-this.originPoint.x)/this.picWidth/this.resolution);var f=Math.ceil((j.xmax-this.originPoint.x)/this.picWidth/this.resolution)-1;var g=Math.floor((this.originPoint.y-j.ymin)/this.picHeight/this.resolution);var c=Math.ceil((this.originPoint.y-j.ymax)/this.picHeight/this.resolution)-1;this._imageRectangle={lmin:b,lmax:f,dmin:c,dmax:g};this.scaleRate=a.resolution/this.resolution};max.Layer.TileLayer.prototype.load=function(){this.updateScale();if(this.parentMap){var a=this._calImage(this.parentMap)}else{return false}this._updateImageList(a)};max.Layer.TileLayer.prototype.draw=function(){if(this.parentMap){for(var c in this._imageList){var a=this._imageList[c];var b=this.parentMap._context;if(a.isonload===true){b.drawImage(a.image,0,0,this.picWidth,this.picHeight,a.x,a.y,this.picWidth/this.scaleRate,this.picHeight/this.scaleRate)}}}};max.Layer.TileLayer.prototype.ondrag=function(){if(this.parentMap){for(var a=this._imageList.length-1;a!=-1;--a){var b=this._imageList[a];b.update();if(b.pz!==this.z){this._imageList.splice(a,1);delete b;b=null;break}if(b.x<0-b.layer.picWidth*(b.layer.scaleRate)){this._imageList.splice(a,1);delete b;b=null;break}if(b.y<0-b.layer.picHeight*(b.layer.scaleRate)){this._imageList.splice(a,1);delete b;b=null;break}if(b.x>b.layer.parentMap._canvas.width*(b.layer.scaleRate)){this._imageList.splice(a,1);delete b;b=null;break}if(b.y>b.layer.parentMap._canvas.height*(b.layer.scaleRate)){this._imageList.splice(a,1);delete b;b=null;break}}var c=this._calImage(this.parentMap);this._updateImageList(c)}};max.Layer._TitleImage=function(b,d,i,h,g,a,c,f){this.image=new Image();if(f===true){this.image.crossOrigin="Anonymous"}var e=this;this.image.onload=function(){e.imageOnLoad(e)};this.image.src=b;this.layer=d;this.px=i;this.py=h;this.pz=g;this.xmin=a;this.ymax=c;this.isonload=false};max.Layer._TitleImage.prototype={imageOnLoad:function(a){a.isonload=true;a.update.call(a)},update:function(){if(this.layer.parentMap){var c=this.layer.parentMap;var b=c.originPoint;var a=(this.xmin-b.x)/c.resolution;var d=(b.y-this.ymax)/c.resolution;this.x=a;this.y=d}}};max.Layer.GoogleLayer=function(a){this.serviceUrl=a;this._imageList=[];this.cors=true;this.fullExtent=new max.Extent({xmin:-20037508.3427892,ymin:-20037508.3427892,xmax:20037508.3427892,ymax:20037508.3427892});this.originPoint={x:-20037508.3427892,y:20037508.3427892};this.picWidth=256;this.picHeight=256;this.wkid=102100;this.resolutions=[78271.51696402031,39135.75848201016,19567.87924100508,9783.939620502539,4891.96981025127,2445.984905125635,1222.992452562817,611.4962262814087,305.7481131407043,152.8740565703522,76.43702828517608,38.21851414258804,19.10925707129402,9.554628535647009];this.init()};max.Layer.GoogleLayer.prototype=new max.Layer.TileLayer();max.Layer.GoogleLayer.prototype._updateImageList=function(l){this._imageList=[];for(var g=l.lmin;g<=l.lmax;++g){for(var f=l.dmin;f<=l.dmax;++f){var b=this.serviceUrl+"x="+g+"&y="+f+"&z="+l.z;var a=g*this.picWidth*l.resolution+this.originPoint.x;var c=this.originPoint.y-f*this.picHeight*l.resolution;for(var e in this._imageList){var h=this._imageList[e];if(h.url===b){break}}var d=new max.Layer._TitleImage(b,this,g,f,l.z,a,c,this.cors);this._imageList.push(d)}}};max.Layer.OpenStreetLayer=function(a){this.serviceUrl=a;this._imageList=[];this.cors=true;this.fullExtent=new max.Extent({xmin:-20037508.3427892,ymin:-20037508.3427892,xmax:20037508.3427892,ymax:20037508.3427892});this.originPoint={x:-20037508.3427892,y:20037508.3427892};this.picWidth=256;this.picHeight=256;this.wkid=102100;this.resolutions=[78271.51696402031,39135.75848201016,19567.87924100508,9783.939620502539,4891.96981025127,2445.984905125635,1222.992452562817,611.4962262814087,305.7481131407043,152.8740565703522,76.43702828517608,38.21851414258804,19.10925707129402,9.554628535647009];this.init()};max.Layer.OpenStreetLayer.prototype=new max.Layer.TileLayer();max.Layer.OpenStreetLayer.prototype._updateImageList=function(l){this._imageList=[];for(var g=l.lmin;g<=l.lmax;++g){for(var f=l.dmin;f<=l.dmax;++f){var b=this.serviceUrl+"/"+l.z+"/"+g+"/"+f+".jpg";var a=g*this.picWidth*l.resolution+this.originPoint.x;var c=this.originPoint.y-f*this.picHeight*l.resolution;for(var e in this._imageList){var h=this._imageList[e];if(h.url===b){break}}var d=new max.Layer._TitleImage(b,this,g,f,l.z,a,c,this.cors);this._imageList.push(d)}}};max.Layer.BingMapsLayer=function(a){this.serviceUrl=a;this._imageList=[];this.cors=false;this.fullExtent=new max.Extent({xmin:-20037508.3427892,ymin:-20037508.3427892,xmax:20037508.3427892,ymax:20037508.3427892});this.originPoint={x:-20037508.3427892,y:20037508.3427892};this.picWidth=256;this.picHeight=256;this.wkid=102100;this.resolutions=[78271.51696402031,39135.75848201016,19567.87924100508,9783.939620502539,4891.96981025127,2445.984905125635,1222.992452562817,611.4962262814087,305.7481131407043,152.8740565703522,76.43702828517608,38.21851414258804,19.10925707129402,9.554628535647009];this.init()};max.Layer.BingMapsLayer.prototype=new max.Layer.TileLayer();max.Layer.BingMapsLayer.prototype._updateImageList=function(p){this._imageList=[];var n=p.z;for(var l=p.lmin;l<=p.lmax;++l){for(var h=p.dmin;h<=p.dmax;++h){_f=function(k,i){var j=k.toString(2)+"";for(;j.length<i;){j="0"+j}return j};var o=_f(l,n);var f=_f(h,n);var a="";for(var g=0;g!=n;++g){a+=f[g]+o[g]}a=parseInt(a,2).toString(4);var c=this.serviceUrl+"r"+a+"?g=103&mkt=zh-cn&n=z";var b=l*this.picWidth*p.resolution+this.originPoint.x;var d=this.originPoint.y-h*this.picHeight*p.resolution;for(var g in this._imageList){var m=this._imageList[g];if(m.url===c){break}}var e=new max.Layer._TitleImage(c,this,l,h,p.z,b,d);this._imageList.push(e)}}};max.Layer.AMapLayer=function(a){this.serviceUrl=a;this._imageList=[];this.cors=false;this.fullExtent=new max.Extent({xmin:-20037508.3427892,ymin:-20037508.3427892,xmax:20037508.3427892,ymax:20037508.3427892});this.originPoint={x:-20037508.3427892,y:20037508.3427892};this.picWidth=256;this.picHeight=256;this.wkid=102100;this.resolutions=[78271.51696402031,39135.75848201016,19567.87924100508,9783.939620502539,4891.96981025127,2445.984905125635,1222.992452562817,611.4962262814087,305.7481131407043,152.8740565703522,76.43702828517608,38.21851414258804,19.10925707129402,9.554628535647009];this.init()};max.Layer.AMapLayer.prototype=new max.Layer.TileLayer();max.Layer.AMapLayer.prototype._updateImageList=function(l){this._imageList=[];for(var g=l.lmin;g<=l.lmax;++g){for(var f=l.dmin;f<=l.dmax;++f){var b=this.serviceUrl+"&x="+g+"&y="+f+"&z="+l.z;var a=g*this.picWidth*l.resolution+this.originPoint.x;var c=this.originPoint.y-f*this.picHeight*l.resolution;for(var e in this._imageList){var h=this._imageList[e];if(h.url===b){break}}var d=new max.Layer._TitleImage(b,this,g,f,l.z,a,c);this._imageList.push(d)}}};max.Layer.AGSTileLayer=function(a){this.serviceUrl=a;this._imageList=[];this.cors=false;this.fullExtent=new max.Extent({xmin:-20037508.3427892,ymin:-20037508.3427892,xmax:20037508.3427892,ymax:20037508.3427892});this.originPoint={x:-20037508.3427892,y:20037508.3427892};this.picWidth=256;this.picHeight=256;this.wkid=102100;this.resolutions=[1591657527.591555,78271.51696402031,39135.75848201016,19567.87924100508,9783.939620502539,4891.96981025127,2445.984905125635,1222.992452562817,611.4962262814087,305.7481131407043,152.8740565703522,76.43702828517608,38.21851414258804,19.10925707129402,9.554628535647009];this.init()};max.Layer.AGSTileLayer.prototype=new max.Layer.TileLayer();max.Layer.AGSTileLayer.prototype._updateImageList=function(l){this._imageList=[];for(var g=l.lmin;g<=l.lmax;++g){for(var f=l.dmin;f<=l.dmax;++f){if(this.serviceUrl[this.serviceUrl.length-1]!=="/"){this.serviceUrl+="/"}var b=this.serviceUrl+"tile/"+(l.z-1)+"/"+f+"/"+g;var a=g*this.picWidth*l.resolution+this.originPoint.x;var c=this.originPoint.y-f*this.picHeight*l.resolution;for(var e in this._imageList){var h=this._imageList[e];if(h.url===b){break}}var d=new max.Layer._TitleImage(b,this,g,f,l.z,a,c);this._imageList.push(d)}}};max.Layer.GraphicsLayer=function(){max.Layer.call(this);this.graphics=[]};max.Layer.GraphicsLayer.prototype=new max.Layer();max.Layer.GraphicsLayer.prototype.addGraphic=function(b){for(var a in this.graphics){if(this.graphics[a]===b){return false}}b.parentLayer=this;this.graphics.push(b)};max.Layer.GraphicsLayer.prototype.removeGraphic=function(b){for(var a in this.graphics){if(this.graphics[a]===b){this.graphics.splice(a,1);return true}}return false};max.Layer.GraphicsLayer.prototype.removeAllGraphics=function(){this.graphics=[]};max.Layer.GraphicsLayer.prototype.draw=function(){for(var a in this.graphics){this.graphics[a].draw(this.parentMap)}this._eventList=[]};max.Layer.GraphicsLayer.prototype._mousePointInLayer=function(a,d){var b=this.graphics.length;for(var c=b-1;c!=-1;--c){if(this.graphics[c]._mousePointInGraphic(a,d)){return this.graphics[c]}}return null};max.Geometry.Graphic=function(c,a,b){this.geometry=c;this.attribute=a||{};if(typeof b==="undefined"){if(c.geometryType==="POINT"){this.symbol=new max.Symbol.SimpleMarkerSymbol({fillStyle:"rgba(30,113,240,0.8)",fillSize:8})}else{if(c.geometryType==="LINE"){this.symbol=new max.Symbol.SimpleLineSymbol({lineStyle:"rgba(30,113,240,0.8)",lineWidth:4})}else{if(c.geometryType==="POLYGON"){this.symbol=new max.Symbol.SimpleFillSymbol({fillStyle:"rgba(30,113,240,0.8)"})}}}}else{this.symbol=max.util.clone(b)}this.parentLayer=null};max.Geometry.Graphic.prototype={draw:function(a){this.geometry.draw(a,this.symbol)},_mousePointInGraphic:function(c,e){var d=this.parentLayer.parentMap;if(this.geometry.getPath(d,this.symbol)){if(this.geometry.geometryType!=="LINE"){return this.parentLayer.parentMap._context.isPointInPath(c,e)}else{this.parentLayer.parentMap._context.save();this.parentLayer.parentMap._context.lineWidth=this.symbol.lineWidth;this.parentLayer.parentMap._context.lineCap="round";this.parentLayer.parentMap._context.lineJoin="round";var a=this.parentLayer.parentMap._context.isPointInStroke(c,e);this.parentLayer.parentMap._context.restore();return a}}else{return false}}};max.Geometry.Geometry=function(){};max.Geometry.Geometry.prototype={_getWebMercatorPaths:function(){if(this.wkid==102100){this.webMercatorPaths=max.util.clone(this.paths)}else{if(this.wkid==4326){var e=[];for(var b in this.paths){var c=this.paths[b];var d=[];for(var a in c){d.push(max.util.lonLat2WebMercator(c[a]))}e.push(d)}this.webMercatorPaths=e}}},addPoint:function(b,g,a,e){if(this.geometryType==="POINT"){return false}var c=this.paths.length;if(c==0){this.addPath()}if(typeof a!=="number"||a<0||a>=c){a=Math.max(0,c-1)}var d=this.paths[a].length;if(typeof e!=="number"||e<0||e>=d){e=d}var f={x:b,y:g};this.paths[a].splice(e,0,f);if(this.wkid==102100){this.webMercatorPaths[a].splice(e,0,f)}else{if(this.wkid==4326){this.webMercatorPaths[a].splice(e,0,max.util.lonLat2WebMercator(f))}}},removePoint:function(a,d){if(this.geometryType==="POINT"){return false}else{var b=this.paths.length;if(typeof a!=="number"||a<0||a>=b){return false}var c=this.paths[a].length;if(typeof d!=="number"||d<0||d>=c){return false}this.paths[a].splice(d,1);this.webMercatorPaths[a].splice(d,1)}},addPath:function(c){if(this.geometryType==="POINT"){return false}var a=this.paths.length;this.paths.push([]);this.webMercatorPaths.push([]);if(Object.prototype.toString.call(c)!=="[object Array]"){return false}for(var b in c){this.paths[a].push(c[b]);if(this.wkid==102100){this.webMercatorPaths.push(c[b])}else{if(this.wkid==4326){this.webMercatorPaths.push(max.util.lonLat2WebMercator(c[b]))}}}},updatePoint:function(b,g,a,e){if(this.geometryType==="POINT"){this.x=b;this.y=g;this._getWebMercatorPoint()}else{var c=this.paths.length;if(typeof a!=="number"||a<0||a>=c){return false}var d=this.paths[a].length;if(typeof e!=="number"||e<0||e>=d){return false}this.paths[a][e]={x:b,y:g};if(this.wkid==102100){this.webMercatorPaths[a][e]={x:b,y:g}}else{if(this.wkid==4326){var f=max.util.lonLat2WebMercator({x:b,y:g});this.webMercatorPaths[a][e]=f}}}}};max.Geometry.Point=function(a,c,b){this.geometryType="POINT";this.x=a;this.y=c;if(typeof b!=="undefined"){this.wkid=b.wkid?b.wkid:4326}else{this.wkid=4326}this.webMercatorPoint={};this._getWebMercatorPoint()};max.Geometry.Point.prototype=new max.Geometry.Geometry();max.Geometry.Point.prototype.draw=function(e,c){var d=max.util.webMercatorToMapClient(e,this.webMercatorPoint.x,this.webMercatorPoint.y);var a=d.x;var f=d.y;var b=e._context;if(a<0||f<0||a>e._canvas.width||f>e._canvas.height){return false}b.save();if(c.SymbolType=="SimpleMarkerSymbol"){b.beginPath();b.fillStyle=c.fillStyle;if(c.style=="CIRCLE"){b.arc(a,f,c.fillSize,0,Math.PI*2,true)}b.fill()}else{}b.restore()};max.Geometry.Point.prototype.getPath=function(d,c){var a=(this.webMercatorPoint.x-d.originPoint.x)/d.resolution;var e=(d.originPoint.y-this.webMercatorPoint.y)/d.resolution;var b=d._context;if(a<0||e<0||a>d._canvas.width||e>d._canvas.height){return false}b.beginPath();if(c.SymbolType=="SimpleMarkerSymbol"){if(c.style=="CIRCLE"){b.arc(a,e,c.fillSize,0,Math.PI*2,true)}}else{}return true};max.Geometry.Point.prototype._getWebMercatorPoint=function(){if(this.wkid==102100){this.webMercatorPoint.x=this.x;this.webMercatorPoint.y=this.y}else{if(this.wkid==4326){this.webMercatorPoint=max.util.lonLat2WebMercator(this)}}};max.Geometry.Line=function(b,a){this.geometryType="LINE";this.paths=b;if(typeof a!=="undefined"){this.wkid=a.wkid?a.wkid:4326}else{this.wkid=4326}this.webMercatorPoint={};this._getWebMercatorPaths()};max.Geometry.Line.prototype=new max.Geometry.Geometry();max.Geometry.Line.prototype.getPath=function(a,d){var c=a._context;if(d.SymbolType=="SimpleLineSymbol"){c.beginPath();for(var g in this.webMercatorPaths){var k=this.webMercatorPaths[g];if(k.length>0){var b=max.util.webMercatorToMapClient(a,k[0].x,k[0].y);c.moveTo(b.x,b.y);var e=k.length;for(var f=1;f!=e;++f){var h=max.util.webMercatorToMapClient(a,k[f].x,k[f].y);c.lineTo(h.x,h.y)}}}}else{}return true};max.Geometry.Line.prototype.draw=function(a,d){var c=a._context;c.save();c.lineWidth=d.lineWidth;c.strokeStyle=d.lineStyle;c.lineCap="round";c.lineJoin="round";if(d.SymbolType=="SimpleLineSymbol"){c.beginPath();for(var g in this.webMercatorPaths){var k=this.webMercatorPaths[g];if(k.length>0){var b=max.util.webMercatorToMapClient(a,k[0].x,k[0].y);c.moveTo(b.x,b.y);var e=k.length;for(var f=1;f!=e;++f){var h=max.util.webMercatorToMapClient(a,k[f].x,k[f].y);c.lineTo(h.x,h.y)}}}c.stroke()}else{}c.restore()};max.Geometry.Polygon=function(b,a){this.geometryType="POLYGON";this.paths=b;if(typeof a!=="undefined"){this.wkid=a.wkid?a.wkid:4326}else{this.wkid=4326}this.webMercatorPoint={};this._getWebMercatorPaths()};max.Geometry.Polygon.prototype=new max.Geometry.Geometry();max.Geometry.Polygon.prototype.getPath=function(a,d){var c=a._context;if(d.SymbolType=="SimpleFillSymbol"){c.beginPath();for(var g in this.webMercatorPaths){var k=this.webMercatorPaths[g];if(k.length>0){var b=max.util.webMercatorToMapClient(a,k[0].x,k[0].y);c.moveTo(b.x,b.y);var e=k.length;for(var f=1;f!=e;++f){var h=max.util.webMercatorToMapClient(a,k[f].x,k[f].y);c.lineTo(h.x,h.y)}c.closePath()}}}else{}return true};max.Geometry.Polygon.prototype.draw=function(a,d){var c=a._context;c.save();c.fillStyle=d.fillStyle;if(d.SymbolType=="SimpleFillSymbol"){c.beginPath();for(var g in this.webMercatorPaths){var k=this.webMercatorPaths[g];if(k.length>0){var b=max.util.webMercatorToMapClient(a,k[0].x,k[0].y);c.moveTo(b.x,b.y);var e=k.length;for(var f=1;f!=e;++f){var h=max.util.webMercatorToMapClient(a,k[f].x,k[f].y);c.lineTo(h.x,h.y)}c.closePath()}}c.stroke();c.fill()}else{}c.restore()};max.Symbol=function(a){this.fillStyle=a.fillStyle?a.fillStyle:"rgba(0,0,0,1)";this.fillSize=a.fillSize?a.fillSize:8;this.lineWidth=a.lineWidth?a.lineWidth:4;this.lineStyle=a.lineStyle?a.lineStyle:"rgba(0,0,0,1)"};max.Symbol.SimpleMarkerSymbol=function(a){max.Symbol.call(this,a);this.SymbolType="SimpleMarkerSymbol";this.style=a.style?a.style:"CIRCLE"};max.Symbol.SimpleLineSymbol=function(a){max.Symbol.call(this,a);this.SymbolType="SimpleLineSymbol"};max.Symbol.SimpleFillSymbol=function(a){max.Symbol.call(this,a);this.SymbolType="SimpleFillSymbol"};max.util={windowToMapClient:function(b,a,d){var c=b.getBoundingClientRect();return{x:a-c.left-(c.width-b.width)/2,y:d-c.top-(c.height-b.height)/2}},lonLat2WebMercator:function(e){if((Math.abs(e.x)>180||Math.abs(e.y)>90)){return}var d=e.x*0.017453292519943295;var b=6378137*d;var c=e.y*0.017453292519943295;var f=3189068.5*Math.log((1+Math.sin(c))/(1-Math.sin(c)));return{x:b,y:f}},webMercatorTOLonLat:function(b){if((Math.abs(b.x)>20037508.3427892)||(Math.abs(b.y)>20037508.3427892)){return}var a=b.x;var h=b.y;var g=a/6378137;var f=g*57.29577951308232;var e=Math.floor(((f+180)/360));var d=f-(e*360);var c=1.5707963267948966-(2*Math.atan(Math.exp((-1*h)/6378137)));a=d;h=c*57.29577951308232;return{x:a,y:h}},webMercatorToMapClient:function(d,a,e){var b=(a-d.originPoint.x)/d.resolution;var c=(d.originPoint.y-e)/d.resolution;return{x:b,y:c}},mapClientToWebMercator:function(b,a,c){return{x:b.resolution*a+b.originPoint.x,y:b.originPoint.y-b.resolution*c}},clone:function(c){if(typeof(c)!="object"||c==null){return c}var b={};if(c.constructor==Array){b=[]}for(var a in c){b[a]=max.util.clone(c[a])}return b}};max.Filter={colorInvertProcess:function(j){var d=j.data;var c=d.length;for(var e=0;e<c;e+=4){var h=d[e];var f=d[e+1];var a=d[e+2];d[e]=255-h;d[e+1]=255-f;d[e+2]=255-a}return j},grayProcess:function(j){var d=j.data;var c=d.length;for(var e=0;e<c;e+=4){var h=d[e];var f=d[e+1];var a=d[e+2];d[e]=(h*0.272)+(f*0.534)+(a*0.131);d[e+1]=(h*0.349)+(f*0.686)+(a*0.168);d[e+2]=(h*0.393)+(f*0.769)+(a*0.189)}return j},copyImageData:function(a,b){var c=a.createImageData(b.width,b.height);c.data.set(b.data);return c},blurProcess:function(p){var v=p.data;var s=0,c=0,d=0;for(var i=0;i<p.width;i++){for(var h=0;h<p.height;h++){var m=(i+h*p.width)*4;for(var j=-2;j<=2;j++){var t=j+i;if(t<0||t>=p.width){t=0}for(var l=-2;l<=2;l++){var k=l+h;if(k<0||k>=p.height){k=0}var o=(t+k*p.width)*4;var n=v[o+0];var q=v[o+1];var u=v[o+2];s+=n;c+=q;d+=u}}var a=(s/25);var e=(c/25);var f=(d/25);s=0;c=0;d=0;v[m+0]=a;v[m+1]=e;v[m+2]=f;v[m+3]=255}}return p},reliefProcess:function(c){for(var h=1;h<c.width-1;h++){for(var f=1;f<c.height-1;f++){var i=(h+f*c.width)*4;var b=((h-1)+f*c.width)*4;var e=((h+1)+f*c.width)*4;var g=c.data[e+0]-c.data[b+0]+128;var a=c.data[e+1]-c.data[b+1]+128;var d=c.data[e+2]-c.data[b+2]+128;g=(g<0)?0:((g>255)?255:g);a=(a<0)?0:((a>255)?255:a);d=(d<0)?0:((d>255)?255:d);c.data[i+0]=g;c.data[i+1]=a;c.data[i+2]=d;c.data[i+3]=255}}return c},diaokeProcess:function(c){for(var h=1;h<c.width-1;h++){for(var f=1;f<c.height-1;f++){var i=(h+f*c.width)*4;var b=((h-1)+f*c.width)*4;var e=((h+1)+f*c.width)*4;var g=c.data[b+0]-c.data[e+0]+128;var a=c.data[b+1]-c.data[e+1]+128;var d=c.data[b+2]-c.data[e+2]+128;g=(g<0)?0:((g>255)?255:g);a=(a<0)?0:((a>255)?255:a);d=(d<0)?0:((d>255)?255:d);c.data[i+0]=g;c.data[i+1]=a;c.data[i+2]=d;c.data[i+3]=255}}return c},mirrorProcess:function(g){var e=[];for(var d in g.data){e[d]=g.data[d]}for(var b=0;b<g.width;b++){for(var f=0;f<g.height;f++){var a=(b+f*g.width)*4;var c=(((g.width-1)-b)+f*g.width)*4;g.data[c+0]=e[a+0];g.data[c+1]=e[a+1];g.data[c+2]=e[a+2];g.data[c+3]=255}}return g}};max.tools.DrawTool=function(a){this.map=a;this._isActivate=false;this.drawType="POINT";this._layer=new max.Layer.GraphicsLayer();this._graphic=null;this._geometry=null;this._init()};max.tools.DrawTool.prototype={activate:function(){if(!this._isActivate){this._initEvn();max.event.addHandler(this.map._canvas,"click",this._clickHandler);max.event.addHandler(this.map._canvas,"dblclick",this._dbclickHandler);max.event.addHandler(this.map._canvas,"mousemove",this._mouseMoveHandler);this._isActivate=true;this.map._canvas.style.cursor="crosshair";map.addLayer(this._layer);this._pub.triggerDirectToSub(this._sub,"drawstart","begin draw")}},deactivate:function(){var a=this;if(this._isActivate){max.event.removeHandler(this.map._canvas,"click",this._clickHandler);max.event.removeHandler(this.map._canvas,"dblclick",a._dbclickHandler);max.event.removeHandler(this.map._canvas,"mousemove",this._mouseMoveHandler);this._isActivate=false;this.map._canvas.style.cursor="default";map.removeLayer(this._layer)}},_init:function(){this._sub=new max.event.Subscriber();this._pub=new max.event.Publisher();var a=this;this._clickHandler=function(c){if(a.drawType==="POINT"){var e=max.util.windowToMapClient(a.map._canvas,c.clientX,c.clientY);var b=max.util.mapClientToWebMercator(a.map,e.x,e.y);var d=new max.Geometry.Point(b.x,b.y,{wkid:102100});c.geometry=d;a._pub.triggerDirectToSub(a._sub,"drawend",c);d=null}else{var e=max.util.windowToMapClient(a.map._canvas,c.clientX,c.clientY);var b=max.util.mapClientToWebMercator(a.map,e.x,e.y);a._geometry.addPoint(b.x,b.y,0,a._geometry.paths[0].length-1)}};this._mouseMoveHandler=function(c){if(a.drawType==="POINT"){return false}else{var d=max.util.windowToMapClient(a.map._canvas,c.clientX,c.clientY);var b=max.util.mapClientToWebMercator(a.map,d.x,d.y);if(a._geometry.paths[0].length===0){a._geometry.addPoint(b.x,b.y,0,0)}else{a._geometry.updatePoint(b.x,b.y,0,a._geometry.paths[0].length-1)}}};this._dbclickHandler=function(b){if(a.drawType==="POINT"){return false}else{a._geometry.removePoint(0,a._geometry.paths[0].length-1);a._geometry.removePoint(0,a._geometry.paths[0].length-1);a._layer.removeAllGraphics();b.geometry=a._geometry;a._pub.triggerDirectToSub(a._sub,"drawend",b);a._initEvn.call(a)}}},setDrawType:function(a){if(a===this.drawType){return false}else{this.drawType=a;this._initEvn()}},_initEvn:function(){var a=this.drawType;this._layer.removeGraphic();this._graphic=null;this._geometry=null;if(a==="POINT"){}else{if(a==="LINE"){this._geometry=new max.Geometry.Line([[]],{wkid:102100});this._graphic=new max.Geometry.Graphic(this._geometry);this._layer.addGraphic(this._graphic)}else{if(a==="POLYGON"){this._geometry=new max.Geometry.Polygon([[]],{wkid:102100});this._graphic=new max.Geometry.Graphic(this._geometry);this._layer.addGraphic(this._graphic)}}}},addEventListener:function(b,a){this._sub.bind(this._pub,b,a)},removeEventListener:function(b,a){this._sub.unbind(this._pub,b,a)}};
