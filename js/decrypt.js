
decryptedSecret = ""
encryptedSecret = ""
fileName = ""
fileContent = ""

$( document ).ready(function() {


   	$('button.decrypt').on("click", function(){
   		console.log('here');
   		document.getElementById("decryptPassword").classList.remove("is-invalid")	

   		let uploadType = checkUploadType();

   		if ( uploadType == 'text'){
	    	encryptedSecret = decryptContent.content.value.toString(CryptoJS.enc.Utf8)	    	
	    } else {
	    	encryptedSecret = fileContent.toString(CryptoJS.enc.Utf8)
	    }

   		let iv = IV
   		let password = decryptContent.decryptPassword.value

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
		$('html, body').animate({scrollTop:$("#decryptedSecretForm").height()+10}, 'slow');


   	});

   	$('button.showHidePasswordResult').on("click", function(){
		toggleShowHidePassword("decryptPassword","showHidePasswordResult")
	});

	$('button.copyContent').on("click", function(){
		copyDiv("decryptedContent")
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

	document.getElementById('fileUpload').addEventListener('change', handleFileSelect, false);

});







