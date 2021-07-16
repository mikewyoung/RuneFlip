function colorMargins(){
    let margins = document.getElementsByClassName("margin");
    for(let i = 0; i < margins.length; i++){
        let profitMargin = parseInt(margins[i].innerHTML);
        if (profitMargin > 0)
            margins[i].classList.add("profit");
        else
            margins[i].classList.add("loss");
    }

    // Now format the numbers to look nicer

    formatNumbers();
    console.log("Done!");
}

// Adds comma separators to numbers to make them more readable.
function formatNumbers(){
    let prices = document.getElementsByClassName("price");
    for (let i = 0; i < prices.length; i++){
        let price = parseInt(prices[i].innerHTML);
        prices[i].innerHTML = price.toLocaleString();
    }
}