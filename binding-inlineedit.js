ko.bindingHandlers.inlineEdit = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        $(element).text(ko.unwrap(value));
        $(element).on("input", function (e) {
            value($(this).text());
        });
		$(element).on("focus click", function (e) {
			var sel, range;
			if (window.getSelection && document.createRange) {
				range = document.createRange();
				range.selectNodeContents(element);
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(element);
				range.select();
			}
		});
    },
	update: function(element, valueAccessor){
		$(element).text(ko.unwrap(valueAccessor()));
	}
};