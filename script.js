// script.js - handles currency conversion logic
// NOTE: for fetch to work when opening the HTML from the file system you
// might need to run a local HTTP server (e.g. use VS Code Live Server) rather
// than opening the file directly.  CORS restrictions under file:// can
// prevent network requests.

document.addEventListener("DOMContentLoaded", () => {
    const fromSelect = document.querySelector(".from select");
    const toSelect = document.querySelector(".to select");
    const amountInput = document.querySelector(".amount input");
    const exchangeRateText = document.querySelector(".exchangerate");
    const button = document.querySelector("button");
    const icon = document.querySelector(".icon");

    // mapping from currency codes to country codes for flag images
    const country_list = {
        GHS: "GH", DZD: "DZ", AOA: "AO", XOF: "SN", BWP: "BW",
        BIF: "BI", XAF: "CF", CVE: "CV", CDF: "CD", KMF: "KM",
        DJF: "DJ", EGP: "EG", ERN: "ER", SZL: "SZ", ETB: "ET",
        GMD: "GM", GNF: "GN", KES: "KE", LSL: "LS", LRD: "LR",
        LYD: "LY", MGA: "MG", MWK: "MW", MRU: "MR", MUR: "MU",
        MAD: "MA", MZN: "MZ", NAD: "NA", NGN: "NG", RWF: "RW",
        SCR: "SC", SLL: "SL", SOS: "SO", ZAR: "ZA", SSP: "SS",
        SDG: "SD", TZS: "TZ", TND: "TN", UGX: "UG", ZMW: "ZM",
        ZWL: "ZW",
    };

    function updateFlag(select) {
        const code = select.value;
        const countryCode = country_list[code] || code.slice(0, 2);
        const img = select.parentElement.querySelector("img");
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }

    function getExchangeRate() {
        const amount = parseFloat(amountInput.value.trim()) || 1;
        const from = fromSelect.value;
        const to = toSelect.value;
        exchangeRateText.innerText = `Getting exchange rate...`;

        // using exchangerate-api.com (free tier) with provided key
        // https://v6.exchangerate-api.com/v6/DIRECT_KEY/latest/{from}
        const apiKey = "d400d1ed96c0addc15ebada4";
        fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || data.result !== "success" || !data.conversion_rates) {
                    console.warn("exchange API returned unexpected data", data);
                    exchangeRateText.innerText = "Rate not available";
                    return;
                }
                const rate = data.conversion_rates[to];
                if (rate === undefined) {
                    exchangeRateText.innerText = "Currency not supported";
                    return;
                }
                const total = rate * amount;
                exchangeRateText.innerText = `${amount} ${from} = ${total.toFixed(2)} ${to}`;
            })
            .catch((err) => {
                console.error("fetch error", err);
                exchangeRateText.innerText = "Something went wrong";
            });
    }

    amountInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
    });

    // initialize flags and get a default rate
    updateFlag(fromSelect);
    updateFlag(toSelect);
    getExchangeRate();

    fromSelect.addEventListener("change", () => updateFlag(fromSelect));
    toSelect.addEventListener("change", () => updateFlag(toSelect));

    button.addEventListener("click", (e) => {
        e.preventDefault();
        getExchangeRate();
    });

    icon.addEventListener("click", () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        updateFlag(fromSelect);
        updateFlag(toSelect);
        getExchangeRate();
    });
});