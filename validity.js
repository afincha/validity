/*!
 * Copyright (c) 2014 Andrew Finch

 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Validity = { version: '0.1.0' };

Validity.validate = function (formId) {
  return Validity.validateWithCustomFunctions(formId, Validity.setErrorState, Validity.clearErrorState);
}

Validity.validateWithCustomFunctions = function (formId, setErrorFunction, clearErrorFunction) {
  var isValid = true;
  var form = document.getElementById(formId);
  var inputs = form.getElementsByTagName('input');
  var elements = Array.prototype.slice.call(inputs);

  Validity.clearErrorStatesWithClearFunction(formId, clearErrorFunction);

  elements.forEach(function (element) {
    var validations = element.getAttribute('data-validate');
    validations = JSON.parse(validations);

    if (validations) {
      for (var key in validations) {
        var valid = Validity.processValidation(key, element);
        if (!valid) { setErrorFunction(element, validations[key]); }
        isValid = isValid && valid;
      }
    }
  });

  return isValid;
}

Validity.displayServerErrors = function (formId, codes) {
  Validity.displayServerErrorsWithCustomFunctions(formId, codes, Validity.setErrorState, Validity.clearErrorState);
}

Validity.displayServerErrorsWithCustomFunctions = function (formId, codes, setErrorFunction, clearErrorFunction) {

  Validity.clearErrorStatesWithClearFunction(formId, clearErrorFunction);

  var form = document.getElementById(formId);
  var inputs = form.getElementsByTagName('input');
  var elements = Array.prototype.slice.call(inputs);

  elements.forEach(function (element) {
    var errors = element.getAttribute('data-error');
    errors = JSON.parse(errors);

    if (errors) {
      for (var key in errors) {
        if (codes.indexOf(key) > -1) { setErrorFunction(element, errors[key]); }
      }
    }
  });
}


Validity.processValidation = function (type, element) {
  console.log("Processing validation");

  var isValid = true;

  switch (type) {
    case 'required':
      isValid = (element.value.length > 0);
      break;
    case 'isEmail':
      isValid = validator.isEmail(element.value);
      break;
    case 'isURL':
      isValid = validator.isURL(element.value);
      break;
    case 'isIP':
      isValid = validator.isIP(element.value);
      break;
    case 'isAlpha':
      isValid = validator.isAlpha(element.value);
      break;
    case 'isNumeric':
      isValid = validator.isNumeric(element.value);
      break;
    default:
      isValid = false;
      console.error('Error: Unrecognized validation type: ' + type + ' on element: ' + element);
      break;
  }

  return isValid;
}


Validity.setErrorState = function (element, message) {
  console.error("Error on element: " + element + " with message: " + message);

  var parent = element.parentNode;
  parent.classList.add('has-error');

  if (parent.firstChild.tagName == "LABEL") {
    parent.firstChild.innerHTML = message;
  } else {
    var label = document.createElement('label');
    label.setAttribute('for', element.id);
    label.innerHTML = message;
    label.classList.add('control-label');

    parent.insertBefore(label, parent.firstChild);
  }
};

Validity.clearErrorStates = function (formId) {
  Validity.clearErrorStatesWithClearFunction(formId, Validity.clearErrorState);
}

Validity.clearErrorStatesWithClearFunction = function (formId, clearFunction) {
  var form = document.getElementById(formId);
  var inputs = form.getElementsByTagName('input');
  var elements = Array.prototype.slice.call(inputs);

  elements.forEach(function (element) {
    clearFunction(element);
  });
}

Validity.clearErrorState = function (element) {
  var parent = element.parentNode;
  parent.classList.remove('has-error');

  if (parent.firstChild.tagName == "LABEL") {
    parent.removeChild(parent.firstChild);
  }
}
