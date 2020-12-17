//DOM Elements
const addHeadBtn = document.getElementById("add_head")
const headSelection = document.getElementById("heads")
const el_table = document.getElementById("el_table")
const representation = document.getElementById("represent")
const copyBtn = document.getElementById("copybtn")
const selectContainer = document.getElementById("select_container")
const resetBtn = document.getElementById("reset")
const options = document.getElementById("options")
const helpBtn = document.getElementById("help")
const helpDisplay = document.getElementById("helpDisplay")

var lexeme = ""
var selectedHeadType = ""
var selectedVariable = "None"
const indices = ["i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z"]
var tree = []
var tempCoordList = []


function searchTree(key, name){
    var results = []
    for (let i of tree){
        if (i[key] === name){
            results.push(i)
        }
    }
    return results
}

//first step
function selectHead(value){
    selectedHeadType = value
}

function gerarListaEl(){
    el_table.innerHTML = ""
    tree.map((el)=> {
        if (el["v"] !== "lex"){
            let itemName = document.createElement("Label")
            let selectElBox = document.createElement("INPUT")
            selectElBox.setAttribute("type", "radio")
            selectElBox.setAttribute("name", "selectEl")
            selectElBox.setAttribute("value", el["name"])       
            itemName.innerHTML = el["name"]
            itemName.setAttribute("for", el["name"])
           
            el_table.appendChild(selectElBox)
            el_table.appendChild(itemName)
            
            itemName.insertAdjacentHTML("afterend", "<br>")
        }
        
        el_table[el_table.length -1].setAttribute("checked", "true")
        selectedVariable = el_table[el_table.length -1].value
        
    })
    showOptions(selectedVariable)
}

function showOptions(v){
    let layer = v.slice(0, -1)
    if (layer === "coord"){
        options.innerHTML = ""
        let altBtn = document.createElement("button")
        altBtn.innerText = "ALT"
        altBtn.addEventListener("click", (e) => {
            let thisCoord = searchTree("name", selectedVariable)[0]
            tempCoordList = thisCoord["head"]
            if (tempCoordList.length > 1){
                for (let i = 0; i < tempCoordList.length; i++){
                    console.log(i);
                    if (i > 0) {
                        let newSpan = document.createElement("span")
                        newSpan.innerHTML = " ALT "
                        newSpan.style.fontSize = "smaller"
                        let member = document.getElementById(tempCoordList[i]).parentNode
                        member.insertAdjacentElement("afterbegin", newSpan)
                    }
                }
            } else {
                console.log("This coordination has less than 2 members");
            }
            
        })
        let selectFunction = document.createElement("select")
        selectFunction.setAttribute("id", "selectFunc")
        var functions = ["None", "A", "U", "Loc", "Ref"]
        functions.map((f) => {
            let fopt = document.createElement("option")
            fopt.setAttribute("value", f)
            fopt.innerText = f
            
            selectFunction.appendChild(fopt)
        })
        selectFunction.addEventListener("change", (e)=> {
            addFunction(selectedVariable, e.target.value)
        })
        let label = document.createElement("label")
        label.setAttribute("for", "selectFunc")
        label.innerText = "Select a Function for the variable"
        options.appendChild(label)
        options.appendChild(selectFunction)
        options.appendChild(altBtn)
    } else if (layer !== "lex"){
        options.innerHTML = ""
        //Select Function
        let selectFunction = document.createElement("select")
        selectFunction.setAttribute("id", "selectFunc")
        var functions = ["None", "A", "U", "Loc", "Ref"]
        functions.map((f) => {
            let fopt = document.createElement("option")
            fopt.setAttribute("value", f)
            fopt.innerText = f
            
            selectFunction.appendChild(fopt)
        })
        selectFunction.addEventListener("change", (e)=> {
            addFunction(selectedVariable, e.target.value)
        })
        let label = document.createElement("label")
        label.setAttribute("for", "selectFunc")
        label.innerText = "Select a Function for the variable"
        options.appendChild(label)
        options.appendChild(selectFunction)

        //Add Operator
        let textOp = document.createElement("INPUT")
        textOp.setAttribute("type", "text")
        textOp.setAttribute("id", "addop")
        textOp.setAttribute("name", "addop")
        textOp.setAttribute("placeholder", "Type operator here...")
        let addOpBtn = document.createElement("button")
        addOpBtn.addEventListener("click", (e) => {
            addOperator(selectedVariable, textOp.value)
        })
        addOpBtn.innerText = "Add Operator"
        
        options.appendChild(textOp)
        options.appendChild(addOpBtn)
        textOp.insertAdjacentHTML("beforebegin", "<br><br><br>")
    } else {
        console.log("object");
    }
}

