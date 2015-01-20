'use strict';

angular.module('<%= scriptAppName %>')
.constant('deviceConfig', {
  domain: '/* @echo DOMAIN */'
})
.provider('device', function (deviceConfig) {
  
  var Device = function(){
    this.NATIVE = 'native';
    this.WEB= 'web';
    this._root = document.URL;
    if(this.apiRoot.indexOf('@echo')>-1){
      this.apiRoot='';
    };
    
    this.name = function(){
      var app = this._root.indexOf( 'http://' ) === -1 && 
      this._root.indexOf( 'https://' ) === -1;
      if(app){
        return this.NATIVE;
      } else {
        return this.WEB;
      }
    };
    
    this.isNative= function(){
      return this.name()==this.NATIVE;
    };
    
    this.isWeb = function(){
      return this.name()==this.WEB;
    };
  }
  
  
  this.$get = function(){
    return new Device();
  };
  
});
