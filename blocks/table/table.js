async function createTableHeader(table){
  let tr=document.createElement("tr");
  let sno=document.createElement("th");sno.appendChild(document.createTextNode("S.No"));
  let state=document.createElement("th");state.appendChild(document.createTextNode("states"));
  let side=document.createElement("th");side.appendChild(document.createTextNode("Side"));
  let capital=document.createElement("th");capital.appendChild(document.createTextNode("Capital"));
  let abbr=document.createElement("th");abbr.appendChild(document.createTextNode("Abbreviation"));
  tr.append(sno);tr.append(state);tr.append(capital);tr.append(side);tr.append(abbr);
  table.append(tr);
}
async function createTableRow(table,row,i){
  let tr=document.createElement("tr");
  let sno=document.createElement("td");sno.appendChild(document.createTextNode(i));
  let state = document.createElement("td");state.appendChild(document.createTextNode(row.States)); 
  let side=document.createElement("td");side.appendChild(document.createTextNode(row.Capital));
  let capital=document.createElement("td");capital.appendChild(document.createTextNode(row.Side));
  let abbr=document.createElement("td");abbr.appendChild(document.createTextNode(row.Abbreviation));
  tr.append(sno);tr.append(state);tr.append(side);tr.append(capital);tr.append(abbr);
  table.append(tr);
}

async function createSelectMap(jsonURL){
  const optionsMap=new Map();
  const { pathname } = new URL(jsonURL);

  const resp = await fetch(pathname);
  optionsMap.set("all", "All States");
  optionsMap.set("south", "South");
  optionsMap.set("east", "East");
  optionsMap.set("north", "North");
  optionsMap.set("west", "West");
  optionsMap.set("north-east", "North-East");
  optionsMap.set("central", "Central");
  const select=document.createElement('select');
  select.id = "region";
  select.name="region";
  optionsMap.forEach((val,key) => {
      const option = document.createElement('option');
      option.textContent = val;
      option.value = key;
      select.append(option);
    });
   
   const div=document.createElement('div'); 
   div.classList.add("region-select");
   div.append(select);
  return div;
}
async function createTable(jsonURL,val) {

  let  pathname = null;
  if(val){
      pathname=jsonURL;
  }else{
      pathname= new URL(jsonURL);
  }
  
  const resp = await fetch(pathname);
  const json = await resp.json();
  console.log("=====JSON=====> {} ",json);
  
  const table = document.createElement('table');
  createTableHeader(table);
  json.data.forEach((row,i) => {

      createTableRow(table,row,(i+1));

    
  });
  
  return table;
}    

export default async function decorate(block) {
  const states = block.querySelector('a[href$=".json"]');
  const parientDiv=document.createElement('div');
  parientDiv.classList.add('contries-block');

  if (states) {
      parientDiv.append(await createSelectMap(states.href));
      parientDiv.append(await createTable(states.href,null));
      states.replaceWith(parientDiv);
      
  }
  const dropdown=document.getElementById('region');
    dropdown.addEventListener('change', () => {
      let url=states.href;
      if(dropdown.value!='all'){
          url=states.href+"?sheet="+dropdown.value;
      }
      const tableE=parientDiv.querySelector(":scope > table");
      let promise = Promise.resolve(createTable(url,dropdown.value));
      promise.then(function (val) {
          tableE.replaceWith(val);
      });
    });
}