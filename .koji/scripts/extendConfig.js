/**
 * extendConfig.js
 * 
 * What it does:
 *   This file takes all of the customization json files and seek for fields with type = object,
 *   them its update theese files with the fields that are necessary to work with current UI
 */


const fs = require('fs');

// Recurse through all directories to find koji dotfiles
function readDirectory(directory) {
  let results = [];
  fs
    .readdirSync(directory)
    .forEach((fileName) => {
      const file = `${directory}/${fileName}`;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(readDirectory(file));
      } else {
        results.push(file);
      }
    });
  return results;
}




readDirectory('../customization').filter(path => path.endsWith('.json')).forEach((path)=> {
    console.log(path);
     try {
        const file = JSON.parse(fs.readFileSync(path, 'utf8'));
        let changed = false;
        let fileValues = file[file['@@editor'][0].key];
        //Updates values on top Level
        
        Object.keys(fileValues).filter(key => key.match(/(.*?)(?:\((\d*)\))?\[(.*)\]/)).forEach((key)=> {
            console.log(key);
             let groupMatches= key.match(/(.*?)(?:\((\d*)\))?\[(.*)\]/);
             let keyName= groupMatches[1];
             let indexArray = groupMatches[2];
             let field = groupMatches[3];
             if(!fileValues[keyName]){
                 if (indexArray){
                  fileValues[keyName]=[{}];
                 }else{
                   fileValues[keyName]={};
                 }
             }
             
             if(indexArray){
              if(!fileValues[keyName][indexArray]){
                 fileValues[keyName][indexArray]={};
              }
              fileValues[keyName][indexArray][field]=fileValues[key];
             }else{
              fileValues[keyName][field]=fileValues[key];
             }
             changed= true;
        });

        file['@@editor'].forEach((editor)=>{
            editor.fields.filter( field => field.type.toUpperCase()=='OBJECT'|| field.multiple).forEach((field)=> {
                
             
                 //Updates slot, so the next time will be more available
                if(field.multiple && (!field.slot||fileValues[field.key] &&fileValues[field.key].length>=field.slot)){
                      field.slot= field.slot?(field.slot+1):1;
                }
                //Run for n times if have slot set or just one if don't
                for (const x of Array(field.slot).keys()) {
                  field.fields.forEach((attribute) => {
                    

                        let keyAttribute = field.key+(field.multiple?('('+x+')'):'')+'['+attribute.key+']';
                        
                        //Check if already added and remove it
                        editor.fields = editor.fields.filter(field => field.key != keyAttribute);

                        //clone object so I can change the key 
                        let newField= JSON.parse(JSON.stringify(attribute));
                        newField.key = keyAttribute;

                        editor.fields.push(newField);
                        changed = true;
                  
                  });
                }
                
               
                
            });
        });
        
        
        if(changed){
          //Save new File
          fs.writeFile(path, JSON.stringify(file, null, 2), 'utf8', function (err) {
              if (err) {
                  console.log("An error occured while writing JSON Object to File.");
                  return console.log(err);
              }
          
              console.log("JSON file has been saved."+ path);
          });
        }
       
      } catch (err) {
        console.log(err);
      }
});
