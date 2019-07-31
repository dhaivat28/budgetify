// Budget Controller
var budegetController = (function(){
    
 
})();


//UI Controller
var UIController = (function(){
    
    return {
        getInput:function() {
            
            return {
                type:document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value    
            }
            
        }
    }
    
})();


//Global APP Controller
var contoller = (function(budgetCtrl, UICtrl){
    
    var ctrlAddItem = function(){
        var fieldInputs = UICtrl.getInput();
        console.log(fieldInputs);    
    }

    
    //===================================================================================================   
document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);

document.addEventListener('keypress', function(){
        if(event.keyCode===13 || event.which ===13){
            ctrlAddItem();
        }
    });
    
})(budegetController,UIController);

