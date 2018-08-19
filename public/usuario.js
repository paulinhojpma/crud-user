$(document).ready(function(){
      console.log("------------Carregando usuario.js -----------");
     
      carregaListaUsuarios();

});
      
			 var userAtual= {};
      var usuarios = [];
      var rows = [];
      

		  function iteraListaUsuarios(value, index, array){
			console.log("Nome - "+ value.nome);
			var row = $("<tr></tr>").appendTo("#tabela");
			var nome = $("<td></td>").text(value.nome).appendTo(row);
			var email = $("<td></td>").text(value.email).appendTo(row);			
			var atualizar = $("<td></td>").text("atualizar").appendTo(row);
			var deletar = $("<td></td>").text("deletar").appendTo(row);
			var mostrar = $("<td></td>").text("mostrar").appendTo(row);
			atualizar.attr("id", "atualizar_"+index);
			deletar.attr("id", "deletar_"+index);
			mostrar.attr("id", "mostrar_"+index);
			row.attr("id", value.email);
			rows.push(row);		
		}

    function succesUserGet(id, type = "get"){      
      console.log("Entrou no succesUserGet");
      $.ajax({
            url: window.location.href + "users/"+ id,
            headers: {
                'x-access-token': token,
                'id': 'email'},
              success: function(data, status,){
                  userAtual = data;
                  console.log("Usuario retornado" + userAtual.login);
                  console.log("Type retornado - " + type);
	                  if(type == "get"){
	                  	 	carregaUsuario();
	                  	}else{
	                  		carregaUsuario("update");
	                  	}
                 
                
              }


        });
    }



    function succesUserHtml(data, status){
      console.log("Entrou no succesUserHtml");
        console.log("Status - "+ status);
        console.log("usuario.hrml - "+ status);	
        
        $("#user").html(data);
           

    }

	function addEventoUsuario(value, index, array){
			console.log("Entrou no  addEventoUsuario- "+ value.attr('id'));
			let id = "#mostrar_"+index;
		addEventoDeletaUsuario(value, index, array);
		addEventUpdateUsuario(value, index, array);
      value.children(id).click(function(){

			
  			console.log("Email no escolhido - "+ value.attr('id'));
        

        if($("#user").children().length == 0 || $("#user").find("#usuario_titulo").length ==0){ 
            console.log("Chamando a userView");  
    				$.ajax({
    						url: window.location.href + "users/userView",
    							headers: {
    	   							'x-access-token': token,
    	   							'index': 'index'},
    						
    						
							success: function(data, status){
			                  
			                   		console.log("Div user children - "+ $("#user").children().length);
				                    
				                      succesUserHtml(data, status);
				                      succesUserGet(value.attr('id'));  
				                    
			                   
			                    						 
							
							}
    					});
          }else{
            if($("#usuario_email").text() != value.attr('id')){
                succesUserGet(value.attr('id'));    
              }
            
          }

			});
		}

		function carregaUsuario(type = "get"){
			if(type == "get"){
				$("#usuario_titulo").text(userAtual.nome);
				$("#usuario_email").text(userAtual.email);
	      		$("#usuario_login").text(userAtual.login);
				$("#usuario_nascimento").text(formatDate(userAtual.nascimento));

			}else{
				$("#update_nome").val(userAtual.nome);
				$("#update_email").val(userAtual.email);
	      		$("#update_login").val(userAtual.login);
				$("#update_nascimento").val(userAtual.nascimento);
				$("#update_senha").val(userAtual.senha);
			}
			
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
		

    function carregaListaUsuarios(){
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
			                 	usuarios = data.usuarios;
                       
			                  	usuarios.forEach(iteraListaUsuarios);
			                  	rows.forEach(addEventoUsuario);
                        	novoUsuario();
			                }
   							
                 			//console.log(data.message);
                 			console.log("token - " + window.sessionStorage.getItem("token"));
                
   						}
   		});
  }
