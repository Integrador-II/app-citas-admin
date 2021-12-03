
const URL_BACKEND="http://localhost:8080";
var AppEspecialidad = {
    init: function() {
        console.log("inicio de la aplicación");
        this.listar();
        this.eventos();
    },
    eventos: function(){
        $('#btnSave').on("click", function(){
            if(AppEspecialidad.isFormValid()){
                AppEspecialidad.registrar();
            }
        });

        $('#btnAgregar').on("click", function(){
            AppEspecialidad.limpiarForm();
            $('#myModalLabel').text("Agregar");
            $('#myModal').modal('toggle');
        });

        $('input').on("keyup", function(){
            AppEspecialidad.isFormValidElement();
        })

        this.eventosMantenimiento();
    },
    eventosMantenimiento: function(){
        $('.bnt_editar').on("click", function(){
            var dataId = $(this).data('id');
            if(null != dataId){
                $('#myModalLabel').text("Editar");
                AppEspecialidad.loadEdit(dataId);
            }
        });

    },    
    isFormValidElement: function(element){
        var element = $(element);
        if(element.val()==''){
            element.parent().addClass('has-error');
            element.focus();
            return false;
        }else{
            element.parent().removeClass('has-error');
        }
    },
    isFormValid: function(){
        var nombre = $('#txt_nombre');
        if(nombre.val()==''){
            nombre.parent().addClass('has-error');
            nombre.focus();
            return false;
        }

        nombre.parent().removeClass('has-error');
        return true;
    },

    listar: function() {
        console.log("***listar");
        
        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/especialidades",
            data: {  }, 
            dataType: 'json',
            success: function (data) { 

                $('#dataTables-especialidad tbody').empty();

                $.each(data, function(index, element) {
                    var templateRow = `<tr>
                                        <td>${element.idEspecialidad}</td>
                                        <td>${element.nombre}</td>
                                        <td width="20%" align="center">
                                            <button class="btn btn-info bnt_editar" data-id="${element.idEspecialidad}"><i class="fa fa-edit "></i> Editar</button>&nbsp;&nbsp;
                                            <!--<button class="btn btn-danger" bnt_eliminar data-id="${element.idEspecialidad}"><i class="fa fa-pencil"></i> Eliminar</button>-->
                                        </td>
                                    </tr>`;

                    $('#dataTables-especialidad tbody').append(templateRow);
                });

                $('#dataTables-especialidad').dataTable();

                AppEspecialidad.eventosMantenimiento();
                /*
                $('#dataTables-especialidad').dataTable({
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                    }
                });
                */

            }
        });
    },

    loadEdit: function(id, nombre){
        AppEspecialidad.limpiarForm();

        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/especialidades/"+id,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) { 

                if(null != data){
                    $('#txt_nombre').val(data.nombre);
                    
                    $('#idEspecialidad').val(data.idEspecialidad);
                    $('#myModal').modal('toggle');
        
                }else{
                    alert('Ocurrió un error, intente nuevamente.');
                }

            },
            error: function( jqXhr, textStatus, errorThrown ){
                alert('Ocurrió un error');
                console.log("Error")
            }
        });


    },
    limpiarForm(){
        $('#idEspecialidad').val('');
        $('#txt_nombre').val('');
    },
    registrar: function() {
        var jsonData = {
            nombre: $('#txt_nombre').val()
        }

        var idEspecialidad = $('#idEspecialidad').val();
        if(null != idEspecialidad && idEspecialidad != ""){
            jsonData.idEspecialidad = idEspecialidad;
        }
        

        $.ajax({ 
            type: 'POST', 
            url: URL_BACKEND+"/especialidades",
            data: JSON.stringify(jsonData), 
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) { 
                console.log(data);

                if(data.status == "OK"){
                    $('#txt_nombre').val('');
                    AppEspecialidad.alert('Datos registrados correctamente.');
                    AppEspecialidad.listar();
                    $('#myModal').modal('toggle');
                }else{
                    AppEspecialidad.alert('Ocurrió un error, intente nuevamente.');
                }

            },
            error: function( jqXhr, textStatus, errorThrown ){
                AppEspecialidad.alert('Ocurrió un error, intente nuevamente.');
                console.log("Error")
            }
        });
    },
    alert: function(mensaje){
        $('#lblMensaje').text(mensaje);
        $('#myModalMensaje').modal('toggle');
    }
};

AppEspecialidad.init();