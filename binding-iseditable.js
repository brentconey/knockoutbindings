ko.bindingHandlers.isEditable = {
	init: function(element, valueAccessor){
		var isEditable = ko.unwrap(valueAccessor());
		if(isEditable){
			$(element).attr("contenteditable", "true");
		}else{
			$(element).attr("contenteditable", "false");
		}
	},
	update: function(element, valueAccessor){
		var isEditable = ko.unwrap(valueAccessor());
		if(isEditable){
			$(element).attr("contenteditable", "true");
		}else{
			$(element).attr("contenteditable", "false");
		}
	}
}