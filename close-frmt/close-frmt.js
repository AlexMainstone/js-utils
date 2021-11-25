function renderGreen(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    
    if(value === "Y") {
        td.style.background = "#00FF00";
    } else if(value === "N") {
        td.style.background = "#FF0000";
    } else {
        td.style.background = "#999999";
    }
}

function renderGlobal(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.background = "#999999";
    td.style.color = "#FFFFFF";
    
    if(col === 1 && value !== "APR") {
        td.style.fontWeight = "bold";
    } else if(col === 3 && value != 0) {
        td.style.fontWeight = "bold";
    } else if(col === 4 && value != 10) {
        td.style.fontWeight = "bold";
    } else if(col === 0 && value.split(" ")[0] === "CSB") {
        td.style.background = "#BB9999";
        td.style.color = "#FF0000";
    }
}

function renderNoCopy(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.background = "#FFBBBB";
}


function createTable() {
    var obj = JSON.parse(document.getElementById("json").value);
    var data = [];
    
    // Change titles
    for (var i = 0; i < obj.FinanceProducts.length; i++) {
        var distance = obj.FinanceProducts[i].Description.split(" ")[1] == "Distance";

        switch(obj.FinanceProducts[i].Description.split(" ")[0]) {
            case "CS":
                obj.FinanceProducts[i].Description = "Close CS";
                break;
            case "HP":
                obj.FinanceProducts[i].Description = "Close HP";
                break;
            case "HPB":
                obj.FinanceProducts[i].Description = "Close HP + Balloon";
                break;
            case "PCP":
                obj.FinanceProducts[i].Description = "Close PCP";
                break;
        }
        if (distance) {
                obj.FinanceProducts[i].Description += " Distance Sale";
        }
    }
    
    // Alphebetically sort Finance products
    obj.FinanceProducts.sort(function(a, b) {
        var ua = a.Description.toUpperCase().replace("CSB", "ZZZ");
        var ub = b.Description.toUpperCase().replace("CSB", "ZZZ");
        return (ua < ub) ? -1 : (ua > ub) ? 1 : 0;
    });
    for (var i = 0; i < obj.FinanceProducts.length; i++) {
        var product = obj.FinanceProducts[i];
        var desc = product.Description;
        var rate_type = product.PricingModel;
        
        // Find the fees
        var admin_fee = product.Fees[0].AdminFee.Amount.Price;
        var otp_fee = product.Fees[0].OptionFee.Amount.Price;
        var spread = "N"; 
        for(var j = 0; j < product.Fees.length; j++) {
            var afee = product.Fees[j].AdminFee;
            var ofee = product.Fees[j].OptionFee;

            if(afee.Profile === "SPREAD" && ofee.Profile === "LAST") {
                admin_fee = afee.Amount.Price;
                otp_fee = ofee.Amount.Price;
                spread = "Y";
                break;
            }
        }

        // Sort rates ascending
        product.Rates.sort((a, b) => {return a.RateCriteria.MinAdvance - b.RateCriteria.MinAdvance;})

        for(var j = 0; j < product.Rates.length; j++) {
            var rate = product.Rates[j];
            data.push([desc, rate_type, spread, admin_fee, otp_fee, rate.RateCriteria.MinAdvance, rate.RateCriteria.MaxAdvance, rate.RateCriteria.MinTerm, rate.RateCriteria.MaxTerm, rate.RateCriteria.MinVehicleInceptionAge, rate.RateCriteria.MaxVehicleInceptionAge, rate.StartingRate, rate.StartingRate, "% Adv", rate.CommissionAsPercentageOfAdvance, rate.CommissionCappings.MaximumCommissionAmount.Price, rate.CommissionCappings.MaximumPercentageOfCharges, product.ProductLimits.MaxCommissionTerm]);
            desc = rate_type = admin_fee = otp_fee = spread = "";
        }
    }
    console.log(obj);

    const container = document.getElementById('sheet');
    container.innerHTML="";
    const hot = new Handsontable(container, {
        data: data,
        rowHeaders: true,
        licenseKey: "non-commercial-and-evaluation",
        colHeaders: ["Product Name", "Rate Type", "Spread", "Admin Fee", "OTP Fee", "Adv Min", "Adv Max", "Term Min", "Term Max", "Age Min", "Age Max", "Rate Min", "Rate Max", "Comm Type", "Comm", "Cap £", "Cap %", "Cap M"],
        cells(row, col) {
            const cellProperties = {};
            if(col <= 4) {
                cellProperties.renderer = renderGlobal;
            } else if(col >= 15) {
                cellProperties.renderer = renderNoCopy;
            }

            if(col === 2) {
                cellProperties.renderer = renderGreen;
            }
            return cellProperties;
        }
    });
}

function inputPress() {
    var string = document.getElementById("json").value;
    try {
        JSON.parse(string);
    } catch {
        return;
    }
    createTable();
}