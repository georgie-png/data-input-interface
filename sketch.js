let loadedJSON = null; 
let vDist = 37;
let vOffset = 100;
let xPos = 30;
let xOffset = 250;
let xSpace = 180;
let vRectOffset = 0.82;
let txtOffset = 0.6;

let itemNum = 0;
let dataSize = 5999;
let numKitchens = 6;
let numItem = 15

let normals = [];
let buttons= [];
let currentRow = -1;

let this_food_data = [];
let this_kitchens_data = [];
let numData = 0;

let bevel = 5


function setup() { 

  let h = int((numItem+3.5) * vDist);
  let w = setXpos(numKitchens+1.5)
  var myCanvas =   createCanvas(w, h);
  myCanvas.parent("dataDiv");

  textSize(22); 
  
  //drawTitles();  

  itemNum = (int(random(0, 10000))*14)%dataSize;

  loadedJSON = loadJSON('Full-Data-80-20-split-6000.json', onFileload); 


} 
  
function nextItem() { 

  itemNum++;

  if(itemNum>dataSize-1){
    itemNum=0;
  }


  drawStock();
  clear();
  highlightRow();
  drawNames();
  drawStock();
  //drawTitles();

  drawIfThen();

  document.getElementById("smplNum").innerText = numData;


} 

  
function onFileload() { 
  //text("File loaded successfully...", 30, 100); 
  findNormals();


  drawNames();
  
  drawStock();
  highlightRow();
  drawStock();
  drawButtons();


  drawIfThen()

    const saveButton = document.createElement('button');
    saveButton.innerText = "Save data";

    saveButton.addEventListener('click', () => {
      fileSave();
    })

    document.getElementById("saveDiv").appendChild(saveButton);

  //let saveButton = document.getElementById('saveButton');
    // Create a button for loading the JSON 
  //let saveButton = createButton("Save Samples"); 
  //saveButton.position(350, 162);
  //saveButton.size(xSpace, 40)
  //saveButton.mousePressed(fileSave);
  //saveButton.mousePressed(() => {
    //fileSave();
  //});

} 

function fileSave(){
  let json = {}; // new  JSON Object

  json.food_labels = loadedJSON["food_labels"];
  json.kitchen_labels = loadedJSON["kitchen_labels"];
  json.food_data = this_food_data;
  json.kitchens_data = this_kitchens_data;
  saveJSON(json, 'My_CMT_Data.json');
}




function drawStock(){


  fill(50);
  for(let k=0; k<numKitchens+1; k++){
    for (let i = -1; i < numItem; i++) { 

      if(i==-1){
        if(k==numKitchens){
          text("Picked up", setXpos(k), vOffset + i * vDist); 
        }else{
          text(loadedJSON["kitchen_labels"][k], setXpos(k), vOffset + i * vDist); 
        }

      }
      else if (k==numKitchens){

        let val = loadedJSON["food_data_train"][itemNum][10][i]/normals[i];
        if(val!=0){

          rect(setXpos(k),  vOffset*vRectOffset+ i * vDist + vDist*0.1, val*xSpace*0.95, vDist*0.8, bevel);
          
          currentRow=i;
          
        }
      }
      else{

        let val = loadedJSON["food_data_train"][itemNum][k][i]/normals[i];

        if(val!=0){

          rect(setXpos(k),  vOffset*vRectOffset+ i * vDist + vDist*0.1, val*xSpace*0.95, vDist*0.8, bevel);
        
        }

      }
    } 
  }
}

function setXpos(k){
  return xOffset + (k+1)*xSpace;
}

function drawNames(){
  fill(50);

  // draw names
  for (let i = -1; i < numItem; i++) { 
    if(i==-1){
      text("Item:", xPos, vOffset + i * vDist); 
    }
    else{
      text(loadedJSON["food_labels"][i], xPos+8, vOffset + i * vDist+10); 
    }
  } 

}

function drawButtonsOld(){

  for (let k = 0; k< numKitchens; ++k){
    let selectButton = createButton("Then "+ loadedJSON["kitchen_labels"][k]);
    selectButton.mousePressed(() => {
      addData(k);
      nextItem();
    });
    let xPos = 30;
    selectButton.position(setXpos(k), vOffset + numItem * vDist-20);
    selectButton.size(xSpace*0.9, 30);
    selectButton.parent("data");
    selectButton.style.position = "static"

  }
 }

 function drawButtons(){

  var btnDiv = document.getElementById('buttonDiv')

  for (let k = 0; k< numKitchens; ++k){
    const button = document.createElement('button');
    button.innerText = "Then "+ loadedJSON["kitchen_labels"][k]

    button.addEventListener('click', () => {
      addData(k);
      nextItem();
    })

    btnDiv.appendChild(button);

  }
 }

function highlightRow(){
  fill(200, 50);
  rect(xPos,  vOffset*vRectOffset+ currentRow * vDist, (numKitchens+2)*xSpace+xOffset, vDist, bevel)
  
}

function drawTitles(){
 // let saveButton = document.getElementById("saveButton");

//  saveButton.onclick(() => {
//  fileSave()
 // });

  fill(0);
  text("Collective Machine Teaching Interfaces", 30, 35); 
  text("The Highlighted line shows which food you are to distribute. The quantities each kitchen has of all the items is shown in the bar chart and then use it and your own knowledge to select a kitchen to send it to by pressing one of the buttons. So asking if ....g of .... foods, then ....'s kitchen.", 30, 70, width*0.95); 
  text("Once you have as many samples as you want download the data as a JSON with the button below.", 30, 145); 
  text("Number of samples: " + numData, 30, 188);
}

function findNormals(){

  normals=[];


      for(let i=0; i<numItem; i++){

        let max =0;

        for(let n=0; n<dataSize; n++){

          for(let k=0; k<11;k++){

            let val = int(loadedJSON["food_data_train"][n][k][i]);

            if(val>max){
              max=val;
            }
          } 
      } 
      normals[i]=max;

  }
}

function addData( i){

  this_food_data[numData] = loadedJSON["food_data_train"][itemNum];

  let Kitchen_data = [];

  for( let k=0; k<numKitchens; k++){
    if(i==k){
      Kitchen_data[k]=1
    }else{
      Kitchen_data[k]=0
    }
  }
  this_kitchens_data[numData] = Kitchen_data;

  numData++;

}

function drawIfThen(){
  fill(0);
  let val = loadedJSON["food_data_train"][itemNum][10][currentRow];
  val = int(val);
  //var weight = document.getElementById("weight");
  //weight.innerText = val + "g";
  //var food = document.getElementById("food");
  //food.innerText = loadedJSON["food_labels"][currentRow] + "?";
  text("If " + val + "g of "+ loadedJSON["food_labels"][currentRow] +"?", xPos*2, vOffset + numItem * vDist +16);//xPos, vOffset + 29 * vDist1);

}