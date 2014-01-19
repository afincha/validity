Validity
========

Effortless JavaScript form validation and error handling

### Usage

Include the script in your HTML

```html
<script type="text/javascript" src="validity.min.js"></script>
```

#### Client-Side Validation

Simply add a `data-validation` attribute to each input field you would like validated. Set each attribute to a JSON-string dictionary, with each key being the validation type you would like performed on the input and the value being the error message you would like to appear on that input if its corresponding validation fails:

```html
<form>
  <input type='email' name='email' data-validation='{"required": "Please enter your email", "isEmail": "Please enter a valid email address"}' />
  <input type='password' name='password' data-validation='{"required": "Please enter a password"}' />
  <input type='submit' value='Submit' />
</form>
```
