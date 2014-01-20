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

/////////////////////////////////////////////////////////////////
//   Core functions for Validity                               //
/////////////////////////////////////////////////////////////////

/*
 * Performs a client-side validation of the form with id 'formId' using these steps:
 * 1. Reset any existing error states on the form using 'clearErrorFunction' on each one
 * 2. Iterate through each input in the form
 * 3. Checks which client-side validations it needs
 * 4. Runs each validation
 * 5. Set error states for ones that fail using 'setErrorFunction'
 *
 * Returns true if all validations in the form pass and false if any fail
 */
Validity.validate = function (formId, setErrorFunction, clearErrorFunction) {
  setErrorFunction = (typeof setErrorFunction === "undefined") ? Validity.setErrorState : setErrorFunction;
  clearErrorFunction = (typeof clearErrorFunction === "undefined") ? Validity.clearErrorState : clearErrorFunction;

  var isValid = true;
  var form = document.getElementById(formId);
  var inputs = form.getElementsByTagName('input');
  var elements = Array.prototype.slice.call(inputs);

  Validity.clearErrorStates(formId, clearErrorFunction);

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
};


/*
 * Sets error states on the form with id 'formId' using these steps:
 * 1. Reset any existing error states on the form using 'clearErrorFunction' on each one
 * 2. Iterate through each input in the form
 * 3. Checks which server-returned error codes the input should respond to
 * 4. Set error states (using using 'setErrorFunction') for ones that have codes matching any in the codes array
 */
Validity.displayServerErrors = function (formId, codes, setErrorFunction, clearErrorFunction) {
  setErrorFunction = (typeof setErrorFunction === "undefined") ? Validity.setErrorState : setErrorFunction;
  clearErrorFunction = (typeof clearErrorFunction === "undefined") ? Validity.clearErrorState : clearErrorFunction;

  var form = document.getElementById(formId);
  var inputs = form.getElementsByTagName('input');
  var elements = Array.prototype.slice.call(inputs);

  Validity.clearErrorStates(formId, clearErrorFunction);

  elements.forEach(function (element) {
    var errors = element.getAttribute('data-error');
    errors = JSON.parse(errors);

    if (errors) {
      for (var key in errors) {
        if (codes.indexOf(key) > -1) { setErrorFunction(element, errors[key]); }
      }
    }
  });
};


/*
 * Returns true if the input 'element' is valid when the validation of type 'type' is applied to it
 * Returns false if the validation fails, or if the validation type is not recognized
 */
Validity.processValidation = function (type, element) {
  var isValid = true;

  switch (type) {
    case 'required':
      isValid = (element.value.length > 0);
      break;
    case 'email':
      isValid = validator.isEmail(element.value);
      break;
    case 'URL':
      isValid = validator.isURL(element.value);
      break;
    case 'IP':
      isValid = validator.isIP(element.value);
      break;
    case 'alpha':
      isValid = validator.isAlpha(element.value);
      break;
    case 'numeric':
      isValid = validator.isNumeric(element.value);
      break;
    case 'alphanumeric':
      isValid = validator.isAlphanumeric(element.value);
      break;
    case 'hexadecimal':
      isValid = validator.isHexadecimal(element.value);
      break;
    case 'hexColor':
      isValid = validator.isHexColor(element.value);
      break;
    case 'lowercase':
      isValid = validator.isLowercase(element.value);
      break;
    case 'uppercase':
      isValid = validator.isUppercase(element.value);
      break;
    case 'int':
      isValid = validator.isInt(element.value);
      break;
    case 'float':
      isValid = validator.isFloat(element.value);
      break;
    case 'date':
      isValid = validator.isDate(element.value);
      break;
    case 'creditCard':
      isValid = validator.isCreditCard(element.value);
      break;
    default:
      isValid = false;
      console.error('Error: Unrecognized validation type: ' + type + ' on element: ' + element);
      break;
  }

  return isValid;
};


/*
 * Clears all error states off the form with id 'formId' by applying the function 'clearErrorFunction'
 * to each input
 */
Validity.clearErrorStates = function (formId, clearErrorFunction) {
  clearErrorFunction = (typeof clearErrorFunction === "undefined") ? Validity.clearErrorState : clearErrorFunction;

  var form = document.getElementById(formId);
  var inputs = form.getElementsByTagName('input');
  var elements = Array.prototype.slice.call(inputs);

  elements.forEach(function (element) {
    clearErrorFunction(element);
  });
};


/////////////////////////////////////////////////////////////////
//   Default functions for setting and clearing error states   //
/////////////////////////////////////////////////////////////////


/*
 * Visually indicates there is an error on the input 'element' by performing the following steps:
 * 1. Add the class "has-error" to the parent of the element, which is assumed to be container for
 *    the input in this case
 * 2. Change the text for the input's label to the error message, or creates and appeands the label 
 *    if it does not exist
 */
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


/*
 * Reverses the visual changes that are applied to an input 'element' by the default error handler 
 * 'setErrorState'
 */
Validity.clearErrorState = function (element) {
  var parent = element.parentNode;
  parent.classList.remove('has-error');

  if (parent.firstChild.tagName == "LABEL") {
    parent.removeChild(parent.firstChild);
  }
};