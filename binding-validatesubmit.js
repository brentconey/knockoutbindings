//Binding by Brent Coney, 2015
ko.bindingHandlers.validateSubmit = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != 'function') {
            throw new Error('The value for a validate submit binding must be a function');
        }
        var validationMessageTemplate = '<span class="field-validation-error">{0}</span>';
        var $form = $(element);
        //disable default behavior
        $form.attr('novalidate', '');
        $form.on('submit', function (e) {
            e.preventDefault();
            var validationErrorCount = 0;
            var deferredValidationCalls = [];
            var $allInputs = $form.find('input, textarea, select').not(':input[type=submit], :input[type=button], :input[type=reset]');
            $allInputs.removeClass('form-error');
            for (var i = 0; i <= ($allInputs.length - 1) ; i++) {
                var $input = $($allInputs[i]);
                $input.next(".field-validation-error").remove();
                var validationText = $input.data("validation-message") || "Invalid input";
                if (typeof $input.attr('required') !== typeof undefined) {
                    //input has the required field.
                    if (!$input.val() || $input.val() === '') {
                        validationErrorCount++;
                        $input.addClass('form-error');
                        if ($input.next(".field-validation-error").length === 0) {
                            $input.after(validationMessageTemplate.replace("{0}", validationText));
                        }
                    }
                }
                if (typeof $input.attr('min') !== typeof undefined) {
                    //input has min field
                    if ($input.val() < $input.attr('min')) {
                        validationErrorCount++;
                        if (!$input.hasClass('form-error')) {
                            $input.addClass('form-error');
                            if ($input.next(".field-validation-error").length === 0) {
                                $input.after(validationMessageTemplate.replace("{0}", validationText));
                            }
                        }
                    }
                }
                if (typeof $input.attr('max') !== typeof undefined) {
                    //input has max field
                    if ($input.val() > $input.attr('max')) {
                        validationErrorCount++;
                        if (!$input.hasClass('form-error')) {
                            $input.addClass('form-error');
                            if ($input.next(".field-validation-error").length === 0) {
                                $input.after(validationMessageTemplate.replace("{0}", validationText));
                            }
                        }
                    }
                }
                var lengthMax = $input.data("val-length-max");
                if (lengthMax) {
                    if ($input.val().length > parseInt(lengthMax)) {
                        validationErrorCount++;
                        if (!$input.hasClass('form-error')) {
                            $input.addClass('form-error');
                            if ($input.next(".field-validation-error").length === 0) {
                                $input.after(validationMessageTemplate.replace("{0}", validationText));
                            }
                        }
                    }
                }
                var lengthMin = $input.data("val-length-min");
                if (lengthMin) {
                    if ($input.val().length < parseInt(lengthMin)) {
                        validationErrorCount++;
                        if (!$input.hasClass('form-error')) {
                            $input.addClass('form-error');
                            if ($input.next(".field-validation-error").length === 0) {
                                $input.after(validationMessageTemplate.replace("{0}", validationText));
                            }
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
