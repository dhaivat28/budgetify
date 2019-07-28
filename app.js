// Budget Controller
var budegetController = (function(){
    
 
})();


//UI Controller
var UIController = (function(){
    
    
})();


//Global APP Controller
var contoller = (function(budgetCtrl, UICtrl){
    
       
    var ctrlAddItem = function(){
       
        
        
        
    }
   
    document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress', function(){
        if(event.keyCode===13 || event.which ===13){
            ctrlAddItem();
        }
    });
    
})(budegetController,UIController);

