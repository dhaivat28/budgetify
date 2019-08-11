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
         this.percentage = -1;
     }
     
     Expense.prototype.calcPercentage = function(totalIncome){
          if(totalIncome > 0) {
              this.percentage = ((this.value/totalIncome) * 100);
          } else {
              this.percentage = -1;
          }
     };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
         
         
         deleteItem:function(type,id){
            
            //id =6
            //data.allItems[type][id];
            //id = [1,2,4,6,8]
            //index = 3
             
             var ids, index;
             ids = data.allItems[type].map(function(current){    
                 return current.id;
             });     
            
             index = ids.indexOf(id); 
             
             if(index!== -1){
                 data.allItems[type].splice(index,1);
             }
         },

          calculateBudget:function() {
             
              //calculate total income and expenses
                calculateTotal('inc');
                calculateTotal('exp');
              
            //calculate total budeget = income-expense
              data.budget = data.totals.inc-data.totals.exp;
              
              if(data.totals.inc>0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
              } else {
                data.percentage = -1;
              } 
         },
         
         calulatePercentages:function(){
             
             data.allItems.exp.forEach(function(cur){
                 cur.calcPercentage(data.totals.inc);
             });
         },
         
         
         getPercentages: function() {
             var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
             });
             
             return allPerc;
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
        container:'.container',
        expensePercLabel:'.item__percentage'
    }
    
      var formatNumber = function (num,type){
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numsplit = num.split('.');
            
            int = numsplit[0];
            dec = numsplit[1];
            
            if(int.length>3){
                int = int.substr(0, int.length-3) + ',' + int.substr(int.length -3,3);   
            }
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' +  dec;
            
        }; 
    
    //main return
    return {
         
        getInput:function() {
            return {
                type:document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        }, 
        
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
                newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));        
             //3. Insert html Into DOM
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        }, 
        
        deleteListitem:function(selectorID) {
        
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        }, 
        
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
            var type;
            
            if (obj.budget){
                type = 'inc';
            } else {
                type = 'exp';
            }
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            if(obj.percentage > 0){
             document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';     
            } else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';  
      
            }
        },
        
        
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);  
            
            
            var nodeListForEach = function(list, callback){
                
                for(var i =0; i<list.length; i++){
                    callback(list[i],i);
                }
                
            };
            
            nodeListForEach(fields, function(current,index){
               if(percentages[index]>0){
                 current.textContent = percentages[index]+ '%';  
               } else {
                 current.textContent = '---';  
               }
                 
                
            });
        },  
             
        getDOMstrings:function() {
            return DOMstrings;
        }
        
    }// end of main contoller return
    
})();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    
    var updatePercentages  = function(){
        
        //1. calculate Percentages
        budgetCtrl.calulatePercentages();
        
        //2. Read Percentages form budget controller
        var percentages = budgetCtrl.getPercentages();
        
        //3. Update the Ui
        UICtrl.displayPercentages(percentages); 
        
        
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
            
            //6. Update the percentage
            updatePercentages();
    
        }
    };
    
    
    var ctrlDeleteItem = function(event) {
        
        var itemID, splitID,type, ID;
        
         itemID   =  event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            //2. Delte the item from the UI
            UICtrl.deleteListitem(itemID);
            
            //3. update and show the budget
            updateBudget();  
            
            //6. Update the percentage
            updatePercentages();
        }
        
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

