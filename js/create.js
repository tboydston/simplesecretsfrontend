
fileName = ""
fileContent = ""
encryptedSecret = ""

$( document ).ready(function() {

	if( USECAPTCHA == true ) {
		console.log("USE CAPTHCA")
		hcaptcha.render('h-captcha', { 'sitekey':CAPTCHASITEKEY, 'callback':'captchaValid', 'error':'captchaInvalid', 'expire':'captchaInvalid' });
	}

	$('button.encryptButton').on("click", function(){
	
		let iv = IV
		let uploadType = checkUploadType();

		if ( DEBUG ){

		    console.log("encyption requested");
		    console.log("Validity in Milliseconds: "+encryptionForm.validity.value )
		    console.log("Views: "+encryptionForm.views.value );
		    console.log("Password: "+encryptionForm.password.value );
		    console.log("Content: "+encryptionForm.content.value );

		}

	    let validity = encryptionForm.validity.value
	    let views = encryptionForm.views.value
	    let password = encryptionForm.password.value
	    let secret = ""

	    if ( uploadType == 'text'){
	    	secret = encryptionForm.content.value.toString(CryptoJS.enc.Utf8)	    	
	    } else {
	    	secret = fileContent
	    }

	    if ( validateCreateForm ( views, password ) ){ return }

	    encryptionForm.password.value = ""
	    managePasswordBar("empty")

	    encryptedSecret = CryptoJS.AES.encrypt(secret, password, { iv: iv })
	    
	    let decryptedSecret = CryptoJS.AES.decrypt(encryptedSecret, password, { iv: iv }).toString(CryptoJS.enc.Utf8)
	    
	    if ( DEBUG ){

		    console.log("Encrypted Secret: "+encryptedSecret)
		    console.log("Decrypted Secret: "+decryptedSecret )

		}

	    if( secret != decryptedSecret ){ console.log("Encryption Error") } else { console.log("Secret Successfully Encrypted") }


	    resultsForm.resultsValidity.value = convertVaidity(validity)
		resultsForm.resultsViews.value = views
		resultsForm.resultsPassword.value = password
		resultsForm.resultsSecret.value = encryptedSecret

		document.querySelector('#resultsContainer').removeAttribute('style');
		$('html, body').animate({scrollTop:$("#resultsContainer").height()+10}, 'slow');

	});

	$('button.generateLink').on("click", function(){

		if( USECAPTCHA == true && resultsForm.captchaToken.value == "" ) {
			document.getElementById("captchaToken").classList.add("is-invalid")
			hcaptcha.reset()
			return
		}

		$('#apiError').hide()	

		console.log( "We are not creating your secret." );
		console.log( "This is the content: "+resultsForm.resultsSecret.value );
		console.log( "The unencrypted version never touches our server.")
		
		jQuery.ajax({
		    url: APIADDRESS,
		    type: "POST",
		    headers: {
		        "Content-Type": "application/json",
		    },
		    contentType: "application/json",
		    data: JSON.stringify({
		        "ValidPeriod": convertVaidity(resultsForm.resultsValidity.value),	
		        "Message": resultsForm.resultsSecret.value,
		        "TotalViews": parseInt(resultsForm.resultsViews.value)
		        "Token": resultsForm.captchaToken.value
		    })
		})
		.done(function(data, textStatus, jqXHR) {

			let results = JSON.parse(data)

			if ( DEBUG ){

			    console.log("HTTP Request Succeeded: " + jqXHR.status);			    
			    console.log(results)

			}
		    
		    if( results.Type != 'success' ){
		    	$('#apiError').show()	
		    }

		    let token = results.Data.Id
		    let expiration = new Date(results.Data.Expiration).toString()

		    let secretUrl = WEBSITEADDRESS+"/view.html?token="+token 

		    linkForm.secretUrl.value = secretUrl
		    linkForm.secretToken.value = token
		    linkForm.secretExpiration.value = expiration
		    linkForm.totalViews.value = results.Data.TotalViews

		    document.querySelector('#linkContainer').removeAttribute('style');
		    $('html, body').animate({scrollTop:$("#linkContainer").offset().bottom}, 'slow');


		})
		.fail(function(jqXHR, textStatus, errorThrown) {

			if ( DEBUG ){

			    console.log("HTTP Request Failed");
			    console.log(jqXHR);
			    console.log(textStatus);
			    console.log(errorThrown);

			}

		    if( results.Type != 'success' ){
		    	$('#apiError').show()	
		    }

		})
		.always(function() {
		    /* ... */
		});

	});
	
	// Manage random password generation button. 
	$('button.passwordRandom').on("click", function(){

		let randomPassword = generateRandomPassword(30)
		encryptionForm.password.value = randomPassword
		managePasswordBar(evaluatePasswordStrength(randomPassword))

	});

	$('button.showHidePassword').on("click", function(){
		toggleShowHidePassword("password","showHidePassword")
	});

	$('button.showHidePasswordResult').on("click", function(){
		toggleShowHidePassword("resultsPassword","showHidePasswordResult")
	});

	$('button.copyPassword').on("click", function(){
		copyDiv("password")
	});

	$('button.resultsCopyPassword').on("click", function(){
		copyDiv("resultsPassword")
	});

	$('button.linkCopyButton').on("click", function(){
		copyDiv("secretUrl")
	});

	$('button.tokenCopyButton').on("click", function(){
		copyDiv("secretToken")
	});

	$('button.copyContent').on("click", function(){
		copyDiv("resultsSecret")
	});

	$('button.downloadContent').on("click", function(){
		
		if ( fileName == "" ) {
			fileName = "secret"
		}

		download(fileName, resultsForm.resultsSecret.value)
	});

	// Manage password strength bar. 
	document.getElementById('password').addEventListener('input',function(e){
		let password = document.getElementById('password').value
		let passwordStrength = evaluatePasswordStrength(password)
		managePasswordBar(passwordStrength)

	},false);

	
	document.getElementById('fileUpload').addEventListener('change', handleFileSelect, false);

	$('span.resetCaptcha').on("click", function(){
		console.log('click')
	    document.getElementById("captchaToken").classList.remove("is-invalid")
	    hcaptcha.reset()
	})


});

function validateCreateForm ( views, password ){

      errors = false

      if ( isNaN(views) || views > MAXVIEWS || views.length == 0 ) {
      document.getElementById("views").classList.add("is-invalid")
      errors = true     
    }

    if ( password.length == 0 ) {
      document.getElementById("password").classList.add("is-invalid")
      errors = true
    }

    return errors

}


function captchaValid(token){
  document.getElementById("captchaToken").value = token
}

function captchaInvalid(){
  document.getElementById("captchaToken").classList.add("is-invalid")
}




