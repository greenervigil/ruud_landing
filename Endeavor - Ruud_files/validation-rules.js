$.validator.addMethod("SelectRequired", function(value) {
		return value != "";
	});
	
$.validator.addMethod("USZipCode", function(value, element) {
		return this.optional(element) || /^(\d{5}-\d{4})|(\d{5})$/.test(value);
	}, 'US Zip Code is not properly formated');
	
$.validator.addMethod("CAZipCode", function(value, element) {
		return this.optional(element) || /^([A-Z]\d[A-Z]\s\d[A-Z]\d)$/.test(value);
	}, 'Canadian Zip Code is not properly formated');
	
$.validator.addMethod("PhoneNumber", function(value, element) {
		var valid = false;
		
		valid = ValidateAreaCode(value);
		
		if(valid){valid = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/.test(value)}
		return this.optional(element) || valid;
	}, 'Phone number is not properly formatted');
	
function ValidateAreaCode(number) {
	var IsAreaCodeInvalid = false;
	
	number = number.replace("(","");
	number = number.replace(")","");
	number = number.replace(".","");
	number = number.replace("-","");
	number = number.replace("●","");
	number = number.replace(" ","");
	
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b0\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b1\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b222\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b333\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b444\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b555\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b666\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b777\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b888\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b999\d*/.test(number)}
	if(!IsAreaCodeInvalid){IsAreaCodeInvalid = /\b\d\d\d555\d*/.test(number)}
	
	return !IsAreaCodeInvalid;
}

$.validator.addMethod("EmailAddress", function(value, element) {
		return this.optional(element) || /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
	}, 'Email address is not properly formatted');
	