ko.bindingHandlers.inlineEdit = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        $(element).text(ko.unwrap(value));
        $(element).on("input", function(e){
            value($(this).text());
        });
    }
};
