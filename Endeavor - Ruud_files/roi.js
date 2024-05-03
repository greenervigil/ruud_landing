/*
*	Rheem ROI Calculator
*	
*	Takes input form elements and produces
*	results based on client data entry
*/

(function($){
"use strict";
/* VARIABLES */
	//Statics
		var rheemHybrid_50_gal = 1399;
		var replacement_elec = 559;
		var electricKilowattsPerHour = 4625;
		//var hybridKilowattsPerHour = 1791.7;
		var hybridKilowattsPerHour = 1258.33;
		var max_bar_height = 200;
		var max_bar_value = 1550;
	
	//Form variables
		var clientPrice = $('#txtHybridPrice');
		var clientAvgEnergyRate = $('#txtAvgEnergyRate');
		var clientReplaceUnitName = "rdoReplaceUnit";
		var clientReplaceUnitYes = $('#rdoReplaceUnitYes');
		var clientReplaceUnitNo = $('#rdoReplaceUnitNo');
		var clientLocalRebates = $('#incentive-total');
		var calculateButton = $('#btnCalculate');
		var startOverButton = $('#btnStartOver');
		
	// Result variables
		var investmentElectric = $('#investment_Electric');
		var investmentHybrid = $('#investment_Hybrid');
		var lifetimeReturnOnInvestment = $("#lifetimeReturnOnInvestment");
		var operatingCostsElectric = $('#operatingCosts_Electric');
		var operatingCostsHybrid = $('#operatingCosts_Hybrid');
		var annualEnergyOperatingCostsSavings = $('#annualEnergyOperatingCostsSavings');
		var paysForItselfIn = $('#paysForItselfIn');

	resetElectricRateByState();
/* INITIALIZATIONS */
	$('#txtHybridPrice').val(rheemHybrid_50_gal);


/* EVENTS */
	calculateButton.click(function(){ calculateForm(); });
	startOverButton.click(function(){ clearResults(); });
	clientPrice.keydown(function(eventObj){ preventNonFloatKeys(eventObj); });
	clientAvgEnergyRate.keydown(function(eventObj){ preventNonFloatKeys(eventObj); });
	clientLocalRebates.keydown(function(eventObj){ preventNonFloatKeys(eventObj); });
	$("#incentive-state").change(function(){
		resetElectricRateByState();
	});


/* FUNCTIONS */
	function calculateForm(){
		// Calculations
		
			var hybridPrice = parseFloat(clientPrice.val());
			var incentivesAndRebates = parseFloat(clientLocalRebates.val());
			var rheemPrice = hybridPrice - incentivesAndRebates;
			
			var investmentElectricBarHeight = ((replacement_elec / max_bar_value) * max_bar_height).toFixed(0);
			var investmentHybridBarHeight = (Math.max((rheemPrice / max_bar_value) * max_bar_height, 0)).toFixed(0);
			
			var annualCostElectric = (electricKilowattsPerHour * parseFloat(clientAvgEnergyRate.val())).toFixed(0);
			var annualCostElectricBarHeight = ((annualCostElectric / max_bar_value) * max_bar_height).toFixed(0);
			var annualCostHybrid = (hybridKilowattsPerHour * parseFloat(clientAvgEnergyRate.val())).toFixed(0);
			var annualCostHybridBarHeight = ((annualCostHybrid / max_bar_value) * max_bar_height).toFixed(0);
			
			var annualCostSavings = parseFloat(annualCostElectric) - parseFloat(annualCostHybrid);
			
			var paybackYears = 0;
			
		// Change calculation for paybackYears based on if customer is replacing unit
		//	switch($('input[name=' + clientReplaceUnitName + ']:checked').val()){
		//		case "0":
		//			paybackYears = (rheemPrice / annualCostSavings).toFixed(2);
		//		break;
		//		case "1":
					//rheemPrice = rheemPrice - parseFloat(annualCostElectric);
					paybackYears = (((rheemPrice - parseFloat(replacement_elec)) / annualCostSavings) * 12).toFixed(2);
					//paybackYears = ((rheemPrice - parseFloat(replacement_elec)) / annualCostSavings).toFixed(2);

		//		break;
		//	}
			
			var lifetimeROI = (10 * annualCostElectric + replacement_elec) - (10 * annualCostHybrid + rheemPrice);
			
		// Update Investment Area
			
			investmentElectric.css("height","1px").animate({height: investmentElectricBarHeight + "px"},1000).find('.resultNumber').html(currencyFormat(replacement_elec, 0));
			investmentHybrid.css("height","1px").animate({height: investmentHybridBarHeight + "px"},1000).find('.resultNumber').html(currencyFormat(Math.max(rheemPrice, 0), 0));
			
		// Update Annual Operating Costs Area
			
			operatingCostsElectric.css("height","1px").animate({height: annualCostElectricBarHeight + "px"},1000).find('.resultNumber').html(currencyFormat(parseFloat(annualCostElectric), 0));
			operatingCostsHybrid.css("height","1px").animate({height: annualCostHybridBarHeight + "px"},1000).find('.resultNumber').html(currencyFormat(parseFloat(annualCostHybrid), 0));
			
		// Update savings and years
			annualEnergyOperatingCostsSavings.html(currencyFormat(annualCostSavings, 2));
			paysForItselfIn.html(paybackYears + " mo");
			lifetimeReturnOnInvestment.html("$" + lifetimeROI)
	}
	
	function preventNonFloatKeys(eventObj){
		var keycode = eventObj.charCode || eventObj.keyCode;
		if (!eventObj.shiftKey && (keycode >= 48 && keycode <= 57) || // NoShift and Numrow Numbers
			(keycode >= 96 && keycode <= 105) || // Numpad Numbers
			 keycode === 190 || keycode === 110 || // Period and Decimal Point
			 keycode === 8 || keycode === 46){ // Backspace and Delete
    	return true;
		} else{
			eventObj.preventDefault();
    	return false;
		}
	}
	
	function currencyFormat(num,decimalPlaces){
  		return "$" + num.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
	
	function clearResults(){
		clientPrice.val(rheemHybrid_50_gal);
		resetElectricRateByState();
		clientReplaceUnitYes.prop('checked', false);
		clientReplaceUnitNo.prop('checked', true);
		clientLocalRebates.val("0.00");
		
		investmentElectric.css("height","1px").find('.resultNumber').html("");
		investmentHybrid.css("height","1px").find('.resultNumber').html("");
		operatingCostsElectric.css("height","1px").find('.resultNumber').html("");
		operatingCostsHybrid.css("height","1px").find('.resultNumber').html("");
		annualEnergyOperatingCostsSavings.html("");
		paysForItselfIn.html("");
	}
	
	function resetElectricRateByState(){
		var rates = {"rates":[{ "state": { "abbrev": "AL", "rate": "0.1190"}},{ "state": { "abbrev": "AK", "rate": "0.2038"}},{ "state": { "abbrev": "AZ", "rate": "0.1199"}},{ "state": { "abbrev": "AR", "rate": "0.0970"}},{ "state": { "abbrev": "CA", "rate": "0.1689"}},{ "state": { "abbrev": "CO", "rate": "0.1160"}},{ "state": { "abbrev": "CT", "rate": "0.2085"}},{ "state": { "abbrev": "DE", "rate": "0.1360"}},{ "state": { "abbrev": "DC", "rate": "0.1318"}},{ "state": { "abbrev": "FL", "rate": "0.1120"}},{ "state": { "abbrev": "GA", "rate": "0.1117"}},{ "state": { "abbrev": "HI", "rate": "0.2706"}},{ "state": { "abbrev": "ID", "rate": "0.0986"}},{ "state": { "abbrev": "IL", "rate": "0.1238"}},{ "state": { "abbrev": "IN", "rate": "0.1120"}},{ "state": { "abbrev": "IA", "rate": "0.1186"}},{ "state": { "abbrev": "KS", "rate": "0.1303"}},{ "state": { "abbrev": "KY", "rate": "0.1013"}},{ "state": { "abbrev": "LA", "rate": "0.0893"}},{ "state": { "abbrev": "ME", "rate": "0.1677"}},{ "state": { "abbrev": "MD", "rate": "0.1434"}},{ "state": { "abbrev": "MA", "rate": "0.1677"}},{ "state": { "abbrev": "MI", "rate": "0.1498"}},{ "state": { "abbrev": "MN", "rate": "0.1247"}},{ "state": { "abbrev": "MS", "rate": "0.1071"}},{ "state": { "abbrev": "MO", "rate": "0.1055"}},{ "state": { "abbrev": "MT", "rate": "0.1095"}},{ "state": { "abbrev": "NE", "rate": "0.1053"}},{ "state": { "abbrev": "NV", "rate": "0.1188"}},{ "state": { "abbrev": "NH", "rate": "0.1836"}},{ "state": { "abbrev": "NJ", "rate": "0.1558"}},{ "state": { "abbrev": "NM", "rate": "0.1151"}},{ "state": { "abbrev": "NY", "rate": "0.1720"}},{ "state": { "abbrev": "NC", "rate": "0.1119"}},{ "state": { "abbrev": "ND", "rate": "0.1013"}},{ "state": { "abbrev": "OH", "rate": "0.1247"}},{ "state": { "abbrev": "OK", "rate": "0.0998"}},{ "state": { "abbrev": "OR", "rate": "0.1051"}},{ "state": { "abbrev": "PA", "rate": "0.1411"}},{ "state": { "abbrev": "RI", "rate": "0.1873"}},{ "state": { "abbrev": "SC", "rate": "0.1241"}},{ "state": { "abbrev": "SD", "rate": "0.1115"}},{ "state": { "abbrev": "TN", "rate": "0.1006"}},{ "state": { "abbrev": "TX", "rate": "0.1113"}},{ "state": { "abbrev": "UT", "rate": "0.1084"}},{ "state": { "abbrev": "VT", "rate": "0.1725"}},{ "state": { "abbrev": "VA", "rate": "0.1150"}},{ "state": { "abbrev": "WA", "rate": "0.0933"}},{ "state": { "abbrev": "WV", "rate": "0.1104"}},{ "state": { "abbrev": "WI", "rate": "0.1441"}},{ "state": { "abbrev": "WY", "rate": "0.1104"}}]}
		$.each( rates, function (key,value) {
			$.each( value, function (key1,value1) {
				if (value1.state.abbrev == $("#incentive-state").val())
				{
					$("#txtAvgEnergyRate").val(value1.state.rate);
				}
			});
		});
		
	}
	
	function getUrlVars()
	{
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

})(jQuery);