function addFunction(v, f){
    if (selectedVariable !== "None")
        {let el = searchTree("name", v)[0]
        
        el["func"] = f
        let layer = document.getElementById(v)
        parseTree()
        }
    
    //layer.parentElement.insertAdjacentHTML("afterend", `<span>${f.sub()}</span>`)
}

function addOperator(v, op){
    if (selectedVariable !== "None")
    {
        let el = searchTree("name", v)[0]
        el["op"] = op + " "
        parseTree()
    }
}
 

function parseTree(){
    representation.innerHTML = ""
    
    tree.map((el)=>{
        
        //Se for o primeiro elemento e não for coordenação      
        if (el["parent"] == "None" && el["v"] !== "fc" && el["v"] !== "coord"){
            
            let tempEl = document.createElement("span")
            let tempStart = document.createElement("span")
            tempStart.innerHTML = "("
            let tempOp = document.createElement("span")
            tempOp.innerHTML = el["op"]
            let tempHead = document.createElement("span")
            tempHead.setAttribute("id", el["name"])
            
            let tempV = document.createElement("span")
            tempV.innerHTML = `${el["v"]}${el["i"].sub()}: `
            let tempMod = document.createElement("span")
            tempMod.setAttribute("id", `mod${el["v"]+el["i"]}`)
            if (el["mod"] !== ""){
                tempMod.innerHTML = ` (${el["v"]+el["i"].sub()}): `
            }
            let tempEnd = document.createElement("span")
            tempEnd.innerHTML = ` (${el["v"]}${el["i"].sub()}))`
    
            let tempFunc = document.createElement("span")
            if(el["func"] !== ""){
                tempFunc.innerHTML = el["func"].sub()
            }
            
            tempEl.appendChild(tempStart)
            tempEl.appendChild(tempOp)
            tempEl.appendChild(tempV)
            tempEl.appendChild(tempHead)
            tempEl.appendChild(tempMod)
            tempEl.appendChild(tempEnd)
            tempEl.appendChild(tempFunc)
            
            representation.appendChild(tempEl)
        } 
        //if is the first AND is a config property
        else if (el["parent"] == "None" && el["v"] == "fc"){
            
            
            let tempEl = document.createElement("span")
            let tempStart = document.createElement("span")
            tempStart.innerHTML = "("
            let tempOp = document.createElement("span")
            tempOp.innerHTML = el["op"]
            let tempHead = document.createElement("span")
            tempHead.setAttribute("id", el["name"])
            
            let tempV = document.createElement("span")
            tempV.innerHTML = `f${"c".sup()}${el["i"].sub()}: [`
            let tempMod = document.createElement("span")
            tempMod.setAttribute("id", `mod${el["v"]+el["i"]}`)
            
            let tempEnd = document.createElement("span")
            tempEnd.innerHTML = `] (f${"c".sup()}${el["i"].sub()}))`
            
            if (el["mod"] !== ""){
                tempMod.innerHTML = ` ] (f${"c".sup()+el["i"].sub()}): `
                tempEnd.innerHTML = ` (f${"c".sup()}${el["i"].sub()}))`
            }
            
            let tempFunc = document.createElement("span")
            if(el["func"] !== ""){
                tempFunc.innerHTML = el["func"].sub()
            }
            tempEl.appendChild(tempStart)
            tempEl.appendChild(tempOp)
            tempEl.appendChild(tempV)
            tempEl.appendChild(tempHead)
            tempEl.appendChild(tempMod)
            tempEl.appendChild(tempEnd)
            tempEl.appendChild(tempFunc)

            representation.appendChild(tempEl)
        } 
        //if is not the first and is a config property
        else if (el["v"] === "fc"){
            
            let tempParentEl = document.getElementById(el["parent"]) 
            
            let tempEl = document.createElement("span")
            let tempStart = document.createElement("span")
            tempStart.innerHTML = "("
            let tempOp = document.createElement("span")
            tempOp.innerHTML = el["op"]
            let tempHead = document.createElement("span")
            tempHead.setAttribute("id", el["name"])
            
            let tempV = document.createElement("span")
            tempV.innerHTML = `f${"c".sup()}${el["i"].sub()}: [`
            let tempMod = document.createElement("span")
            tempMod.setAttribute("id", `mod${el["v"]+el["i"]}`)
            
            let tempEnd = document.createElement("span")
            tempEnd.innerHTML = `] (f${"c".sup()}${el["i"].sub()}))`
            
            if (el["mod"] !== ""){
                tempMod.innerHTML = ` ] (f${"c".sup()+el["i"].sub()}): `
                tempEnd.innerHTML = ` (f${"c".sup()}${el["i"].sub()}))`
            }
    
            let tempFunc = document.createElement("span")
            if(el["func"] !== ""){
                tempFunc.innerHTML = el["func"].sub()
            }

            tempEl.appendChild(tempStart)
            tempEl.appendChild(tempOp)
            tempEl.appendChild(tempV)
            tempEl.appendChild(tempHead)
            tempEl.appendChild(tempMod)
            tempEl.appendChild(tempEnd)
            tempEl.appendChild(tempFunc)

            tempParentEl.appendChild(tempEl)
            
        } 
        //if it is a coordination
        else if (el["v"] == "coord"){
            
            if (el["parent"] !== "None"){
                let tempParentEl = document.getElementById(el["parent"])
                let tempEl = document.createElement("span")
                let tempStart = document.createElement("span")
                tempStart.innerHTML = "[" 
                let tempHead = document.createElement("span")
                tempHead.setAttribute("id", el["name"])
                let tempEnd = document.createElement("span")
                tempEnd.innerHTML = "]"
                let tempFunc = document.createElement("span")
                if(el["func"] !== ""){
                    tempFunc.innerHTML = el["func"].sub()
                }

                tempEl.appendChild(tempStart)
                tempEl.appendChild(tempHead)
                tempEl.appendChild(tempEnd)
                tempEl.appendChild(tempFunc)

                tempParentEl.appendChild(tempEl)

            } else {
                let tempEl = document.createElement("span")
                let tempStart = document.createElement("span")
                tempStart.innerHTML = "[" 
                let tempHead = document.createElement("span")
                tempHead.setAttribute("id", el["name"])
                let tempEnd = document.createElement("span")
                tempEnd.innerHTML = "]"
                let tempFunc = document.createElement("span")
                if(el["func"] !== ""){
                    tempFunc.innerHTML = el["func"].sub()
                }

                tempEl.appendChild(tempStart)
                tempEl.appendChild(tempHead)
                tempEl.appendChild(tempEnd)
                tempEl.appendChild(tempFunc)

                representation.appendChild(tempEl)
            }
        }
        //Se for uma v comum ou um modificador
        else if (el["v"] !== "lex" && el["v"] !== "op" && el["v"] !== "fc") {
            
            
            let tempParentEl = document.getElementById(el["parent"]) 
            
            let tempEl = document.createElement("span")
            let tempStart = document.createElement("span")
            tempStart.innerHTML = "("
            let tempOp = document.createElement("span")
            tempOp.innerHTML = el["op"]
            let tempHead = document.createElement("span")
            tempHead.setAttribute("id", el["name"])
            
            let tempV = document.createElement("span")
            tempV.innerHTML = `${el["v"]}${el["i"].sub()}: `
            let tempMod = document.createElement("span")
            tempMod.setAttribute("id", `mod${el["v"]+el["i"]}`)
            
            let tempEnd = document.createElement("span")
            tempEnd.innerHTML = ` (${el["v"]}${el["i"].sub()}))`
            
            if (el["mod"] !== ""){
                tempMod.innerHTML = ` (${el["v"]+el["i"].sub()}): `
            }
            
            let tempFunc = document.createElement("span")
            if(el["func"] !== ""){
                tempFunc.innerHTML = el["func"].sub()
            }

            
            tempEl.appendChild(tempStart)
            tempEl.appendChild(tempOp)
            tempEl.appendChild(tempV)
            tempEl.appendChild(tempHead)
            tempEl.appendChild(tempMod)
            tempEl.appendChild(tempEnd)
            tempEl.appendChild(tempFunc)
            
            tempParentEl.appendChild(tempEl)

        }
        //se for um lex
        else if (el["v"] === "lex"){
            
            let tempParentEl = document.getElementById(el["parent"])
            
            let tempEl = document.createElement("span")
            tempEl.innerHTML = el["head"]
            tempParentEl.appendChild(tempEl)
        }
        
    })
}
let modCheck = document.getElementById("ismod")

