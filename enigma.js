const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// Initialiser les rotors (la lettre tourne quand on arrive à nouveau à la premiere lettre)
const rotor1Initial = ['h', 'l', 'v', 's', 'g', 'k', 'q', 't', 'o', 'p', 'f', 'i', 'a', 'z', 'e', 'c', 'x', 'm', 'w', 'r', 'u', 'y', 'j', 'n', 'b', 'd'];
let rotor1 = [...rotor1Initial];
let rotor1StepLetter = 'h';

const rotor2Initial = ['c', 'g', 's', 'a', 'h', 'v', 't', 'r', 'i', 'j', 'l', 'x', 'z', 'w', 'o', 'n', 'q', 'e', 'y', 'u', 'k', 'm', 'p', 'b', 'd', 'f'];
let rotor2 = [...rotor2Initial];
let rotor2StepLetter = 'c';

const rotor3Initial = ['l', 'a', 'c', 'z', 'r', 't', 'k', 'b', 'q', 'y', 'f', 'j', 'g', 'u', 'o', 'x', 'v', 's', 'h', 'w', 'i', 'm', 'n', 'p', 'd', 'e'];
let rotor3 = [...rotor3Initial];

const reflector = ['f', 'v', 'p', 'j', 'i', 'a', 'o', 'y', 'e', 'd', 'r', 'z', 'x', 'w', 'g', 'c', 't', 'k', 'u', 'q', 's', 'b', 'n', 'm', 'h', 'l'];

const substitutionDictionnary = {};

function decrypt() {
    let input = document.getElementById("input").value;

    if(input.length > 0) {
        let encryptOutput = codeString(input);
        let outputChars = encryptOutput.split('');
        let result = [];
        for(const char of outputChars) {
            let finalChar = char;
            if(substitutionDictionnary[char]) {
                finalChar = substitutionDictionnary[char];
            }
            else if(Object.keys(substitutionDictionnary).find(key => substitutionDictionnary[key] === char)) {
                finalChar = Object.keys(substitutionDictionnary).find(key => substitutionDictionnary[key] === char)
            }
            result.push(finalChar);
        }
        let finalOutput = result.join('')
        console.log("decrypt result : " + finalOutput);

        addToResults(finalOutput);
    }
}

function encrypt() {
    let input = document.getElementById("input").value;
    if(input.length > 0) {
        let finalOutput = codeString(input);
        console.log("encrypt result : " + finalOutput);
    
        addToResults(finalOutput);
    }
}

function codeString(input) {
    if(input.length > 0) {
        console.log("encrypt : " + input);
        illuminateImage();

        let inputChars = input.toLowerCase().replace(/\s/g, '').split('');
        let result = [];
        //Chiffrer chaque lettre de l'input une par une
        for(const char of inputChars) {
            result.push(codeLetter(char));
        }
        let finalOutput = result.join('')
        return finalOutput;
    }
}

function codeLetter(charInput) {
    let char = charInput;

    //Checker si il faut remplacer la lettre par une autre
    if(substitutionDictionnary[charInput]) {
        char = substitutionDictionnary[charInput];
    }
    else if(Object.keys(substitutionDictionnary).find(key => substitutionDictionnary[key] === charInput)) {
        char = Object.keys(substitutionDictionnary).find(key => substitutionDictionnary[key] === charInput)
    }

    let charIndex = alphabet.indexOf(char);

    //Rotor 1            
    let rotor1Letter = rotor1[charIndex];
    
    //Rotor 2
    charIndex = alphabet.indexOf(rotor1Letter);
    let rotor2Letter = rotor2[charIndex];

    //Rotor 3
    charIndex = alphabet.indexOf(rotor2Letter);
    let rotor3Letter = rotor3[charIndex];


    //Reflecteur
    charIndex = alphabet.indexOf(rotor3Letter);
    let reflectorLetter = reflector[charIndex];

    //Rotor 3 sens inverse
    charIndex = rotor3.indexOf(reflectorLetter);
    let reflectedRotor3Letter = alphabet[charIndex];

    //Rotor 2 sens inverse
    charIndex = rotor2.indexOf(reflectedRotor3Letter);
    let reflectedRotor2Letter = alphabet[charIndex];

    //Rotor 1 sens inverse
    charIndex = rotor1.indexOf(reflectedRotor2Letter);
    let finalChar = alphabet[charIndex];


    //Rotation des rotors
    let shiftedLetter = rotor1.shift();
    rotor1.push(shiftedLetter);
    if(rotor1[0] == rotor1StepLetter) {
        shiftedLetter = rotor2.shift();
        rotor2.push(shiftedLetter);

        if(rotor2[0] == rotor2StepLetter) {
            shiftedLetter = rotor3.shift();
            rotor3.push(shiftedLetter);
        }
    }

    return finalChar;
}

function resetRotors() {
    console.log("reset rotors");
    
    rotor1 = [...rotor1Initial];
    rotor2 = [...rotor2Initial];
    rotor3 = [...rotor3Initial];

    addOk();
}

