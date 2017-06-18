!function (exports) {
    'use strict;'

    // 路由启动标志
    var isRouteStart = false;
    // 路由事件句柄集合
    var _handlers = [];
    // hashchange事件句柄集合
    var _hashHandlers = [];
    // Route构造函数
    var R = function () {
        var that = this;
        // binding routes
        _bindRoutes = function () {
            if ( !this.routes )
                return;
            var routes = [];
            for ( var route in this.routes ) {
                routes.unshift ( [ route, this.routes[route] ] );       //将routes对象拆分成数组
            }
            
            for ( var i = routes.length - 1, l = 0; i >= l; i-- ) {
                //注册hash路由的事件处理程序
                this.route ( routes[i][0],          //hash路径
                             routes[i][1],          //处理函数名
                             this[routes[i][1]],    //处理函数
                             this);                 //context
            }
        };
        _bindRoutes.call ( this );
        this.initialize ();
    };
    
    R.routeInit = function (route) {
        try {
            new route;
        } catch(e) {
            return;
        }
        R.start();
    };
    
    /**
     * 路由的启动接口
     */
    R.start = function () {
        if ( !isRouteStart ) {
            var that = this;
            function hashChange () {    
                var hash = window.location.hash;
                var route = this.trigger ( hash.replace ( routeFn.routeStripper, '' ) );    //router的渲染函数
                R.triggerHashEvent ();      //view的处理函数
            }
            //浏览器支持使用hashchange
            if( 'onhashchange' in window ) {
                window.onhashchange = function () {
                    hashChange.call ( that.prototype );
                }
            } else {//浏览器不支持hashchange使用轮询
                setInterval(function () {
                    var hash = window.location.hash;
                    if(hash != that.fragment) {
                        that.fragment = hash;
                        hashChange.call ( that.prototype );
                    }
                }, 50);
            }
            this.fragment = window.location.hash;
            hashChange.call ( this.prototype );
            return isRouteStart = true;
        }
        return false;
    };
    /**
     * 清除堆栈中的hash函数
     */
    R.triggerHashEvent = function () {
        var hash = window.location.hash;
        var arg = R.hashSplit ( hash ), callback;
        // 触发注册的事件句柄
        for ( var i = 0, len = _hashHandlers.length - 1; i <= len; len-- ) {
            callback = _hashHandlers[len].callback;
            //console.log ( '[Route event trigger]   --->  [hash : ' + hash + ']   [hash frag : ' + arg + ']' );
            callback && typeof callback === 'function' && callback.apply ( this, [ hash, arg ] );
        }
    };
    /**
     * 触发事件，分发执行路由事件回调
     */
    R.prototype.trigger = function ( fragment ) {
        var matched;
        var that = this;
        routeFn.any ( _handlers, function ( handler ) {
            if ( handler.route.test ( fragment ) ) {
                //route handler调用前调用的方法
                var before = handler.routeModel['beforeRoute'],
                //route handler调用后调用的方法
                    after = handler.routeModel['afterRoute'];
                //路由前方法
                before && before.call(handler.routeModel);
                //路由触发的事件处理方法
                handler.callback ( fragment );
                //路由触发的事件处理方法后的方法
                after && after.call(handler.routeModel);
                matched = {
                    name : handler.name
                }
                return true;
            }
        } );
        return matched;
    };
    /**
     * 将hash值切割为一个字符串数组
     */
    R.hashSplit = function ( hash ) {
        return hash.replace ( routeFn.paramStripper, '' ).split ( '/' );
    };
    /**
     * 注册一个hashchange事件监听，如果路由已经启动就触发本次事件
     */
    R.register = function ( name, callback ) {
        _hashHandlers.push ( {
            'callback' : callback,
            'name' : name
        } );
        if ( isRouteStart )
            R.triggerHashEvent ();
    };
    // 继承方法
    R.extend = function ( props ) {
        var f = function () {
            for ( var p in props ) {
                this[p] = props[p];
            }
            R.call ( this );
        };
        f.prototype = R.prototype;
        return f;
    };
    /**
     * 注册单个路由
     * @param {RegExp} route
     * @param {String} name
     * @param {Function} callback
     * @param {Object} routeModel //路由Model
     */
    R.prototype.route = function ( route, name, callback, routeModel ) {
        if ( !( route instanceof RegExp ) )
            route = routeFn._routeToRegExp ( route );
        if ( !callback )
            callback = this[name];
        this.listen ( route, name, routeFn.bind ( function ( fragment ) {
            var args = routeFn._extractParameters ( route, fragment );
            if ( callback ) {
                return callback.apply ( this, args );
            }
            return;
        }, this ), routeModel );
    };
    /**
     * 监听路由事件
     */
    R.prototype.listen = function ( route, name, callback, routeModel ) {
        _handlers.push ( {
            'route' : route,
            'name' : name,
            'callback' : callback,
            'routeModel' : routeModel
        } );
    };
    // 路由内部函数
    var routeFn = {
        'namedParam' : /:\w+/g,
        'splatParam' : /\*\w+/g,
        'escapeRegExp' : /[-[\]{}()+?.,\\^$|#\s]/g,
        'routeStripper' : /^[#\/]/,
        'paramStripper' : /^#!/,
        // Convert a route string into a regular expression, suitable for
        // matching
        // against the current location hash.
        _routeToRegExp : function ( route ) {
            route = route != '' ? route.replace ( this.escapeRegExp, '\\$&' ).replace ( this.namedParam, '([^\/]+)' ).replace (
                    this.splatParam, '(.*?)' ) : route;
            return new RegExp ( '^' + route + '$' );
        },
        // Given a route, and a URL fragment that it matches, return the array
        // of
        // extracted parameters.
        _extractParameters : function ( route, fragment ) {
            return route.exec ( fragment ).slice ( 1 );
        },
        isRegExp : function ( e ) {
            return e instanceof RegExp;
        },
        bind : function ( func, context ) {
            if ( func.bind )
                return Function.bind.apply ( func, Array.prototype.slice.call ( arguments, 1 ) );
            else {
                return function ( args ) {
                    func.call ( context, args );
                }
            }
        },
        //检测数组是否有该子元素
        any : function ( obj, iterator, context ) {
            // 下面这句话在编译时会提示出错。作用是什么？
            // iterator;
            var result = false;
            if ( obj == null ) {
                return result;
            }
            //使用native的some
            if ( obj.some ) {
                return obj.some ( iterator, context );
            }
            //迭代检测
            for (var i=0, len = obj.length - 1; i <= len; len--) {
                if ( result || ( result = iterator.call ( context, obj[len], len ) ) ) {
                    break;
                }
            }
            return !!result;
        }
    };

    exports.Turn = R;
}(window);

