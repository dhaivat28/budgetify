var budegetController = (function(){
    
    var x = 10;
    var add = function(a){
        return x+a;
    }
    
    return {
        publicTest:function(b){
           return add(b);
        }
    }
    
})();



var UIController = (function(){
    
    //some code
    
    
})();


var contoller = (function(budgetCtrl, UICtrl){
    
    var z = budgetCtrl.publicTest(10);
    
    return{
        anotherPublic: function(){
            console.log(z);
        }
    }
    
})(budegetController,UIController);

