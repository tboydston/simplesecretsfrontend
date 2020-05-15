
decryptedSecret = ""
encryptedSecret = ""

$( document ).ready(function() {

	const URLPARAMS = new URLSearchParams(window.location.search)
	if ( URLPARAMS.has('token') ){
		tokenForm.userToken.value = URLPARAMS.get('token')
	}

	$('button.tokenSubmit').on("click", function(){	

		$('#viewAPIerror').hide()
		$('#viewAPIerror').attr("style", "display:none;");
		$('#deleteAPIsuccess').hide()
		$('#deleteAPIsuccess').attr("style", "display:none;");

		document.getElementById("userToken").classList.remove("is-invalid")

		if ( tokenForm.userToken.value == "" || tokenForm.userToken.value.length !== 24 ){
			document.getElementById("userToken").classList.add("is-invalid")
			return
		}
		
		jQuery.ajax({
		    url: APIADDRESS+"/get/"+tokenForm.userToken.value,
		    type: "GET",
		    headers: {
		        "Content-Type": "application/json",
		    },
		})
		.done(function(data, textStatus, jqXHR) {

			let results = JSON.parse(data)

			if( results.Type != "success" ){
				$('#viewAPIerror').attr("style", "");
		    	$('#viewAPIerror').show()	
		    }

		    let expiration = new Date(results.Data.Expiration).toString()
		    let views = results.Data.CurrentViews+" of "+results.Data.TotalViews
		    encryptedSecret = results.Data.Message

		    getSecretResultForm.secretViewExpiration.value = expiration
		    getSecretResultForm.secretViewViews.value = views
		    getSecretResultForm.resultsEncryptedContent.value = encryptedSecret

		    document.querySelector('#getSecretResult').removeAttribute('style');
			$('html, body').animate({scrollTop:$('#getSecretResult').offset().top-50}, 'slow');


		    if ( DEBUG ){

			    console.log("HTTP Request Succeeded: " + jqXHR.status);
			    console.log(data);

			}

		})
		.fail(function(jqXHR, textStatus, errorThrown) {

			$('#viewAPIerror').attr("style", "");
	    	$('#viewAPIerror').show()	

			if ( DEBUG ){

			    console.log("HTTP Request Failed");
			    console.log(jqXHR);
			    console.log(textStatus);
			    console.log(errorThrown);

			}

		})
		.always(function() {
		    /* ... */
		});

    });

   	$('button.decrypt').on("click", function(){

   		document.getElementById("decryptPassword").classList.remove("is-invalid")	

   		let iv = IV
   		let password = getSecretResultForm.decryptPassword.value

   		decryptedSecret = CryptoJS.AES.decrypt(encryptedSecret, password, { iv: iv }).toString(CryptoJS.enc.Utf8)

   		if ( DEBUG ) {
   			console.log(decryptedSecret);
   		}

   		if ( decryptedSecret == "" ){
			document.getElementById("decryptPassword").classList.add("is-invalid")
			return
   		}

   		decryptedSecretForm.decryptedContent.value = decryptedSecret

		document.querySelector('#decryptedSecretForm').removeAttribute('style');
		$('html, body').animate({scrollTop:$('#decryptedSecretForm').offset().top-400}, 'slow');


   	});

   	$('button.showHidePasswordResult').on("click", function(){
		toggleShowHidePassword("decryptPassword","showHidePasswordResult")
	});

	$('button.copyContent').on("click", function(){
		copyDiv("decryptedContent")
	});

	$('button.tokenDelete').on("click", function(){
		$('#confirmDelete').attr("style", "")
	});

	$('button.confirmDelete').on("click", function(){

		let token = tokenForm.userToken.value

		jQuery.ajax({
		    url: APIADDRESS+"/"+token,
		    type: "DELETE",
		    headers: {
		        "Content-Type": "application/json",
		    },
		})
		.done(function(data, textStatus, jqXHR) {
		   
		   	let results = JSON.parse(data)

			if( results.Type != "success" ){
				$('#viewAPIerror').attr("style", "")
		    	$('#viewAPIerror').show()	
		    } else {
		    	$('#deleteAPIsuccess').attr("style", "")
		    	$('#deleteAPIsuccess').show()		
		    }

		   if ( DEBUG ){

			    console.log("HTTP Request Succeeded: " + jqXHR.status)
			    console.log(data)

			}


		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#viewAPIerror').attr("style", "");
	    	$('#viewAPIerror').show()	

	    	if ( DEBUG ){

			    console.log("HTTP Request Failed");
			    console.log(jqXHR);
			    console.log(textStatus);
			    console.log(errorThrown);

			}

		})
		.always(function() {
		    /* ... */
		});

	});

	$('button.downloadContentButton').on("click", function(){

		let now = new Date().getTime()
		let ext = extractMimeTypeFileExtension(decryptedSecret)
		let downloadData = decryptedSecret

		if ( !ext ) {
			downloadData = 'data:application/octet-stream,' + downloadData
			ext = 'txt'
		} 

		downloadURI(downloadData, "secret-"+now+"."+ext)

	});




});