//--------------------criar usuário----------------------------------

	function novoUsuario(){
		console.log("Entrou no novoUsuario");
		$("#novo_usuario").click(function(){
		       	if($("#user").children().length == 0 || $("#user").find("#create_nome").length == 0){
		  			$.ajax({
		  				url: window.location.href+ 'users/new',
		  				headers: {
							'x-access-token': token,
							'index': 'index'},
		     				success: function(data, status){
		                
			                  succesUserHtml(data, status);
			                  userAtual = {};
			                  addEventCreateUser();

		     				}
		  			});
		      }

		});
	}



    function addEventCreateUser(){
    console.log("Entrou no addEventCreateUser");
      $("#salvar_usuario").click(function(){
            userAtual.nome = $("#create_nome").val();
            userAtual.login = $("#create_login").val();
            userAtual.senha = $("#create_senha").val();
            userAtual.nascimento = $("#create_nascimento").val();
            userAtual.email =  $("#create_email").val();

            $.ajax({
                url: window.location.href + "users",
                type : 'POST',
                headers: {
                    'x-access-token': token,
                    'index': 'index'
                },
                contentType: "application/x-www-form-urlencoded",
                data: {
                  nome: userAtual.nome,
                  login: userAtual.login,
                  senha: userAtual.senha,
                  nascimento: userAtual.nascimento,
                  email: userAtual.email
                },
                dataType : 'JSON',
                success: function(data, status){
                  userAtual= {};
                  console.log("Salvo - "+ data.success);
                  if(data.success){
                    
                    
                    deletaListaUsuarios();
                    carregaListaUsuarios();
                    $("#user").empty();

                  }else{

                    carregarMensagens(data.message);
                    $("#user").empty()
                  }

                  

                }

            });
        });
    }

	function deletaListaUsuarios(){
    $("#tabela").empty();
    var row = $("<tr></tr>").appendTo("#tabela");
      var nome = $("<th></th>").text("Nome").appendTo(row);
      var email = $("<th></th>").text("Email").appendTo(row);
      var gen = $("<th></th>").text("Nascimento").appendTo(row);
      gen.attr("colspan", "3");
      var login = $("<th></th>").text("Login").appendTo(row);

  }

  function addEventoDeletaUsuario(value, index, array){
  	console.log("Entrou no  addEventoUsuario- "+ value.attr('id'));
  	let id = "#deletar_"+index;
  	value.children(id).click(function(){
  		console.log("Email no escolhido - "+ value.attr('id'));
  		if(confirm("Deseja remover este usuário?")){
	  		$.ajax({
	  			url: window.location.href+ 'users/'+ value.attr('id'),
				headers: {
					'x-access-token': token,
					'index': 'index'},
				type: "DELETE",
				success: function(data, status){
					if(data.success){
						carregarMensagens(data.message);
						let remove = "#"+ value.attr('id');
						$("#deletar_"+index).parent().remove();
					}else{
						carregarMensagens(data.message);
					}
				}

	  		});
  		}

  	});

  }

  function addEventUpdateUsuario(value, index, array){
  	console.log("Entrou no  addEventoUpdateUsuario- "+ value.attr('id'));
  	let id = "#atualizar_"+index;
  	value.children(id).click(function(){

  		if($("#user").children().length == 0 || $("#user").find("#update_nome").length == 0){
  			$.ajax({
	  			url: window.location.href+ 'users/atualizaView',
				headers: {
					'x-access-token': token,
					'index': 'index'},
				
				success: function(data, status){
						succesUserHtml(data, status);
						succesUserGet(value.attr('id'), "update");
						updateUsuario(value.attr('id'), index);
					/*if(data.success){
						succesUserHtml(data, status);
						$("#deletar_"+index).parent().remove();
					}else{
						carregarMensagens(data.message);
					}*/
				}

	  		});
  		}else{
  			succesUserGet(value.attr('id'), "update");
  		}


  	});
  }

  function updateUsuario(id, index){
  	console.log("Entrou no  addEventoUpdateUsuario- "+ id);
  	
  	$("#atualiza_usuario").click(function(){
  			userAtual.nome = $("#update_nome").val();
            userAtual.login = $("#update_login").val();
            userAtual.senha = $("#update_senha").val();
            userAtual.nascimento = $("#update_nascimento").val();
            userAtual.email =  $("#update_email").val();
            console.log("Nome retorndado apos atualizar - "+ userAtual.nome);
  			$.ajax({
	  			url: window.location.href+ 'users/'+id,
				headers: {
					'x-access-token': token,
					'index': 'index'},
				type: 'PUT',
				contentType: "application/x-www-form-urlencoded",
				data: {

                  nome: userAtual.nome,
                  login: userAtual.login,
                  senha: userAtual.senha,
                  nascimento: userAtual.nascimento,
                  email: userAtual.email
                },
				
				success: function(data, status){
						

					if(data.success){
						
						$("#user").empty();
						carregarMensagens(data.message);
						row = $("#atualizar_"+index).parent();
						console.log("Valor do index - "+ index);
						console.log("Tamanho da linha - "+ $("#atualizar_"+index).parent().children().eq(0).text());
						row.children().eq(0).text(data.user.nome);
						row.children().eq(1).text(data.user.email);

					}else{
						carregarMensagens(data.message);
					}
					userAtual = {};
				}

	  		});


  	});
  

  }


  function fechaTela(){
      $("#lista").empty();
      $("#user").empty();
        userAtual= {};
        usuarios = [];
        rows = [];
  }
	
