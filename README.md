Validity
========

Validity enables effortless JavaScript form validation and error handling. It is built on top of [chriso](https://github.com/chriso)'s [validator.js](https://github.com/chriso/validator.js). Big shout-out to chriso for writing this awesome library!

### Basic Usage

Include **validator** and **validity** in your HTML. The easiest way is with the combined, compiled version that we offer:

```html
<script type="text/javascript" src="validator_validity.min.js"></script>
```

#### Client-Side Validation

Simply add a `data-validate` attribute to each input field you would like validated. Set each attribute to a JSON-string dictionary, with each key being the validation type you would like performed on the input and the value being the error message you would like to appear on that input if its corresponding validation fails:

```html
<form id="loginForm">
  <div class="form-group">
    <label for="email">Email Address</label>
    <input data-validate="{'required': 'Please enter your email address', 'email': 'Please enter a valid email address'}" type="email" name="email" id="email" />
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input data-validate="{'required': 'Please enter a password'}" type="password" name="password" id="password" />
  </div>
  <input type="button" value="Log In" onclick="login()" />
</form>
```

Then use JavaScript to validate the form before submission. Validation is performed by calling Validity's `validate` function and passing in the id of the form you would like to validate. This function returns `true` if all validations pass and `false` if any of them fail:

```javascript
function login () {
  if (Validity.validate('loginForm')) {
    // Send form data to the server
  } else {
    console.error("Errors on the form");
  }
}
```

By default, each error on the form triggers a call to `setErrorState`, which adds the class "has-error" to the parent of the field and changes its label text to the error message. If, for example, the 'required' validation failed on the 'email' field in our loginForm above, the markup of the form would be changed to this:

```html
<form id="loginForm">
  <div class="form-group has-error">
    <label for="email">Please enter your email address</label>
    <input data-validate="{'required': 'Please enter your email address', 'email': 'Please enter a valid email address'}" type="email" name="email" id="email" />
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input data-validate="{'required': 'Please enter a password'}" type="password" name="password" id="password" />
  </div>
  <input type="button" value="Log In" onclick="login()" />
</form>
```

The `setErrorState` function, as well as how to use your own error-handling functions, is described in more detail below, under [Using Custom Error-handling Functions](https://github.com/afincha/validity#using-custom-error-handling-functions).

Validity currently supports the following client-side validation types:

- **required** - ensure the field is not empty
- **email** - ensure the field contains a valid email address
- **URL** - ensure the field contains a valid URL
- **IP** - ensure the field contains a valid IP address
- **alpha** - ensure the field contains only letters (a-zA-Z)
- **numeric** - ensure the field contains only numbers
- **alphanumeric** - ensure the field contains only letters and numbers
- **hexadecimal** - ensure the field contains a hexadecimal number
- **hexColor** - ensure the field contains a hexadecimal color
- **lowercase** - ensure the field does not contain any uppercase letters
- **uppercase** - ensure the field does not contain any lowercase letters
- **int** - ensure the field contains an integer
- **float** - ensure the field contains a float
- **date** - ensure the field contains a date
- **creditCard** - ensure the field contains a credit card number

#### Validity helps display errors returned by your server too

Add a `data-error` attribute to each input field you would like server-side errors to be shown on. Set each attribute to a JSON-string dictionary, with each key being the error returned by the server and the value being the error message you would like to appear on that input if the server returns that error:

```html
<form id="loginForm">
  <div class="form-group">
    <label for="email">Email Address</label>
    <input data-error="{'101': 'Invalid email or password'}" data-validate="{'required': 'Please enter your email address', 'email': 'Please enter a valid email address'}" type="email" name="email" id="email" />
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input data-validate="{'required': 'Please enter a password'}" type="password" name="password" id="password" />
  </div>
  <input type="button" value="Log In" onclick="login()" />
</form>
```

When you receive a response from your server, simply call Validity's `displayServerErrors` function, passing in the id of the form you would like to target, along with an array containing all error codes or names returned by the server. This feature will only work for forms submitted using AJAX, where the response can be processsed using JavaScript.

```javascript
function login () {
  if (Validity.validate('loginForm')) {
    $.post('/login', $('#loginForm').serialize()).then(function (response) {
      if (response.success) {
         // Login successful. Redirect to a new page
      } else {
        // Login failed
        Validity.displayServerErrors('loginForm', [response.error.code.toString()]);
      }
    });
  } else {
    console.error("Errors on the form");
  }
}
```

### Using Custom Error-handling Functions

The default error-handling function used by `validate` and `displayServerErrors` is called `setErrorState` and does two things:

1. Adds a "has-error" class to the parent of the input (assumed to be a "form-group" or similar container for the input and its associated elements)
2. Sets the text of the first label in the form-group to the error message

This is designed to work seamlessly with Twitter Bootstrap's [Form Validation States](http://getbootstrap.com/css/#forms-control-states). If you would like to use a custom error-handling function instead, it is very easy to do so. Let's say that instead of using the default error-handler, we would like to add the "has-error" class to the input element itself, and make the error message appear in the input's placeholder. Let's define a function that does this:

```javascript
function customSetError (element, message) {
  element.classList.add('has-error');
  element.setAttribute('placeholder', message);
}
```

Let's define a function that will clear this error state as well, if the user corrects the error:

```javascript
function customClearError (element) {
  element.classList.remove('has-error');
  element.setAttribute('placeholder', '');
}
```

Now we can use these by passing them into `validate` and `displayServerErrors`:

```javascript
function login () {
  if (Validity.validate('loginForm', customSetError, customClearError)) {
    $.post('/login', $('#loginForm').serialize()).then(function (response) {
      if (response.success) {
         // Login successful. Redirect to a new page
      } else {
        // Login failed
        Validity.displayServerErrors(
          'loginForm', 
          [response.error.code.toString()], 
          customSetError, 
          customClearError
        );
      }
    });
  } else {
    console.error("Errors on the form");
  }
}
```

### Limitations

* Right now, only form members of tag type `<input>` can be validated. 
I plan to add support for other tags, such as `<select>` soon.
* This library only works for forms that are submitted using JavaScript.
* The default error handlers use DOMelement.classList, which is not supported in versions of IE older than 10.

### Tests

Thank you [poleveD](https://github.com/poleveD) for setting up a basic QUnit testing suite! Please help me add more tests.

### Features I plan to add

* Support for server-side error messages that come from the server
* Option to define validation rules in a JS object instead of in the HTML
* Support for a 3rd type of attribute on an input that adds an auto-formatter (i.e. for a phone number)
* A live form feedback widget that moves with the current field and displays a progress bar

### License (MIT)

Copyright (c) 2014 Andrew Finch

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
