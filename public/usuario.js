$(document).ready(function(){
  console.log("------------Carregando usuario.js -----------");

  var userAtual= {};
	var usuarios = [];
	var rows = [];
			


		  function iteraListaUsuarios(value, index, array){
			console.log("Nome - "+ value.nome);
			var row = $("<tr></tr>").appendTo("#tabela");
			var nome = $("<td></td>").text(value.nome).appendTo(row);
			var email = $("<td></td>").text(value.email).appendTo(row);
			var nascimento = $("<td></td>").text(formatDate(value.nascimento)).appendTo(row);
			var login = $("<td></td>").text(value.login).appendTo(row);
			var atualizar = $("<td></td>").text("atualizar").appendTo(row);
			var deletar = $("<td></td>").text("deletar").appendTo(row);
			var mostrar = $("<td></td>").text("mostrar").appendTo(row);
			atualizar.attr("id", "atualizar_"+index);
			deletar.attr("id", "deletar_"+index);
			mostrar.attr("id", "mostrar_"+index);
			row.attr("id", value.email);
			rows.push(row);		
		}

    function succesUserGet(id){      

      $.ajax({
            url: window.location.href + "users/"+ id,
            headers: {
                'x-access-token': token,
                'id': 'email'},
              success: function(data, status,){
                  userAtual = data;
                  console.log("Usuario retornado" + userAtual.login);
                  carregaUsuario();
                
              }


        });
    }



    function succesUserHtml(data, status){
        console.log("Status - "+ status);
        console.log("usuario.hrml - "+ status);	
        
        $("#user").html(data);
           

    }

		function addEventoUsuario(value, index, array){
			console.log("Entrou no  addEventoUsuario- "+ value.attr('id'));
			value.("$mostrar_"+index).click(function(){

			
  			console.log("Email no addEventoUsuario - "+ value.attr('id'));
          console.log("Id são iguais - " +  $("#usuario_email").attr('id') == value.attr('id'));
        if($("#usuario_email").text() != value.attr('id')){   
    				$.ajax({
    						url: window.location.href + "users/userView",
    							headers: {
    	   							'x-access-token': token,
    	   							'index': 'index'},
    						
    						
							success: function(data, status){
			                   if(data.success){
			                   		console.log("Div user children - "+ $("#user").children().length);
				                    if($("#user").children().length == 0){
				                      succesUserHtml(data, status);
				                      succesUserGet(value.attr('id'));  
				                    }else{
				                      succesUserGet(value.attr('id'));
				                    }
			                   }else{
			                   		

			                   }
			                    						 
							
							}
    					});
          }

			});
		}

		function carregaUsuario(){
			$("#usuario_titulo").text(userAtual.nome);
			$("#usuario_email").text(userAtual.email);
      		$("#usuario_login").text(userAtual.login);
			$("#usuario_nascimento").text(formatDate(userAtual.nascimento));
			

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
			                  arr.forEach(iteraListaUsuarios);
			                  rows.forEach(addEventoUsuario);
			                }
   							
                 			//console.log(data.message);
                 			console.log("token - " + window.sessionStorage.getItem("token"));
                
   						}
   		});
//--------------------criar usuário----------------------------------

	function novoUsuario(){
		console.log("Entrou no novoUsuario");
		$("#novo_usuario").click(function(){
			$.ajax({
				url: window.location.href+ 'users/new',
				headers: {
   							'x-access-token': token,
   							'index': 'index'},
   				success: function(data, status){


   				}
			});


		});
	}


	//destrois todos os componente se o token for invalido
	function fechaTela(){
		$()
	}

	/*function addEventCreateUser(value, index, array){
		console.log("Entrou no addEventCreateUser");
		value.children("#atualizar_"+index).click(function(){



		});
	}*/
	
});