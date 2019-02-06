let submitForm = (json) => {
	$.ajax({
		url: 'https://actum-form-ulcrunoxba.now.sh/api/submit',
		dataType: 'text',
		type: 'post',
		contentType: 'application/x-www-form-urlencoded',
		data: json,
		success: (data, textStatus, jQxhr) => {
			parsedResponse = JSON.parse(data);			
			$('#server-response').html(parsedResponse.message);
			console.log(data);
		},
		error: (jqXhr, textStatus, errorThrown) => {
			console.log(errorThrown);
			$('#server-response').html(errorThrown);
		}
	});
};

const validateEmail = (email) => {
	let re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

const throwErorrOnUnfocus = () => {
	$( '.form-group' ).focusout((event) => {
		if ( $(event.currentTarget).find(':input').val() === '' ) {
			$(event.currentTarget).find(':input').next().html('Error: field required')
		} else if ($(event.currentTarget).find(':input').attr('name') === 'email') {
			let emailIsValid = validateEmail($(event.currentTarget).find(':input').val());
			if (emailIsValid !== true) {
				$(event.currentTarget).find(':input').next().html('Error: invalid email')
			} 
		} else if ($(event.currentTarget).find(':input').attr('name') === 'gender') {
			return null;
		} else {
			$(event.currentTarget).find(':input').next().html('')
		}
	});
}; 

const clearText = (targetName) => {
	$(targetName).html('');
};

const throwFormError = (name, errorMessage) => {
	console.log(errorMessage);
	$(`input[name=${name}]`).next().html('Error: ' + errorMessage);
};

const getFormDataIfValid = (form) => {
	let obj = {};
	let formValidity = true;
	let elements = form.querySelectorAll('input, select, textarea');
	for(let i = 0; i < elements.length; ++i) {
		let element = elements[i];
		let name = element.name;
		let value = element.value;
		let type = element.type;

		const checkForm = () => {
			if (name === 'name' || name === 'surname' || name === 'email') {
				if (value === '') {
					formValidity = false;
					throwFormError(name, 'required field empty');
				} else if (name === 'email') {
					if (validateEmail(value) !== true) {
						formValidity = false;
						throwFormError(name, 'invalid email');						
					}
				} else if (name === 'name') {
					if (value === 'John') {
						formValidity = false;	
						$('#server-response').html('Failure');
						clearText('.error-field');
					} 
				}
			}
		};

		checkForm();
		// collects boolean from gender-select-male
		if (type === 'radio') {
			obj[name] = element.checked;
		} else if (name) {
			obj[name] = value;
		}
	};

	if (formValidity === true) {
		console.log(obj);
		return obj; 
	} else {
		return false;
	}
};

document.addEventListener('DOMContentLoaded', () => {
	throwErorrOnUnfocus();
	let form = document.getElementById('mock-form');
	// for some reason, `(e) => { ` in line below throws error
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		clearText('.error-field');
		clearText('#server-response');
		let json = getFormDataIfValid(this);
		if (json) {
			submitForm(json);
		}
	}, false);
});

