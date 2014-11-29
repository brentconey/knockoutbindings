//Binding by Brent Coney, 2014
ko.bindingHandlers.validateSubmit = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != 'function') {
            throw new Error('The value for a validate submit binding must be a function');
        }

        var $form = $(element);
        //disable default behavior
        $form.attr('novalidate', '');
        $form.on('submit', function (e) {
            e.preventDefault();
            var validationErrorCount = 0;
            var deferredValidationCalls = [];
            var $allInputs = $form.find('input, textarea, select').not(':input[type=submit], :input[type=button], :input[type=reset]');
            $allInputs.removeClass('error');
            for (var i = 0; i <= ($allInputs.length - 1) ; i++) {
                var $input = $($allInputs[i]);
                if (typeof $input.attr('required') !== typeof undefined) {
                    //input has the required field.
                    if (!$input.val() || $input.val() === '') {
                        validationErrorCount++;
                        $input.addClass('error');
                    }
                }

                if (typeof $input.attr('min') !== typeof undefined) {
                    //input has min field
                    if ($input.val().length < $input.attr('min')) {
                        validationErrorCount++;
                        if (!$input.hasClass('error')) {
                            $input.addClass('error');
                        }
                    }
                }

                if (typeof $input.attr('max') !== typeof undefined) {
                    //input has max field
                    if ($input.val().length > $input.attr('max')) {
                        validationErrorCount++;
                        if (!$input.hasClass('error')) {
                            $input.addClass('error');
                        }
                    }
                }
                var customValidator = $input.data('customvalidation');
                if (customValidator) {
                    var validate = bindingContext['$data'][customValidator]($input);
                    deferredValidationCalls.push(validate);
                    $.when(validate).done(function (response) {
                        if (!response.valid) {
                            validationErrorCount++;
                        }
                    });
                }

            }
            $.when.apply(null, deferredValidationCalls).done(function (response) {
                var viewModelFunction = valueAccessor();
                if (validationErrorCount === 0) {
                    viewModelFunction.call(bindingContext['$data'], element);
                }
            });

        });
    }
};