function addToTree(selected){
    
    let element = {
    }
    element["v"] = selected
    element["parent"] = selectedVariable
    element["head"] = ""
    element["op"] = ""
    element["mod"] = ""
    element["func"] = ""
    
    if (selected == "coord" || selected == "fc"){
        element["head"] = []
        
    }

    if (tree.length > 0 && modCheck.checked === true){
        element["parent"] = `mod${selectedVariable}`
        let modParent = searchTree("name", selectedVariable)
        let count = 0
        tree.map((el)=> {
            if (el["v"] == element["v"]){
                count ++
            }
        
        })
        element["i"] = indices[count]
        modParent[0]["mod"] = `${element["v"]+element["i"]}`
        
    } else if (tree.length === 0 && modCheck.checked === true){
        
        return
    } else if (tree.length === 0 && selected == "lex"){
        
        return
        
    }

    if (tree.length > 0 && selected !== "lex") {
        
        let count = 0
        tree.map((el)=> {
            if (el["v"] == element["v"]){
                count ++
            }
        
        })
        element["i"] = indices[count]
        element["name"] = `${element["v"]+element["i"]}`
        tree.push(element)
        
    } else if (tree.length === 0 && selected !== "lex") {
        
        element["i"] = "i"
        element["name"] = `${element["v"]+element["i"]}`
        tree.push(element)
    }
    else if (tree.length > 0 && selected === "lex") {
        let count = 0
        
        tree.map((el)=> {
            if (el["v"] == element["v"]){
                count ++
            }
        
        })
        element["i"] = indices[count]
        element["head"] = lexeme
        element["name"] = `${element["v"]+element["i"]}`
        tree.push(element)
    } else if (tree.length === 0 && selected === "lex"){
        
        element["i"] = "i"
        element["head"] = lexeme
        element["name"] = `${element["v"]+element["i"]}`
        tree.push(element)
    } 
    
    if (element["parent"] !== "None" && selected !== "lex"){
        let parent = searchTree( "name", selectedVariable)[0]
        if (parent["v"] !== "coord" && parent["v"] !== "fc"){
            parent["head"] = element["name"]
            
        } else {
            
            parent["head"].push(element["name"])
            
        }

    }
    
    
    parseTree()
    gerarListaEl()
    
    
}

