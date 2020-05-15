$( document ).ready(function() {

	const URLPARAMS = new URLSearchParams(window.location.search)
	if ( URLPARAMS.has('token') ){
		tokenForm.userToken.value = URLPARAMS.get('token')
	}

	$('button.tokenSubmit').on("click", function(){	

		$('#viewAPIerror').hide()
		$('#viewAPIerror').attr("style", "display:none;");

		document.getElementById("userToken").classList.remove("is-invalid")

		if ( tokenForm.userToken.value == "" || tokenForm.userToken.value.length !== 24 ){
			document.getElementById("userToken").classList.add("is-invalid")
			return
		}
		
		jQuery.ajax({
		    url: APIADDRESS+"/check/"+tokenForm.userToken.value,
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
		    let encryptedContent = results.Data.Message

		    getSecretResultForm.secretViewExpiration.value = expiration
		    getSecretResultForm.secretViewViews.value = views
		    

		    document.querySelector('#getSecretResult').removeAttribute('style');
			$('html, body').animate({scrollTop:$("#getSecretResult").height()+10}, 'slow');


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


});



