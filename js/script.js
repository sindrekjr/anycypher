let ignoreBracket = "[]";
let selected, cypher;

$().ready(() => initialize());

function initialize() {
    selectCypher(Object.keys(cyphers)[0]);
    initializeNav();
    addInputListeners();
    updateButtonVisibility();
}

function selectCypher(name) {
    if(name) {
        selected = name;
        cypher = cyphers[selected];
        $('#out .input-head').html(selected);
        generateAlphabet();
        updateText(); 
    }
}

function changeCypher(event) {
    if(event.currentTarget.classList.contains('letter')) {
        cypher[event.target.name] = event.target.value;
    }
}

function updateCypher() {
    cypher = parseInputFields();
    updateButtonVisibility();
    updateText(); 
}

function addInputListeners() {
    $('#in .input').on('keyup', () => updateText('out'));
    $('#out .input').on('keyup', () => updateText('in'));

    $('#save').on('click', (event) => saveCypher(event, $('#name').val()));
    $('#upload').on('click', (event) => uploadCypher(event));
    $('#download').on('click', (event) => downloadCypher(event));
}

function initializeNav() {
    $('nav').empty(); 
    for(let c in cyphers) {
        $('nav').append(
            $('<label class=select>').append(
                $('<input type=radio name=cypher value="' + c + '">')
            ).append(c)
        );
    }

    $('input[type=radio][name=cypher]').change(function() {
        if(selected != this.value) {
            selectCypher(this.value);
            updateColor();
        }
    });

    updateColor();
}

function updateColor() {
    $('.select').each(function() {
        let input = $(this).children()[0];
        if(input.value === selected) input.checked = true;
        this.style.background = (input.checked) ? "#" + getColourFromString(input.value) : "#222";
    });
}

function getColourFromString(str) {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let c = (hash & 0x00FFFF).toString(12).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

function generateAlphabet() {
    let form = $('.alphabet').empty();
    for(let letter in cypher) {
        form.append(
            $('<label class=letter>').append(letter).append(
                $('<input name=' + letter + '>').val(cypher[letter])
            ).on('keyup', (event) => updateCypher())
        );
    }
}

function flipObjectValues(obj) {
    let flipped = {}
    for(let key in obj) flipped[obj[key]] = key;
    return flipped;
}

function updateText(field = 'out') {
    if(field === 'out') {
        $('#out .input').val(translate($('#in .input').val(), cypher));
    } else {
        $('#in .input').val(translate($('#out .input').val(), flipObjectValues(cypher)));
    }
}

function updateButtonVisibility() {
    let isActuallyNew = true; 
    for(let c in cyphers) {
        if(objectsAreEqual(cypher, cyphers[c])) {
            isActuallyNew = false; 
        }
    }

    if(isActuallyNew) {
        $('#name').show();
        $('#save').show(); 
    } else {
        $('#name').hide();
        $('#save').hide(); 
    }
}

function objectsAreEqual(a, b) {
    if(a.length != b.length) {
        return false;
    } else {
        for(let key in a) {
            if(a[key] != b[key]) return false;
        }
    }
    return true;
}

function translate(text, cypher) {
    let ignore = false;
    let translated = "";
    for(let i = 0; i < text.length; i++) {
        let c = text[i];
        let upper = !$.isNumeric(c) && c == c.toUpperCase();
        if(ignoreBracket.includes(c)) ignore = !ignore;

        if(ignore) {
            translated += c;
        } else {
            if(upper) {
                translated += (cypher[c.toLowerCase()] || c).toUpperCase();
            } else {
                translated += (cypher[c.toLowerCase()] || c);
            }
        }
    }
    return translated;
}

function parseInputFields() {
    let form = $('.letter input');
    let mapped = {}; 
    for(let key in form) {
        if(parseInt(key) || key == 0) {
            mapped[form[key]['name']] = form[key]['value'];
        }
    }
    return mapped; 
}

function saveCypher(event, name = "") {
    let input = parseInputFields(); 
    if(name) {
        cyphers[name] = input; 
    } else {
        for(let key in input) {
            name += input[key];
        }
        cyphers[name.substr(0,10)] = input; 
    }
    initializeNav(); 
}

function uploadCypher(event) {
    console.log(event);
}

function downloadCypher(event, name = 'cypher.json', all = false) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(parseInputFields())], { type:'text/json' }));
    a.download = name;
    a.click();
}

const cyphers = {
    "Al Bhed": {
        "a":"y",
        "b":"p",
        "c":"l",
        "d":"t",
        "e":"a",
        "f":"v",
        "g":"k",
        "h":"r",
        "i":"e",
        "j":"z",
        "k":"g",
        "l":"m",
        "m":"s",
        "n":"h",
        "o":"u",
        "p":"b",
        "q":"x",
        "r":"n",
        "s":"c",
        "t":"d",
        "u":"i",
        "v":"j",
        "w":"f",
        "x":"q",
        "y":"o",
        "z":"w"
    },
    "l33t": {
        "a":"4",
        "b":"8",
        "c":"(",
        "d":"|)",
        "e":"3",
        "f":"ph",
        "g":"6",
        "h":"|-|",
        "i":"!",
        "j":"j",
        "k":"|<",
        "l":"1",
        "m":"^^",
        "n":"|\\|",
        "o":"0",
        "p":"P",
        "q":"kw",
        "r":"l2",
        "s":"$",
        "t":"7",
        "u":"|_|",
        "v":"V",
        "w":"\\/\\/",
        "x":"><",
        "y":"'/",
        "z":"2"
    }
}
