
const URL_BACKEND="http://localhost:8080";
var AppMedico = {
    init: function() {
        console.log("inicio de la aplicación");
        this.listar();
        this.eventos();
        this.cargarEspecialidades();
    },
    eventos: function(){
        $('#btnSave').on("click", function(){
            if(AppMedico.isFormValid()){
                AppMedico.registrar();
            }
        });

        $('#btnAgregar').on("click", function(){
            AppMedico.limpiarForm();
            $('#myModalLabel').text("Agregar");
            $('#myModal').modal('toggle');
        });

        $('input').on("keyup", function(){
            AppMedico.isFormValidElement($(this));
        });

        this.eventosMantenimiento();
    },
    eventosMantenimiento: function(){
        $('.bnt_editar').on("click", function(){
            var dataId = $(this).data('id');
            if(null != dataId){
                $('#myModalLabel').text("Editar");
                AppMedico.loadEdit(dataId);
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
        var apellidoPaterno = $('#txt_apellido_paterno');
        var apellidoMaterno = $('#txt_apellido_materno');
        var nombre = $('#txt_nombre');
        var numeroDocumento = $('#txt_numero_documento');
        var especialidad = $('#select_especialidad');

        if(apellidoPaterno.val()==''){
            apellidoPaterno.parent().addClass('has-error');
            apellidoPaterno.focus();
            return false;
        }else if(apellidoMaterno.val()==''){
            apellidoMaterno.parent().addClass('has-error');
            apellidoMaterno.focus();
            return false;
        }else if(nombre.val()==''){
            nombre.parent().addClass('has-error');
            nombre.focus();
            return false;
        }else if(numeroDocumento.val()==''){
            numeroDocumento.parent().addClass('has-error');
            numeroDocumento.focus();
            return false;
        }else if(especialidad.val()==''){
            especialidad.parent().addClass('has-error');
            especialidad.focus();
            return false;
        }else {
            apellidoPaterno.parent().removeClass('has-error');
            apellidoMaterno.parent().removeClass('has-error');
            nombre.parent().removeClass('has-error');
            numeroDocumento.parent().removeClass('has-error');
            especialidad.parent().removeClass('has-error');

            return true;
        }
    },

    cargarEspecialidades: function(){

        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/especialidades",
            data: {  }, 
            dataType: 'json',
            success: function (data) { 

                $('#select_especialidad').empty();
                var templateRow = `<option value=""> - Seleccione - </option>`;
                $('#select_especialidad').append(templateRow);

                $.each(data, function(index, element) {
                    var templateRow = `<option value="${element.idEspecialidad}">${element.nombre}</option>`;
                    $('#select_especialidad').append(templateRow);
                });
            }
        });
    },

    listar: function() {
        console.log("***listar");
        
        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/medicoHorarios",
            data: {  }, 
            dataType: 'json',
            success: function (data) { 

                $('#dataTables-especialidad tbody').empty();

                $.each(data, function(index, element) {

                    var fecha = moment(element.fecha).format('DD/MM/yyyy');

                    var templateRow = `<tr>
                                        <td>${element.idMedicoHorario}</td>
                                        <td>${element.medico.apellidoPaterno} ${element.medico.apellidoMaterno}, ${element.medico.nombre}</td>
                                        <td>${element.medico.especialidad.nombre}</td>
                                        <td>${fecha}<br /> ${element.horaInicio} - ${element.horaFin}</td>
                                        <td>${element.cantidadAtenciones}</td>
                                        <td width="10%" align="center">
                                            <button class="btn btn-info bnt_editar" data-id="${element.idMedicoHorario}"><i class="fa fa-edit "></i> Editar</button>&nbsp;&nbsp;
                                            <!--<button class="btn btn-danger" bnt_eliminar data-id="${element.idMedicoHorario}"><i class="fa fa-pencil"></i> Eliminar</button>-->
                                        </td>
                                    </tr>`;

                    $('#dataTables-especialidad tbody').append(templateRow);
                });

                $('#dataTables-especialidad').dataTable();

                AppMedico.eventosMantenimiento();
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
        AppMedico.limpiarForm();

        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/medicos/"+id,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) { 

                if(null != data){
                    $('#txt_apellido_paterno').val(data.apellidoPaterno);
                    $('#txt_apellido_materno').val(data.apellidoMaterno);
                    $('#txt_nombre').val(data.nombre);
                    $('#txt_numero_documento').val(data.numeroDocumento);
                    $('#select_especialidad').val(data.especialidad.idEspecialidad);
                    
                    $('#idMedico').val(data.idMedico);
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
        $('#idMedico').val('');
        $('#txt_apellido_paterno').val('');
        $('#txt_apellido_materno').val('');
        $('#txt_nombre').val('');
        $('#txt_numero_documento').val('');
        $('#select_especialidad').val('');
    },
    registrar: function() {
        var jsonData = {
            apellidoPaterno: $('#txt_apellido_paterno').val(),
            apellidoMaterno: $('#txt_apellido_materno').val(),
            nombre: $('#txt_nombre').val(),
            tipoDocumento: '01',
            numeroDocumento: $('#txt_numero_documento').val(),
            especialidad: {
                idEspecialidad: $('#select_especialidad').val()
            }
        }

        var idMedico = $('#idMedico').val();
        if(null != idMedico && idMedico != ""){
            jsonData.idMedico = idMedico;
        }
        

        $.ajax({ 
            type: 'POST', 
            url: URL_BACKEND+"/medicos",
            data: JSON.stringify(jsonData), 
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) { 
                console.log(data);

                if(data.status == "OK"){
                    $('#txt_nombre').val('');
                    AppMedico.listar();
                    $('#myModal').modal('toggle');
                    AppMedico.alert('Datos registrados correctamente.');
                }else{
                    AppMedico.alert('Ocurrió un error, intente nuevamente.');
                }

            },
            error: function( jqXhr, textStatus, errorThrown ){
                AppMedico.alert('Ocurrió un error, intente nuevamente.');
                console.log("Error")
            }
        });
    },
    alert: function(mensaje){
        $('#lblMensaje').text(mensaje);
        $('#myModalMensaje').modal('toggle');
    }
};

AppMedico.init();