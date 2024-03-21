let loadedJSON = null; 
let vDist = 35;
let vOffset = 275;
let xPos = 30;
let xOffset = 450;
let xSpace = 160;
let vRectOffset = 0.82;
let txtOffset = 0.6;

let itemNum = 0;
let numItem = 8155;
let numKitchens = 10;

let normals = [];
let buttons= [];
let currentRow = -1;

let this_food_data = [];
let this_kitchens_data = [];
let numData = 0;


function setup() { 
  createCanvas(windowWidth, windowHeight); 
  textSize(22); 
  
  drawTitles();  

  loadedJSON = loadJSON('DEF-00.json', onFileload); 
  numItem = loadedJSON["food_data"];
  numItem = numItem;
  itemNum = int(random(0, numItem));
} 
  
function nextItem() { 

  itemNum++;

  if(itemNum>numItem-1){
    itemNum=0;
  }

  clear();

  drawNames();
  drawStock();
  highlightRow();
  drawTitles();

} 
  
function onFileload() { 
  //text("File loaded successfully...", 30, 100); 

  drawNames();
  
  drawStock();

  drawButtons();

  highlightRow();

    // Create a button for loading the JSON 
  let saveButton = createButton("Save JSON file"); 
  saveButton.position(30, 160) 
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
  for(let k=0; k<11; k++){
    for (let i = -1; i < 29; i++) { 

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

          rect(setXpos(k),  vOffset*vRectOffset+ i * vDist + vDist*0.1, val*xSpace*0.95, vDist*0.8);
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
  for (let i = -1; i < 29; i++) { 
    if(i==-1){
      text("Item:", xPos, vOffset + (i -txtOffset) * vDist); 
    }
    else{
      text(loadedJSON["food_labels"][i], xPos, vOffset + (i -txtOffset) * vDist); 
    }
  } 

}

function drawButtons(){

  for (let k = 0; k< 10; ++k){
    let seletButton = createButton("Then "+ loadedJSON["kitchen_labels"][k]);
    seletButton.mousePressed(() => {
      addData(k);
      nextItem();
    });
    let xPos = 30;
    seletButton.position(setXpos(k), vOffset + 29 * vDist);
  }

}

function highlightRow(){
  fill(200, 50);
  rect(xPos,  vOffset*vRectOffset+ currentRow * vDist, 12*xSpace+xOffset, vDist)
  print(currentRow);
}

function drawTitles(){
  fill(0);
  text("Collective Machine Teaching Interfaces", 30, 35); 
  text("The Highlighted line shows which food you are to distribute. Look at the quantities each kitchen has of the items and then select a kitchen to send it to.", 30, 90); 
  text("Once you have as many samples as you want download the data as a JSON with the button below.", 30, 120); 
  text("Number of samples: " + numData, 30, 150);
}

function findNormals(){

  normals=[];
  for(let i=0; i<29; i++){

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