const { createSecretKey } = require("crypto");
const https = require("https");
express = require("express");
const app = express();

function calculateTotal(items){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return items.reduce(reducer);
}

app.set('view engine', 'ejs');

app.get("/", (req, res) =>{
    res.render('index', {
        priceData: sendData
    });
})

app.get('/styles.css', function(req, res) {
    res.sendFile(__dirname + "/public/" + "styles.css");
});

app.get('/helper.js', function(req, res) {
    res.sendFile(__dirname + "/public/" + "helper.js");
});

app.listen(80);


let sendData = {}

// Declare some consts for easy reference
const GUTHAN = 0;
const DHAROK = 1;
const AHRIM = 2;
const TORAG = 3;
const KARIL = 4;
const VERAC = 5;

// List of item ids belonging to any given set
let sets = [];
sets[GUTHAN] = [4724, 4728, 4730, 4726];
sets[DHAROK] = [4716, 4720, 4722, 4718];
sets[AHRIM] = [4708, 4712, 4714, 4710];
sets[TORAG] = [4745, 4749, 4751, 4747];
sets[KARIL] = [4732, 4736, 4738, 4938];
sets[VERAC] = [4753, 4757, 4759, 4755];

// List of item ids for the armor sets for easy reference
let fullSet = [];
fullSet[GUTHAN] = 12873;
fullSet[DHAROK] = 12877;
fullSet[AHRIM] = 12881;
fullSet[TORAG] = 12879;
fullSet[KARIL] = 12883;
fullSet[VERAC] = 12875;

let lowPrices = [];
let highPrices = [];

// Initialize high and low variables for bundled armor set items.
let guthanHigh = 0;
let guthanLow = 0;
let dharokHigh = 0;
let dharokLow = 0;
let toragHigh = 0;
let toragLow = 0;
let veracHigh = 0;
let veracLow = 0;
let karilHigh = 0;
let karilLow = 0;
let ahrimHigh = 0;
let ahrimLow = 0;

// List of item IDs for crushable items
let crushables = [5075, 6693, 22124, 21975, 237, 235];
let crushableHighPrices = [];
let crushableLowPrices = [];

// Initialize array of items and add base items.
// Item sets must be added in the order helm > top > bottom > weapon > set as this is the order in which the prices are sent to the client.
items = [

    // Guthan's items
    {id: 4724, name: "Guthan's helm"},
    {id: 4728, name: "Guthan's platebody"},
    {id: 4730, name: "Guthan's chainskirt"},
    {id: 4726, name: "Guthan's warspear"},
    {id: 12873, name: "Guthan's armor set"},

    //Dharok's items
    {id: 4716, name: "Dharok's helm"},
    {id: 4720, name: "Dharok's platebody"},
    {id: 4722, name: "Dharok's platelegs"},
    {id: 4718, name: "Dharok's grateaxe"},
    {id: 12877, name: "Dharok's armor set"},

    //Ahrim's items
    {id: 4708, name: "Ahrim's hood"},
    {id: 4712, name: "Ahrim's robe top"},
    {id: 4714, name: "Ahrim's robe bottom"},
    {id: 4710, name: "Ahrim's staff"},
    {id: 12881, name: "Ahrim's's armor set"},

    //Torag's items
    {id: 4745, name: "Torag's helm"},
    {id: 4749, name: "Torag's platebody"},
    {id: 4751, name: "Torag's platelegs"},
    {id: 4747, name: "Torag's twin hammers"},
    {id: 12879, name: "Torag's armor set"},

    //Karil's items
    {id: 4732, name: "Karil's coif"},
    {id: 4736, name: "Karil's leathertop"},
    {id: 4738, name: "Karil's leatherskirt"},
    {id: 4938, name: "Karil's crossbow"},
    {id: 12883, name: "Karil's armor set"},

    //Verac's items
    {id: 4753, name: "Verac's helm"},
    {id: 4757, name: "Verac's brassard"},
    {id: 4759, name: "Verac's plateskirt"},
    {id: 4755, name: "Verac's flail"},
    {id: 12875, name: "Verac's armor set"},

    //Crushable items
    {id: 5075, name: "Bird's nest"},
    {id: 6693, name: "Crushed bird's nest"},
    {id: 22124, name: "Superior dragon bones"},
    {id: 21975, name: "Crushed superior dragon bones"},
    {id: 237, name: "Unicorn horn"},
    {id: 235, name: "Unicorn horn dust"},

];

// Zero out prices
items.forEach(function(item){
    item.high = 0;
    item.low = 0;
});

