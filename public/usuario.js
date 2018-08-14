$(document).ready(function(){
  console.log("------------Carregando usuario.js -----------");
	var usuarios = [];
		  function iteraLista(value, index, array){
			console.log("Nome - "+ value.nome + array[index]);
			var row = $("<tr></tr>").appendTo("#tabela");
			var nome = $("<td></td>").text(value.nome).appendTo(row);
			var email = $("<td></td>").text(value.email).appendTo(row);
			
		}
    console.log("token no usuarios.js - "+ token);
		$.ajax({
   				
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
   		});



	
});