function addCouple() {
    let letterOneElement = document.getElementById("new-couple-letter-one");
    let letterTwoElement = document.getElementById("new-couple-letter-two");

    let firstLetter = letterOneElement.value.toLowerCase();
    let secondLetter = letterTwoElement.value.toLowerCase();

    if (firstLetter == secondLetter
        || Object.keys(substitutionDictionnary).length >= 10
        || Object.values(substitutionDictionnary).indexOf(firstLetter) > -1
        || Object.values(substitutionDictionnary).indexOf(secondLetter) > -1
        || firstLetter in substitutionDictionnary 
        || secondLetter in substitutionDictionnary) {
        console.log(firstLetter + " or " + secondLetter + " is already matched, or max lenght reached");
        letterOneElement.style.color = letterTwoElement.style.color = 'red';
    }
    else {
        console.log("ok can add couple");
        substitutionDictionnary[firstLetter] = secondLetter;

        // Style
        let substitutionList = document.getElementById("substitution-couples-list");
        let coupleString = firstLetter + '-' + secondLetter;

        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(coupleString));
        entry.setAttribute('data-couple-string', coupleString);

        var deleteButton = document.createElement('button');
        deleteButton.appendChild(document.createTextNode('x'));        
        deleteButton.onclick = removeCouple;
        deleteButton.classList.add('couple-delete-btn');

        entry.appendChild(deleteButton);
        substitutionList.appendChild(entry);

        letterOneElement.value = letterTwoElement.value = '';
        document.getElementById("add-couple-button").style.visibility = 'hidden';
    }
}

function removeCouple(event) {
    console.log("remove couple");
    var listItem = event.target.closest('li');
    var coupleString = listItem.getAttribute('data-couple-string');

    let firstLetterOfCouple = coupleString.charAt(0);
    let secondLetterOfCouple = coupleString.charAt(2);

    delete substitutionDictionnary[firstLetterOfCouple];
    delete substitutionDictionnary[secondLetterOfCouple];

    listItem.remove();
}

// Style

function checkInput() {
    let inputCheck = document.getElementById("input").value;
    if(inputCheck.length > 0) {
        document.getElementById("clear-button").style.visibility = 'visible';
    }
    else {
        document.getElementById("clear-button").style.visibility = 'hidden';
    }
}

function clearInput() {
    document.getElementById("input").value = '';
    checkInput();
}


function illuminateImage() {
    const image = document.getElementById('enigma-machine');
    
    // Ajout des classes pour déclencher l'animation
    image.classList.add('illumination');
    
    // Suppression des classes après l'animation
    setTimeout(function() {
      image.classList.remove('illumination');
    }, 1000);
}

function addOk() {
    let alertSpan = document.getElementById('ok-text');
    alertSpan.textContent = 'OK!';
    setTimeout(function() {
        alertSpan.textContent = "";
    }, 1500);
}

function checkLetterInput() {
    let letterOneElement = document.getElementById("new-couple-letter-one");
    let letterTwoElement = document.getElementById("new-couple-letter-two");

    let firstLetter = letterOneElement.value.toLowerCase();
    let secondLetter = letterTwoElement.value.toLowerCase();

    if(firstLetter && secondLetter) {
        if(firstLetter == secondLetter
            || !/^[a-zA-Z]*$/g.test(firstLetter) || !/^[a-zA-Z]*$/g.test(secondLetter)
            || Object.values(substitutionDictionnary).indexOf(firstLetter) > -1 
            || Object.values(substitutionDictionnary).indexOf(secondLetter) > -1
            || firstLetter in substitutionDictionnary 
            || secondLetter in substitutionDictionnary) 
        {
            letterOneElement.style.color = letterTwoElement.style.color = 'red';
            document.getElementById("add-couple-button").style.visibility = 'hidden';
        }
        else {
            letterOneElement.style.color = letterTwoElement.style.color = 'black';
            document.getElementById("add-couple-button").style.visibility = 'visible';
        }
    }
    else {
        letterOneElement.style.color = letterTwoElement.style.color = 'black';
        document.getElementById("add-couple-button").style.visibility = 'hidden';
    }
}

function loadSubstitutionDictionnary() {
    let substitutionList = document.getElementById("substitution-couples-list");
    for (const [key, value] of Object.entries(substitutionDictionnary)) {
        let coupleString = key + '-' + value;
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(coupleString));
        entry.setAttribute('data-couple-string', coupleString);

        var deleteButton = document.createElement('button');
        deleteButton.appendChild(document.createTextNode('x'));        
        deleteButton.onclick = removeCouple;
        deleteButton.classList.add('couple-delete-btn');

        entry.appendChild(deleteButton);
        substitutionList.appendChild(entry);
    }
}

function addToResults(result) {
    //Ajouter le resultat à la liste
    let resultsList = document.getElementById("results");
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(result));
    resultsList.appendChild(entry);
}

window.onload = function() {
    loadSubstitutionDictionnary();
};