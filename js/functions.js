
function toggleShowHidePassword(div,button){

      let passwordDiv = document.getElementById(div)
      let buttonDiv = document.getElementById(button)

      if( passwordDiv.type == "text" ){
            passwordDiv.type = "password"
            buttonDiv.innerHTML = "Show"
      } else {
            passwordDiv.type = "text"
            buttonDiv.innerHTML = "Hide"  
      }

}


function copyDiv(div){

      let copyText = document.getElementById(div)
      
      copyText.select()
      copyText.setSelectionRange(0, 99999)

      document.execCommand('copy')

}


function convertVaidity(mil) {
	let convert = {
      300000:"5 minutes",
      600000:"10 minutes",
      1800000:"30 minutes",
      3600000:"1 hour",
      7200000:"2 hours",
      21600000:"6 hours",
      43200000:"12 hours",
      86400000:"1 day",
      172800000:"2 day",
      604800000:"1 Week",
      1209600000:"2 Weeks",
      2419200000:"1 Month",
      "5 minutes":300000,
      "10 minutes":600000,
      "30 minutes":1800000,
      "1 hour":3600000,
      "2 hours":7200000,
      "6 hours":21600000,
      "12 hours":43200000,
      "1 day":86400000,
      "2 day":172800000,
      "1 Week":604800000,
      "2 Weeks":1209600000,
      "1 Month":2419200000,
	}
	return convert[mil]
}


function download(filename, text) {
    let element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain,' + text)
    element.setAttribute('download', filename + '.txt')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}

function toggleShowHidePassword(div,button){

      let passwordDiv = document.getElementById(div)
      let buttonDiv = document.getElementById(button)

      if( passwordDiv.type == "text" ){
            passwordDiv.type = "password"
            buttonDiv.innerHTML = "Show"
      } else {
            passwordDiv.type = "text"
            buttonDiv.innerHTML = "Hide"  
      }

}

function evaluatePasswordStrength(password){

      if ( password.length == 0 ){
            return "empty"
      }

      if ( password.length < 8 ){
            return "poor"
      }

      let containsLowerCase = false;
      let containsUpperCase = false;
      let containsNumbers = false;
      let containsSymbols = false;

      const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
      const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '1234567890'
      const symbols = '~!@#$%^&*()_+-='

      let lowerCaseArray = lowerCase.split("")
      let upperCaseArray = upperCase.split("")
      let numbersArray = numbers.split("")
      let symbolsArray = symbols.split("")

      let passwordArray = password.split("")

      for (let i = passwordArray.length - 1; i >= 0; i--) {
            if ( lowerCaseArray.includes(passwordArray[i]) ) { containsLowerCase = true }
            if ( upperCaseArray.includes(passwordArray[i]) ) { containsUpperCase = true }
            if ( numbersArray.includes(passwordArray[i]) ) { containsNumbers = true }
            if ( symbolsArray.includes(passwordArray[i]) ) { containsSymbols = true }
      } 

      console.log( containsLowerCase+" "+containsUpperCase+" "+containsNumbers+" "+containsSymbols )
      if( containsLowerCase && 
            containsUpperCase && 
            containsNumbers &&
            containsSymbols &&
            password.length > 12 ){
            return "strong"
      }

      return "weak"


}


function generateRandomPassword(length){
      
      let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+-='
      let password = ''

      for (let i = 0; i < length; i++) {
          let random_number = Math.floor(Math.random() * alphabet.length-1) + 1
          password += alphabet[random_number]
      }

      return password

}

function handleFileSelect(event){

  let file = this.files[0]
  let fileUploadDiv = document.getElementById('fileUpload')

  fileUploadDiv.classList.remove("is-invalid")

  if ( file.size > MAXFILESIZE ) {
      console.log("Is Invalid")
      fileUploadDiv.classList.add("is-invalid")
      return
  }

  fileName = file.name

  console.log(file);

  document.getElementById('fileUploadLabel').innerHTML=file.name

  const reader = new FileReader()
  reader.onload = handleFileLoad
  reader.readAsDataURL(event.target.files[0])

}

function handleFileLoad(event){
  fileContent = event.target.result
}

function managePasswordBar(passwordStrength){

      let strengthBar = document.getElementById("passwordStrength")

      if ( passwordStrength == 'empty' ){
            strengthBar.setAttribute("aria-expanded", "0")
            strengthBar.className = "progress-bar"
            strengthBar.style.width = "0%"
            strengthBar.innerHTML = ""
            return 
      }

      if ( passwordStrength == 'poor' ){
            strengthBar.setAttribute("aria-expanded", "33")
            strengthBar.className = "progress-bar bg-danger"
            strengthBar.style.width = "33%"
            strengthBar.innerHTML = "Insecure"
      }

    if ( passwordStrength == 'weak' ){
            strengthBar.setAttribute("aria-expanded", "66")
            strengthBar.className = "progress-bar bg-warning"     
            strengthBar.style.width = "66%"
            strengthBar.innerHTML = "Weak"            
      }

      if ( passwordStrength == 'strong' ){
            strengthBar.setAttribute("aria-expanded", "100")
            strengthBar.className = "progress-bar bg-success"
            strengthBar.style.width = "100%"
            strengthBar.innerHTML = "Strong"
      }

      document.getElementById("password").classList.remove("is-invalid")

}

function toggleShowHidePassword(div,button){

      let passwordDiv = document.getElementById(div)
      let buttonDiv = document.getElementById(button)

      if( passwordDiv.type == "text" ){
            passwordDiv.type = "password"
            buttonDiv.innerHTML = "Show"
      } else {
            passwordDiv.type = "text"
            buttonDiv.innerHTML = "Hide"  
      }

}

function copyDiv(div){

      let copyText = document.getElementById(div)
      
      copyText.select()
      copyText.setSelectionRange(0, 99999)

      document.execCommand('copy')

}



function checkUploadType(){

      if( document.getElementById('pills-text-tab').getAttribute('aria-selected') == "true" ) {
            return "text"
      } else {
            return "file"
      }

}


function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function extractMimeTypeFileExtension(fileString){

      let mime = fileString.split(';')[0].split(':')[1]

      if ( MIMETYPES.hasOwnProperty(mime) ){
            return MIMETYPES[mime].extensions[0]
      } else {
            return false
      }
      
}