function copyToClip(str) {
    function listener(e) {
        
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  };


//Add event listeners
//first step
headSelection.addEventListener("change", (e)=> {
    if (e.target.value !== "lex"){
        
        if (document.getElementById("lexbox") !== null)
            {let lexbox = document.getElementById("lexbox")
            selectContainer.removeChild(lexbox)}
        
        selectHead(e.target.value)
    } 
    
    else {
        selectedHeadType = "lex"
        let lexBox = document.createElement("INPUT")
        lexBox.setAttribute("type", "text")
        lexBox.setAttribute("id", "lexbox")
        lexBox.addEventListener("change", (e)=>{
            lexeme = e.target.value
            
            
        })
        selectContainer.appendChild(lexBox)
    }
    
})
//second step
addHeadBtn.addEventListener("click", (e)=> {
    
    addToTree(selectedHeadType)
})

el_table.addEventListener("change", (e) => {
    selectedVariable = e.target.value
    showOptions(selectedVariable)
})

resetBtn.addEventListener("click", (e) => {
    tree.length = 0
    selectedVariable = "None"
    parseTree()
    gerarListaEl()
})

copyBtn.addEventListener("click", (e) => {
    copyToClip(representation.innerHTML)
})

helpBtn.addEventListener("click", (e)=> {
    if (helpDisplay.style.display === "none"){
        helpDisplay.style.display = "block"
        helpBtn.innerText = "Hide Help"
    } else {
        helpDisplay.style.display = "none"
        helpBtn.innerText = "Show Help"
    }
})

parseTree()
gerarListaEl()