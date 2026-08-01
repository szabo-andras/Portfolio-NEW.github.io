// TERV
// ✅ országkód külön mező
// ✅ országkód határozza meg a formátumot
// ✅ telefonszám csak számokat fogad (mobilon)

// ✅ input esemény figyel
// ✅ minden változás után újraformáz
// ✅ részleges értéket is kezel 

// 1. országformátumok adatai

// 2. HTML elemek kiválasztása

// 3. telefonszám tisztító függvény

// 4. formázó függvény

// 5. kurzor kezelése

// 6. eseményfigyelők

const phoneFormats = {
    "+36": {
        groups : [2, 3, 2, 2]
    },
    "+45": {
        groups : [2, 2, 2, 2]
    }
}

const countryCodeSelect = document.querySelector ("#orszag-kod");
const phoneInput = document.querySelector ("#telefonszam");

console.log(countryCodeSelect.value);
console.log(phoneInput);

// első esemény figyeljük a telefonszám input mezőt, hogy változik-e
phoneInput.addEventListener("input", () => {

    const cursorDigitPosition = getCursorDigitPosition(
        phoneInput.value,
        phoneInput.selectionStart
    );


    const cleanValue = cleanPhoneNumber(phoneInput.value);


    const formattedValue = formatPhoneNumber(
        cleanValue,
        countryCodeSelect.value
    );


    phoneInput.value = formattedValue;


    const newCursorPosition = getCursorPositionAfterFormat(
        formattedValue,
        cursorDigitPosition
    );


    phoneInput.setSelectionRange(
        newCursorPosition,
        newCursorPosition
    );

});

// második esemény, tisztítjuk a telefonszám mezőt, ha nem megfelelő karakter érkezett
function cleanPhoneNumber(value) {
    return value.replace(/\D/g, "");
}
console.log(cleanPhoneNumber("30-123-12-12"));
console.log(cleanPhoneNumber("30 abc 123"));

// Kurzor helybentartása
function getCursorDigitPosition(value, cursorPosition) {
    const beforeCursor = value.slice(0, cursorPosition);
    return cleanPhoneNumber(beforeCursor).length;
}

console.log(
    getCursorDigitPosition("30-123-12-12", 4)
);

function getCursorPositionAfterFormat(value, digitPosition) {

    let digitCount = 0;

    for (let i = 0; i < value.length; i++) {

        if (/\d/.test(value[i])) {
            digitCount++;
        }

        if (digitCount === digitPosition) {
            return i + 1;
        }
    }

    return value.length;
}

console.log(
    getCursorPositionAfterFormat("30-123-12-12", 3)
);

// Telefonszám hossz ellenőrző függvény
function formatPhoneNumber(value, countryCode) {
    const format = phoneFormats[countryCode];
    const groups = format.groups;
    let position = 0;
    const parts = [];
    groups.forEach(groupLength => {
        const part = value.substring(
            position,
            position + groupLength
        );
        parts.push(part);
        position += groupLength;
    });
    return parts.join("-");
}


console.log(
    formatPhoneNumber("301231212", "+36")
);
