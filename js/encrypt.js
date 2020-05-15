
fileName = ""
fileContent = ""
encryptedSecret = ""

$( document ).ready(function() {

	$('button.encryptButton').on("click", function(){
	
		let iv = IV
		let uploadType = checkUploadType();

	    let password = encryptionForm.password.value
	    let secret = ""

	    if ( uploadType == 'text'){
	    	secret = encryptionForm.content.value.toString(CryptoJS.enc.Utf8)   	
	    } else {
	    	secret = fileContent
	    }

	    encryptionForm.password.value = ""

	    managePasswordBar("empty")

	    encryptedSecret = CryptoJS.AES.encrypt(secret, password, { iv: iv })
	    
	    let decryptedSecret = CryptoJS.AES.decrypt(encryptedSecret, password, { iv: iv }).toString(CryptoJS.enc.Utf8)
	    
	    if ( DEBUG ){

		    console.log("Encrypted Secret: "+encryptedSecret)
		    console.log("Decrypted Secret: "+decryptedSecret )

		}

	    if( secret != decryptedSecret ){ console.log("Encryption Error") } else { console.log("Secret Successfully Encrypted") }

		resultsForm.resultsSecret.value = encryptedSecret

		document.querySelector('#resultsForm').removeAttribute('style');
		$('html, body').animate({scrollTop:$("#resultsForm").height()+10}, 'slow');

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

	$('button.copyPassword').on("click", function(){
		copyDiv("password")
	});

	$('button.copyContent').on("click", function(){
		copyDiv("resultsSecret")
	});

	$('button.downloadContentButton').on("click", function(){
		
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

});


function validateCreateForm ( views, password ){

	errors = false

    if ( password.length == 0 ) {
    	document.getElementById("password").classList.add("is-invalid")
    	errors = true
    }

    return errors

}





