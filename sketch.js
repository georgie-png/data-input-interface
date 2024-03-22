let loadedJSON = null; 
let vDist = 37;
let vOffset = 295;
let xPos = 30;
let xOffset = 470;
let xSpace = 180;
let vRectOffset = 0.82;
let txtOffset = 0.6;

let itemNum = 0;
let dataSize = 600;
let numKitchens = 10;
let numItem = 31

let normals = [];
let buttons= [];
let currentRow = -1;

let this_food_data = [];
let this_kitchens_data = [];
let numData = 0;

let bevel = 5



function setup() { 

  let h = int(vOffset + (numItem+1) * vDist);
  let w = setXpos(numKitchens+1.5)
  createCanvas(w, h); 
  textSize(22); 
  
  drawTitles();  

  loadedJSON = loadJSON('Full-Data-600.json', onFileload); 
  itemNum = int(random(0, dataSize));

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
  drawTitles();

  drawIfThen();

} 

  
function onFileload() { 
  //text("File loaded successfully...", 30, 100); 


  drawNames();
  
  drawStock();
  highlightRow();
  drawStock();
  drawButtons();


  drawIfThen()

    // Create a button for loading the JSON 
  let saveButton = createButton("Save Samples"); 
  saveButton.position(350, 162);
  saveButton.size(xSpace, 40)
  saveButton.mousePressed(fileSave);

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

  findNormals();

  fill(50);
  for(let k=0; k<numKitchens+1; k++){
    for (let i = -1; i < numItem; i++) { 

      if(i==-1){
        if(k==numKitchens){
          text("Picked up", setXpos(k), vOffset + (i -txtOffset) * vDist - 10); 
        }else{
          text(loadedJSON["kitchen_labels"][k], setXpos(k), vOffset + (i -txtOffset) * vDist - 10); 
        }

      }
      else{

        let val = loadedJSON["food_data"][itemNum][k][i]/normals[i];
        if(val!=0){

          rect(setXpos(k),  vOffset*vRectOffset+ i * vDist + vDist*0.1, val*xSpace*0.95, vDist*0.8, bevel);
          if(k==10){
            currentRow=i;
          }
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
      text("Item:", xPos, vOffset + (i -txtOffset) * vDist); 
    }
    else{
      text(loadedJSON["food_labels"][i], xPos+8, vOffset + (i -txtOffset) * vDist-5); 
    }
  } 

}

function drawButtons(){

  for (let k = 0; k< numKitchens; ++k){
    let selectButton = createButton("Then "+ loadedJSON["kitchen_labels"][k]);
    selectButton.mousePressed(() => {

      addData(k);
      nextItem();
    });
    let xPos = 30;
    selectButton.position(setXpos(k), vOffset + numItem * vDist-20);
    selectButton.size(xSpace*0.9, 30);
  }
 }

function highlightRow(){
  fill(200, 50);
  rect(xPos,  vOffset*vRectOffset+ currentRow * vDist, 12*xSpace+xOffset, vDist, bevel)
  
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
    for(let k=0; k<numKitchens+1;k++){
      let val = int(loadedJSON["food_data"][itemNum][k][i]);
      if(val>max){
        max=val;
      }
    }  
    normals[i]=max;

  }
}

function addData( i){

  this_food_data[numData] = loadedJSON["food_data"][itemNum];

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
  let val = loadedJSON["food_data"][itemNum][10][currentRow];
  val = int(val);
  text("If " + val + "g of "+ loadedJSON["food_labels"][currentRow] +"?", xPos*2, vOffset + numItem * vDist );//xPos, vOffset + 29 * vDist1);

}