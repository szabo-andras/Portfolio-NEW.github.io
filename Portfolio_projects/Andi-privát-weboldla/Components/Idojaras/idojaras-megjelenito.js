const weatherData = [];

for (let hour = 0; hour < 24; hour++) {
    weatherData.push({
        hour: hour,
        homerseklet: 14 + Math.round(Math.random() * 8),
        hoerzet: 13 + Math.round(Math.random() * 8),
        szelero: 5 + Math.round(Math.random() * 20),
        csapadek: Math.round(Math.random() * 10) / 10,
        uv: hour >= 8 && hour <= 18
            ? Math.round(Math.random() * 6)
            : 0
    });
}


const weatherDate = document.querySelector("#idojaras-datum");

const forecast = document.querySelector(
    "#idojaras-megjelenito_tablazat"
);


const checkboxes = document.querySelectorAll(
    "#idojaras_kijelzo input[type='checkbox']"
);


function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


weatherDate.value = getToday();


function renderWeather() {

    forecast.innerHTML = "";

    const table = document.createElement("table");


    // -------------------------
    // FEJLÉC
    // -------------------------

    const thead = document.createElement("thead");

    const headerRow = document.createElement("tr");


    // Bal felső üres cella
    const emptyHeaderCell = document.createElement("th");

    headerRow.appendChild(emptyHeaderCell);


    // Órák
    weatherData.forEach(data => {

        const hourCell = document.createElement("th");

        hourCell.textContent =
            `${String(data.hour).padStart(2, "0")}:00`;

        headerRow.appendChild(hourCell);
    });


    thead.appendChild(headerRow);

    table.appendChild(thead);


    // -------------------------
    // TÁBLÁZAT TÖRZSE
    // -------------------------

    const tbody = document.createElement("tbody");


    const labels = {
        homerseklet: "Hőmérséklet",
        hoerzet: "Hőérzet",
        szelero: "Szélerő",
        csapadek: "Csapadék",
        uv: "UV-index"
    };


    checkboxes.forEach(checkbox => {

        // Ha nincs bepipálva, ezt az adatot nem jelenítjük meg.
        if (!checkbox.checked) {
            return;
        }


        const dataName = checkbox.dataset.idojaras;


        const row = document.createElement("tr");


        // Sor megnevezése
        const labelCell = document.createElement("th");

        labelCell.scope = "row";
        labelCell.textContent = labels[dataName];

        row.appendChild(labelCell);


        // Az adott adat 24 órás értékei
        weatherData.forEach(data => {

            const valueCell = document.createElement("td");

            valueCell.textContent = getFormattedValue(
                dataName,
                data[dataName]
            );

            row.appendChild(valueCell);
        });


        tbody.appendChild(row);
    });


    table.appendChild(tbody);

    forecast.appendChild(table);
}


function getFormattedValue(type, value) {

    switch (type) {

        case "homerseklet":
        case "hoerzet":
            return `${value} °C`;

        case "szelero":
            return `${value} km/h`;

        case "csapadek":
            return `${value} mm`;

        case "uv":
            return value;

        default:
            return value;
    }
}


// -------------------------
// CHECKBOXOK FIGYELÉSE
// -------------------------

checkboxes.forEach(checkbox => {

    checkbox.addEventListener("change", renderWeather);
});


// -------------------------
// DÁTUM VÁLTOZÁS FIGYELÉSE
// -------------------------

weatherDate.addEventListener("change", renderWeather);


// -------------------------
// ELSŐ MEGJELENÍTÉS
// -------------------------

renderWeather();