import React from 'react';

var Service = function(comp){
    var _comps = [];
    this.__defineGetter__('$comps', function(){
        return _comps;
    });
    this.__defineSetter__('$comps', function(){
        throw '$comps is readonly';
    });
    var _apply = function(){
        for(let i = 0; i < _comps.length; i++){
            _comps[i].setState({});
        }
    };
    this.__defineGetter__('$apply', function(){
        return _apply;
    });
    this.__defineSetter__('$apply', function(){
        throw '$apply is readonly';
    });
    var _data = {};
    this.__defineGetter__('$data', function(){
        return _data;
    });
    this.__defineSetter__('$data', function(){
        throw '$data is readonly';
    });
    // this.__defineSetter__('$set', function(){
    //     throw '$set is readonly';
    // });
    return this;
};

Service.init = function(comp){
    if(!comp){
        throw 'comp is undefined';
    }
    if(!(comp instanceof React.Component)){
        throw 'comp is not React.Compoment';
    }
    if(!this.$instance){
        this.prototype.__defineSetter__('$apply', function(){
            throw '$apply is readonly';
        });
        this.prototype.__defineSetter__('$data', function(){
            throw '$data is readonly';
        });
        // this.prototype.__defineSetter__('$set', function(){
        //     throw '$set is readonly';
        // });
        this.$instance = new this(comp);
    }
    if(this.$instance.$comps.indexOf(comp) < 0){
        this.$instance.$comps.push(comp);
    }
    var _componentWillUnmount = comp.componentWillUnmount;
    comp.componentWillUnmount = (...args)=>{
        if(_componentWillUnmount){
            _componentWillUnmount.apply(comp, args);
        }
        var idx = this.$instance.$comps.indexOf(comp);
        if(idx >= 0){
            this.$instance.$comps.splice(idx, 1);
        }
    };
    return this.$instance;
};

Service.prototype.$set = function(key, val){
    this.$data[key] = val;
    this.$apply();
};

export default Service;