
function Validator (options) {
    var formElement = document.querySelector(options.form)
    var selectorRules = {}

    function getParent (element, selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    // Function validate 
    function validate (inputElement, rule) {
        var errorMessage
        var inputParent = getParent(inputElement, options.formGroupSelector)
        var formMessage = inputParent.querySelector(options.errorSelector)

        var rules = selectorRules[rule.selector];
        for(var i=0; i<rules.length; i++){
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ":checked")
                    )
                    break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) break
        }

        if(errorMessage) {
            formMessage.innerText = errorMessage
            inputParent.classList.add('invalid')
        }else {
            formMessage.innerText = ''
            inputParent.classList.remove('invalid')
        }

        return !errorMessage;
    }

    if (formElement) {
        // When submit form 
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true

            // Iterate rule in list rule
            options.rules.forEach(function (rule) {
                var inputElement = document.querySelector(rule.selector)
                var isValid = validate (inputElement, rule)
                if (!isValid){
                    isFormValid = false
                }
            })

            if(isFormValid) {
                // Submit with JS
                if(typeof options.onSubmit === 'function') {

                    var formEnableInput = formElement.querySelectorAll('[name]:not([disable])')
                    var formValues = Array.from(formEnableInput).reduce(function (values, input) {
                        switch (input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name +  '"]:checked').value
                                break
                            case 'checkbox':
                                if (input.matches(':checked')) {
                                    if (!Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                } else if (!values[input.name]) {
                                    values[input.name] = '';
                                }
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }
                        return values
                    }, {})

                    options.onSubmit(formValues)
                }
                // Submit with default html 
                else {
                    formElement.submit()
                }
            }
        }
    
    
        options.rules.forEach(function (rule) {
            var inputElements = formElement.querySelectorAll(rule.selector)

             // Save all rule in list 
             if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else {
                selectorRules[rule.selector] = [rule.test];
            }

            Array.from(inputElements).forEach(inputElement => {
                // Handle when blur out input
                inputElement.onblur = function () {
                    validate (inputElement, rule)
                }

                // Handle when user type in input
                inputElement.oninput = function () {
                    var inputParent = getParent(inputElement, options.formGroupSelector)
                    var formMessage = inputParent.querySelector(options.errorSelector)
                    formMessage.innerText = ''
                    inputParent.classList.remove('invalid')
                }
            })

        })
    }
}

// Define rules

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            if (value != String) {
                return value ? undefined : message || "Vui lòng nhập trường này!"
            } else {
                return value.trim() ? undefined : message || "Vui lòng nhập trường này!"
            }
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regexp.test(value) ? undefined :message || "Trường này phải là email"
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập nhiều hơn ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || "Giá trị nhập chưa khớp"
        }
    }
}