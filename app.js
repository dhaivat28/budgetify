// Budget Controller
var budegetController = (function(){


 //Functional Constructors 
 var Expense = function(id, description,value) {
     this.id = id;
     this.description = description;
     this.value = value;
 }
 
 //Functional Constructors 
 var Income = function(id, description, value){
     this.id = id;
     this.description = description;
     this.value = value;
 }
 
})();


//////////////////////////////  UI Controller ///////////////////////////////////////////////////
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn : '.add__btn'
    }
    
    //main return
    return {
         
        getInput:function() {
            return {
                type:document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value    
            }
        }, // end of getInput function
        
        getDOMstrings:function() {
            return DOMstrings;
        }
        
    }// end of main contoller return
    
})();


//////////////////////////////  Global APP Controller ///////////////////////////////////////////////////
var contoller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress', function() {
            if(event.keyCode===13 || event.which ===13) {
                ctrlAddItem();
            }
        });
    };
    
    var ctrlAddItem = function() {
        var fieldInputs = UICtrl.getInput();
        console.log(fieldInputs);    
    };
    
    return {
        init:function() {
            setupEventListeners();
        } 
    }
    
})(budegetController,UIController);

contoller.init();

