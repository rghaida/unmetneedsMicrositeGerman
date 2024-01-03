document.getElementById('formBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevents the default form submission action

    // Validation
    let isValid = true;
    const emailAddress = document.getElementById('emailAddress');
    const confirmEmail = document.getElementById('confirmEmail');
    const agreeCheckbox = document.getElementById('agree');
    const specialty = document.getElementById('specialty');
    const npiNumber = document.getElementById('npiNumber');
    const signUpContainer = document.querySelector('.signUpContainer');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
     const institutionName = document.getElementById('institutionName');
     const institutionAddress = document.getElementById('institutionAddress');


    // Reset styles
    resetStyles([emailAddress, confirmEmail, agreeCheckbox, specialty, firstName, lastName, institutionName]);

    if (!firstName.value) {
        setErrorStyles([firstName]);
        isValid = false;
    }
    
    if (!lastName.value) {
        setErrorStyles([lastName]);
        isValid = false;
    }

    if (!institutionName.value) {
    setErrorStyles([institutionName]);
    isValid = false;
}


    // Check if email fields are filled and match
    if (!emailAddress.value || emailAddress.value !== confirmEmail.value) {
        setErrorStyles([emailAddress, confirmEmail]);
        isValid = false;
    }

    // Check if specialty and NPI number fields are filled
    if (!specialty.value ) {
        setErrorStyles([specialty]);
        isValid = false;
    }

    // Check if checkbox is checked
    if (!agreeCheckbox.checked) {
        setErrorStyles([agreeCheckbox]);
        isValid = false;
    }

    if (!institutionAddress.value) {
        institutionAddress.value = "NA";
    }

   



    if (isValid) {

        document.getElementById('formBtn').disabled = true;
        document.getElementById('btnImg').src = "./assets/loading_v2.gif";
        document.getElementById('btnImg').style.width = "30px";
        document.getElementById('btnImg').style.marginLeft = "-10px";



        let formData = {
            firstname: firstName.value,
            lastname: lastName.value,
            institution_name: institutionName.value,
            email: emailAddress.value,
            specialty: specialty.value,
            // Additional required fields with default values
            address_country: "Germany",
            address_street_line_1: institutionAddress.value,
            address_zip_postal_code: "00000",
            // Add any other required fields here with "NA" as the default value
        };

         // Convert object to JSON, if needed
         let jsonData = JSON.stringify(formData);

           sendAjaxRequest(jsonData)
        .then(response => {
            document.getElementById('btnImg').src = "./assets/signUpArrow_larger.svg";
            document.getElementById('formBtn').disabled = false;
            document.getElementById('btnImg').style.marginLeft = "0px";

            if (response.error) {
                // Handle the error sent from PHP script
                document.getElementById('errorMsg').textContent = 'Error from server: ' + response.error;
            }
            // Handle success
            console.log('Success:', response);
         


            // Check if the submission was successful based on the response
            if (response && response.outputParameters && response.outputParameters.SalesforceJsonResponse && response.outputParameters.SalesforceJsonResponse.success) {
                // Submission was successful, execute the commented-out code
                document.querySelector('.signUpContent').style.display = 'none';
                document.querySelector('.signUpForm').style.display = 'none';
                document.querySelector('.thankyou').style.display = 'block';

                // Update styles for signUpContainer
                signUpContainer.style.paddingLeft = '0px';
                signUpContainer.style.paddingTop = '40px';
            } else {
                // Submission was not successful, handle accordingly (e.g., show an error message)
                console.error('Submission failed:', response);
                // Add code to handle submission failure here
            }
        })
        .catch(error => {
            // Handle AJAX request error
            document.getElementById('btnImg').src = "./assets/signUpArrow_larger.svg";
            document.getElementById('formBtn').disabled = false;
            document.getElementById('btnImg').style.marginLeft = "0px";
            document.getElementById('errorMsg').textContent = 'Error submitting form: ' + error.message;

            console.error('Error:', error);
            // Add code to handle AJAX request error here
        });
}
});

function sendAjaxRequest(data) {
    return fetch('FormHandler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    }).then(response => response.json());
  }

function setErrorStyles(elements) {
    elements.forEach(element => {
        if (element.type === 'checkbox') {
            // Change the label color for the checkbox
            element.nextElementSibling.style.color = '#ff005a';
        } else {
            // Change the border color for input fields
            element.style.borderColor = '#ff005a';

            // Special handling for NPI number input
            if (element.id === 'npiNumber') {
                // Access the label for NPI number
                const npiLabel = document.getElementById('npiLabel');
                if (npiLabel) {
                    npiLabel.style.color = '#ff005a';
                }
            } else if (element.previousElementSibling && element.previousElementSibling.tagName === 'LABEL') {
                // Change label color for other input fields
                element.previousElementSibling.style.color = '#ff005a';
            }
        }
    });
}


function resetStyles(elements) {
    elements.forEach(element => {
        if (element.type === 'checkbox') {
            // Reset the label color for the checkbox
            element.nextElementSibling.style.color = '';
        } else {
            // Reset the border color for input fields
            element.style.borderColor = '';

            // Special handling for NPI number input
            if (element.id === 'npiNumber') {
                // Access the label for NPI number
                const npiLabel = document.getElementById('npiLabel');
                if (npiLabel) {
                    npiLabel.style.color = '';
                }
            } else if (element.previousElementSibling && element.previousElementSibling.tagName === 'LABEL') {
                // Reset label color for other input fields
                element.previousElementSibling.style.color = '';
            }
        }
    });
}







// document.querySelector('.npi-info-icon').addEventListener('mouseleave', function() {
//     document.querySelector('.npi-hover-modal').style.display = 'none';
// });
// Event listener for email fields
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

[emailAddress, confirmEmail].forEach(field => {
    field.addEventListener('input', function() {
        const isEmailValid = emailAddress.value.match(emailRegex) && confirmEmail.value.match(emailRegex);
        const isEmailMatch = emailAddress.value === confirmEmail.value;

        if (isEmailValid && isEmailMatch) {
            resetStyles([emailAddress, confirmEmail]);
        } else {
            setErrorStyles([emailAddress, confirmEmail]);
        }
    });
});

institutionName.addEventListener('input', function() {
    if (institutionName.value) {
        resetStyles([institutionName]);
    } else {
        setErrorStyles([institutionName]);
    }
});

// Event listener for specialty and NPI number fields
[specialty].forEach(field => {
    field.addEventListener('input', function() {
        if (field.value) {
            resetStyles([field]);
        } else {
            setErrorStyles([field]);
        }
    });
});
const agreeCheckbox = document.getElementById('agree');
// Event listener for checkbox
agreeCheckbox.addEventListener('change', function() {

    const checkboxLabel = document.querySelector('label[for="agree"]'); // Select the label associated with the checkbox

    if (agreeCheckbox.checked) {
        checkboxLabel.style.color = ''; // Reset the label color when checkbox is checked
    } else {
        checkboxLabel.style.color = '#ff005a'; // Set error color when checkbox is unchecked
    }
});

[firstName, lastName].forEach(field => {
    field.addEventListener('input', function() {
        if (field.value) {
            resetStyles([field]);
        } else {
            setErrorStyles([field]);
        }
    });
});
