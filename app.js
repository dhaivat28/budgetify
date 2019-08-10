////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                        //
//                                           Budget Controller                                                            //
//                                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var budegetController = (function(){

     var Expense = function(id, description,value) {
         this.id = id;
         this.description = description;
         this.value = value;
     }

     var Income = function(id, description, value){
         this.id = id;
         this.description = description;
         this.value = value;
     }
 
     var calculateTotal = function(type){
         var sum = 0;
         data.allItems[type].forEach(function(cur){ 
         sum += cur.value;
        });
         
         data.totals[type] = sum;
     };
                          
     var data = {
         allItems : {
             exp:[],
             inc:[]
         },

         totals: {
             exp:0,
             inc:0
         },
         
         budget:0,
         percentage:0
         
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

             data.allItems[type].push(newItem);
             return newItem;
         },

          calculateBudget:function() {
             
              //calculate total income and expenses
                calculateTotal('inc');
                calculateTotal('exp');
              
            //calculate total budeget = income-expense
              data.budget = data.totals.inc-data.totals.exp;

            //calculate percentage of income spent 
              data.percentage = Math.round((data.totals.inc/data.totals.exp) * 100);
              
              if(data.totals.inc>0){
                data.percentage = Math.round((data.totals.inc/data.totals.exp) * 100);      
              } else {
                data.percentage = -1;
              }
              
         },
         
          getBudget: function() {
               return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };   
        },

         testing:function() {
            console.log(data);
         }
     }
 
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                        //
//                                          UI Controller                                                                 //
//                                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel: '.budget__income--value',
        budgetLabel: '.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container'
    }
    
    //main return
    return {
         
        getInput:function() {
            return {
                type:document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        }, // end of getInput function
        
        addListItem:function(obj,type) {
            var html, newHtml, element;
            // 1. create new placeholder with inc and exp html
            if(type === 'inc')
                {
                    element = DOMstrings.incomeContainer;
                     html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';     
                } else {       
                     element = DOMstrings.expenseContainer;
                     html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
             //2. Replace placeholder with actual data
                newHtml = html.replace('%id%',obj.id);
                newHtml = newHtml.replace('%description%',obj.description);
                newHtml = newHtml.replace('%value%',obj.value);        
            //3. Insert html Into DOM
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        }, // end of addItemList Function
        
        clearFields:function() {
            var Fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue); 
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
               current.value = ""; 
            });
            fieldsArr[0].focus();
        },
        
        displayBudget:function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            
            if(obj.percentage > 0){
             document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';     
            } else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---     ';  
      
            }
        },
        
        getDOMstrings:function() {
            return DOMstrings;
        }
        
    }// end of main contoller return
    
})();


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                        //
//                                          Global APP Controller                                                         //
//                                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var contoller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress', function() {
            if(event.keyCode===13 || event.which ===13) {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };
    
    var updateBudget = function() {
        
        //1. Calculate the total budget
        budgetCtrl.calculateBudget();
        
        //2. Return Budget
        var budget = budgetCtrl.getBudget();
        
        //3.Diplay the results
        UICtrl.displayBudget(budget);
        
    }
    
    var ctrlAddItem = function() {
         
        var newItem, input;
        
        //1. Get Input Field Data
        var input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2. Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type,input.description, input.value);

            //3.Add Item to the UI
            UICtrl.addListItem(newItem,input.type);

            //4. Clear Fields
            UICtrl.clearFields();

            //5. Calculate and Update Budget
            updateBudget();        
    
        }
    };
    
    
    var ctrlDeleteItem = function(event) {
        
        var itemID, splitID,type, ID;
        
         itemID   =  event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
        }
        
        console.log(splitID);
    };
    
    
    
    return {
        init:function() {
            setupEventListeners();
            
            UICtrl.displayBudget({
                budget:0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
             });
        }
    }
    
})(budegetController,UIController);

contoller.init();

