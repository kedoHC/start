jQuery(document).ready(function($) {
	// console.log("runs...");
	var flagMobile;
	/*=======================================
	VERIFICAR EL WIDTH DE LA PANTALLA
	=======================================*/

	if($(window).width() < 768){
		/*===funciones para mobile=======*/
		// console.log("mobile...");
		flagMobile = true;

	}else{
		/*===funciones para desktop======*/
		// console.log("desktop...");
		flagMobile = false;
	}

	/*=======================================
	VERIFICAR EL WIDTH DE LA PANTALLA AL RESIZE
	=======================================*/

	$(window).resize(function(event) {
		if($(window).width() < 768){
			/*===funciones para mobile=======*/
			// console.log("mobile...");
			flagMobile = true;

		}else{
			/*===funciones para desktop======*/
			// console.log("desktop...");
			flagMobile = false;
		}
	});
});