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
         if (data.allItems[type].length > 0)
             {
             ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
             } else {
             ID = 0; 
             }
         
         //create new id based on inc or exp    
         if (type == 'exp') {
             newItem = new Expense(ID, des, val);
         } else {
             newItem = new Income(ID, des, val);
         }
         
         //push it into our data structure
         data.allItems[type].push(newItem);
         // return the new element
         return newItem;
     },
     
     testing:function() {
         console.log('yes testing'); 
     }
 }
 
})();


//////////////////////////////  UI Controller ///////////////////////////////////////////////////
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list'
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
        
        addListItem:function(obj,type) {
            
            var html, newHtml, element;
            
            
            // 1. create new placeholder with inc and exp html
            if(type === 'inc')
                {
                    
                    element = DOMstrings.incomeContainer;
                    
                     html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
                } else { 
                    
                     element = DOMstrings.expenseContainer;
                    
                     html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
            
             //2. Replace placeholder with actual data
                newHtml = html.replace('%id%',obj.id);
                newHtml = newHtml.replace('%description%',obj.description);
                newHtml = newHtml.replace('%value%',obj.value);
                
            //3. Insert html Into DOM
            
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
           
        }, // end of addItemList Function
        
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
         
        var newItem, input;
        
        //1. Get Input Field Data
        var input = UICtrl.getInput();
        
        //2. Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type,input.description, input.value);
        
        //3.Add Item to the UI
        UICtrl.addListItem(newItem,input.type);
    };
    
    return {
        init:function() {
            setupEventListeners();
            budgetCtrl.testing();  
        } 
    }
    
})(budegetController,UIController);

contoller.init();

