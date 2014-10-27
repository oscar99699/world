angular.module("world",[])
.factory("continents",["$http",function($http){
    //Yahoo
    var urlGetContinents = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.continents%20&format=json&diagnostics=true&callback=JSON_CALLBACK";
    var Continents = [];
    
    var getContinents =  function(){
        
        return $http.jsonp(urlGetContinents).success(function(data){
           
           angular.forEach(data.query.results.place,function(continent){
                Continents.push(continent);
           });
            
        });
        
    }
    
    return {
        getContinents : getContinents,
        Continents    : Continents
    }
    
}]).
factory("countries",["$http",function($http){
    
    var urlGetCountries = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.countries%20where%20place%3D%22SPECIFIC_CONTINENT%22&format=json&diagnostics=true&callback=JSON_CALLBACK";
    var Countries       = [];
    var getCountries    =   function(continent){
        
        if(continent==""){return false;}
        
        urlGetCountriesTemporal = urlGetCountries.replace("SPECIFIC_CONTINENT",continent.replace(" ","%20"));
        
        Countries.length = 0;
        
        return $http.jsonp(urlGetCountriesTemporal).success(function(data){
            
            angular.forEach(data.query.results.place,function(country){
                Countries.push(country);
            });
            
        });
    }
    
    
    return {
        getCountries : getCountries,
        Countries    : Countries
    };
    
}]).
directive("country",function(){
    return  {
        restrict : "EAC",
        replace  : true,
        scope    : {
            myName : "@countryName"
        },
        template : "<div>{{myName}}</div>"
    }
});


var app = angular.module("app",["world"]);

app.controller("WorldController",["$scope","continents","countries",function($scope,continents,countries){
    
    $scope.planetName = "Earth";
    $scope.continent  = "";
    $scope.continents = {};
    $scope.countries  = {};
    
    $scope.init = function(){
        continents.getContinents();
        $scope.continents = continents.Continents;
        $scope.countries  = countries.Countries;
    }
    
    $scope.$watch("continent",function(newValue,oldValue){
        countries.getCountries(newValue);
    });
    
    $scope.init();
    
}]);