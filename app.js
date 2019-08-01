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
 
 var data = {
     allItems : {
         exp:[],
         inc:[]
     },
     
     totals: {
         exp:0,
         inc:0
     }
 }
 
 return {
     addItem:function(type,des,val) {
         
         var ID, newItem;
         
         // Create new ID
         ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
         
             
         if (type == 'exp') {
             newItem = new Expense(Id, des, val);
         } else {
             newItem = new Income(Id, des, val);
         }
         
         data.allItems[type].push(newItem);
         return newItem;
     }
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

