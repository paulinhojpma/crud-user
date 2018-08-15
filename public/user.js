$(document).ready(function(){
	console.log("------------Carregando user.js -----------");
	var user = {};
	console.log("token no user.js - "+ token);


	/*$.ajax({
   				
   				url: window.location.href+ 'users',
   						headers: {
   							'x-access-token': token,
   							'index': 'index'},
   						success : function(data, status){
   						console.log("Status - "+ status);
                        console.log("Success - "+ data.success);		
               
                if(data.success){
                  //window.sessionStorage.setItem("token", null);
                  console.log(data.message);
                  var arr = data.usuarios;
                  arr.forEach(iteraLista);
                }
   							
                 //console.log(data.message);
                 console.log("token - " + window.sessionStorage.getItem("token"));
                
   						}
   		});*/

});