function fetchPrices(){
    items.forEach(function(item){
        https.get("https://prices.runescape.wiki/api/v1/osrs/latest?id=" + item.id.toString(), function(res){
            let data = "";
            res.on("data", function(chunk){
                data += chunk;
            })
    
            res.on("end", function(){
                itemData = JSON.parse(data);
                let high = itemData.data[item.id.toString()].high;
                let low = itemData.data[item.id.toString()].low;
                item.high = high;
                item.low = low;

                // Update the price data
                calculateProfits();
            });
            res.on("error", function(){
                console.log("Error fetching data for item " + item.name + " id: " + item.id)
            });
        })
    });
}

function calculateProfits(){
    // Reset high and low prices for the 6 armor sets
    for(let i = 0; i < 6; i++){
        highPrices[i] = [];
        lowPrices[i] = [];
    }

    // Do the same but for the crushable items.
    let crushableHighPrices = [];
    let crushableLowPrices = [];

    // Loop through item prices and tally up the total low and high prices for each set of armor
    items.forEach(function(item){
        for(let i = 0; i < sets.length; i++){
            if (sets[i].includes(item.id)){
                highPrices[i].push(item.high);
                lowPrices[i].push(item.low);
            }
        }

        if (crushables.includes(item.id)){
            crushableHighPrices.push(item.high);
            crushableLowPrices.push(item.low);
        }

        switch(item.id){
            case fullSet[GUTHAN]:{
                guthanHigh = item.high;
                guthanLow = item.low;
            }
            break;

            case fullSet[DHAROK]:{
                dharokHigh = item.high;
                dharokLow = item.low;
            }
            break;

            case fullSet[TORAG]:{
                toragHigh = item.high;
                toragLow = item.low;
            }
            break;

            case fullSet[AHRIM]:{
                ahrimHigh = item.high;
                ahrimLow = item.low;
            }
            break;

            case fullSet[KARIL]:{
                karilHigh = item.high;
                karilLow = item.low;
            }
            break;

            case fullSet[VERAC]:{
                veracHigh = item.high;
                veracLow = item.low;
            }
            break;
        }
    });


    // Finally, construct JSON object to send to clients.
    


    sendData = {
        guthan: {
            highPrices: highPrices[GUTHAN],
            lowPrices: lowPrices[GUTHAN],
            setLow: guthanLow,
            setHigh: guthanHigh,
            piecesHigh: calculateTotal(highPrices[GUTHAN]),
            piecesLow: calculateTotal(lowPrices[GUTHAN])
        },

        dharok: {
            highPrices: highPrices[DHAROK],
            lowPrices: lowPrices[DHAROK],
            setLow: dharokLow,
            setHigh: dharokHigh,
            piecesHigh: calculateTotal(highPrices[DHAROK]),
            piecesLow: calculateTotal(lowPrices[DHAROK])
        },

        torag: {
            highPrices: highPrices[TORAG],
            lowPrices: lowPrices[TORAG],
            setLow: toragLow,
            setHigh: toragHigh,
            piecesHigh: calculateTotal(highPrices[TORAG]),
            piecesLow: calculateTotal(lowPrices[TORAG])
        },

        verac: {
            highPrices: highPrices[VERAC],
            lowPrices: lowPrices[VERAC],
            setLow: veracLow,
            setHigh: veracHigh,
            piecesHigh: calculateTotal(highPrices[VERAC]),
            piecesLow: calculateTotal(lowPrices[VERAC])
        },

        ahrim: {
            highPrices: highPrices[AHRIM],
            lowPrices: lowPrices[AHRIM],
            setLow: ahrimLow,
            setHigh: ahrimHigh,
            piecesHigh: calculateTotal(highPrices[AHRIM]),
            piecesLow: calculateTotal(lowPrices[AHRIM])
        },

        karil: {
            highPrices: highPrices[KARIL],
            lowPrices: lowPrices[KARIL],
            setLow: karilLow,
            setHigh: karilHigh,
            piecesHigh: calculateTotal(highPrices[KARIL]),
            piecesLow: calculateTotal(lowPrices[KARIL])
        },

        crushables: {
            highPrices: crushableHighPrices,
            lowPrices: crushableLowPrices
        }

    }
    
}

// Helper function for calculating sum of an arrat
function calculateTotal(items){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return items.reduce(reducer);
}

// Set an interval to fetch new prices every 5 minutes
fetchPrices();
setInterval(fetchPrices, 1000 * 60 * 5);