$(document).ready(function(){
  console.log("------------Carregando usuario.js -----------");

  	var usuarioAtual= {};
	var usuarios = [];

			function mostraUsuario(email){
				console.log("Email no mostraUsuario - "+ email);
				$.ajax({
						url: window.location.href + "users/userView",
							headers: {
	   							'x-access-token': token,
	   							'index': 'index'},
						
						
							success: function(data, status){
							
							console.log("Status - "+ status);
							
							userAtual={};
							
							$("#user").html();
							
							$.ajax({
									url: window.location.href + "users/"+ email,
									headers: {
	   									'x-access-token': token,
	   									'id': 'email'},
	   								success: function(data, status){
	   									console.log("Usuario retornado" + data.user);
	   									usuarioAtual = data.user;
	   									carregaUsuario();
	   								}


							});
						}
				});
			}


		  function iteraLista(value, index, array){
			console.log("Nome - "+ value.nome);
			var row = $("<tr></tr>").appendTo("#tabela");
			var nome = $("<td></td>").text(value.nome).appendTo(row);
			var email = $("<td></td>").text(value.email).appendTo(row);
			var nascimento = $("<td></td>").text(formatDate(value.nascimento)).appendTo(row);
			var login = $("<td></td>").text(value.login).appendTo(row);
			row.click(function(){
				tmonstraUsuario(value.email);

			});
			
		}

		function carregaUsuario(){
			$("#titulo").text(user.nome);
			$("#email").text(user.email);
			$("#nascimento").text(formatDate(user.nascimento));
			$("#login").text(user.login);

		}
		function formatDate(date){
			data = new Date(date);
			var day = data.getDate();
			var monthIndex;
  			if(data.getMonth() > 9){
  				monthIndex = data.getMonth() + 1;
  			 }else{
				monthIndex = "0"+ (data.getMonth()+1);
  			 }

 		 	var year = data.getFullYear();
 		 	console.log(day+"/"+monthIndex+"/" +year);
 		 	return day+"/"+monthIndex+"/"+year;
		}

		
   		 console.log("token no usuarios.js - "+ token);
		
    	//Carrega lista de usuarios
		$.ajax({
   				
   				url: window.location.href+ 'users',
   						headers: {
   							'x-access-token': token,
   							'index': 'index'},
   						success : function(data, status){
   						console.log("Status - "+ status);
                        //console.log("Success - "+ data.success);		
               
			                if(data.success){
			                  //window.sessionStorage.setItem("token", null);
			                  console.log(data.message);
			                  var arr = data.usuarios;
			                  arr.forEach(iteraLista);
			                }
   							
                 			//console.log(data.message);
                 			console.log("token - " + window.sessionStorage.getItem("token"));
                
   						}
   		});



	
});