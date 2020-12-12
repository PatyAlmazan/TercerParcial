var REST_URL = "http://www.proyectos.arcelia.net/mamc/src/public/";
/*
    user: anapat
    pass: AnaPat123456
*/
var COOKIE_NAME = 'tk';
var HOME_URL = 'index.html';
var LIST_URL = 'ListarAlumnos.html';

var nRow = 1;
var celdas = ["matricula", "nombre", "curp", "email", "sexo", "ciudad", "detalle"];
var celdasCalif = ["nombre", "clave", "calificacion", "detalle"];

let campos = [
    { campo: 'clave_alu', tipo: 'text' },
    { campo: 'clave_admin', tipo: 'text' },
    { campo: 'ap_paterno', tipo: 'text' },
    { campo: 'ap_materno', tipo: 'text' },
    { campo: 'nombre', tipo: 'text' },
    { campo: 'sexo', tipo: 'text' },
    { campo: 'curp', tipo: 'text' },
    { campo: 'peso', tipo: 'number' },
    { campo: 'estatura', tipo: 'number' },
    { campo: 'direccion', tipo: 'text' },
    { campo: 'colonia', tipo: 'text' },
    { campo: 'cp', tipo: 'text' },
    { campo: 'ciudad', tipo: 'text' },
    { campo: 'id_estado', tipo: 'text' },
    { campo: 'delegacion', tipo: 'text' },
    { campo: 'telefono', tipo: 'text' },
    { campo: 'celular', tipo: 'text' },
    { campo: 'email', tipo: 'text' },
    { campo: 'status_alu', tipo: 'text' }
];

function setCookie(cname, cvalue, exday) {
    var f = new Date();
    f.setTime(f.getTime() + (exday * 24 * 60 * 60 * 1000));
    var expire = "expires=" + f.toGMTString();
    var vc = cname + "=" + cvalue + ";" + expire + ";path=/";
    document.cookie = vc;
}

function getCookie(cname) {
    var n = cname + "=";
    var dc = decodeURIComponent(document.cookie);
    var ca = dc.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(n) == 0) {
            return c.substring(n.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    var ck = getCookie(cname);
    if (isEmpty(ck)) {
        return false;
    } else {
        return true;
    }
}

function removeCookie(cname) {
    setCookie(cname, "", -1);
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}


function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Variable %s no localizada', variable);
}

function logout() {
    removeCookie(COOKIE_NAME);
    window.location.assign(HOME_URL);
}

function login(us, pass, usmethod) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("usuario", us);
    urlencoded.append("passwd", pass);

    var requestOptions = {
        method: usmethod,
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch(REST_URL + "login", requestOptions)
        .then(response => response.json())
        .then(
            data => {
                if (!isEmpty(data.token)) {
                    setCookie(COOKIE_NAME, data.token, 1);
                    window.location.assign(LIST_URL);
                } else {
                    alert("Error de Login");
                }
            }
        )
        .catch(error => console.log('error', error));
}

function registro() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var e = document.getElementById('estado');
    var id_estado = e.options[e.selectedIndex].value;

    var d = document.getElementById('dependencia');
    var id_dependencia = d.options[d.selectedIndex].value;

    var urlencoded = new URLSearchParams();
    urlencoded.append("usuario", document.getElementById('usuario').value);
    urlencoded.append("password", document.getElementById('password').value);
    urlencoded.append("nombres", document.getElementById('nombres').value);
    urlencoded.append("ap_paterno", document.getElementById('ap_paterno').value);
    urlencoded.append("ap_materno", document.getElementById('ap_materno').value);
    urlencoded.append("email", document.getElementById('email').value);
    urlencoded.append("estado", id_estado);
    urlencoded.append("dependencia", id_dependencia);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch(REST_URL + "registro", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function listarAlumnos(idT) {
    if (checkCookie(COOKIE_NAME)) {
        nRow = 1;
        var tabla = document.getElementById(idT);

        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        var endPoint = REST_URL + "alumnos";
        if (document.getElementById("alumnos").value != "") {
            endPoint = REST_URL + "alumnos/" + document.getElementById("alumnos").value;
            document.getElementById("alumnos").value = "";
        }
        var cok = getCookie(COOKIE_NAME);
        console.log(cok);
        endPoint = endPoint + "?token=" + cok;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(endPoint, requestOptions)
            .then(response => response.json())
            .then(
                data => {
                    data.data.forEach(alumno => {
                        var renglon = tabla.insertRow(nRow);
                        for (i = 0; i < celdas.length; i++) {
                            var celda = renglon.insertCell(i);
                            if (celdas[i] == "matricula") {
                                var textoCelda = document.createTextNode(alumno.clave_alu);
                            } else {
                                switch (celdas[i]) {
                                    case "nombre":
                                        var textoCelda = document.createTextNode(alumno.nombre + " " + alumno.ap_paterno + " " + alumno.ap_materno);
                                        break;
                                    case "curp":
                                        var textoCelda = document.createTextNode(alumno.curp);
                                        break;
                                    case "email":
                                        var textoCelda = document.createTextNode(alumno.email);
                                        break;
                                    case "sexo":
                                        var textoCelda = document.createTextNode(alumno.sexo);
                                        break;
                                    case "ciudad":
                                        var textoCelda = document.createTextNode(alumno.ciudad);
                                        break;
                                    case "detalle":
                                        var textoCelda = document.createElement('div');
                                        textoCelda.classList.add('bd-example');

                                        var btnVer = document.createElement('a');
                                        btnVer.classList.add('btn', 'btn-primary', 'btn-sm');
                                        btnVer.textContent = 'Detalle';
                                        btnVer.href = "AlumnoDetalle.html" + "?acc=ver&matricula=" + alumno.clave_alu;

                                        var btnEdit = document.createElement('a');
                                        btnEdit.classList.add('btn', 'btn-success', 'btn-sm');
                                        btnEdit.textContent = 'Modificar';
                                        btnEdit.href = "AlumnoDetalle.html" + "?acc=edit&matricula=" + alumno.clave_alu;

                                        var btnCalif = document.createElement('a');
                                        btnCalif.classList.add('btn', 'btn-warning', 'btn-sm');
                                        btnCalif.textContent = 'Evaluaciones';
                                        btnCalif.href = "listadoCalificaciones.php" + "?matricula=" + alumno.clave_alu;

                                        textoCelda.appendChild(btnVer);
                                        textoCelda.appendChild(btnEdit);
                                        textoCelda.appendChild(btnCalif);

                                        break;
                                }
                            }

                            celda.appendChild(textoCelda);
                        }
                        nRow++;
                    });
                }
            )
            .catch(error => console.log('error', error))
    } else {
        window.location.assign(HOME_URL);
    }
}

function crearFormularioAlumno(contenedor) {
    if (checkCookie(COOKIE_NAME)) {
        var acc = getQueryVariable('acc');

        var form = document.createElement("form");
        form.setAttribute("method", "post");

        for (let c of campos) {
            var C = document.createElement("input");
            C.setAttribute("type", c.tipo);
            C.setAttribute("name", c.campo);
            C.setAttribute("id", c.campo);
            C.setAttribute("placeholder", c.campo);
            C.classList.add('form-control');
            form.appendChild(C);
        }

        var s = document.createElement("input");
        s.setAttribute("id", "btnR");
        s.setAttribute("value", "Regresar");
        s.addEventListener("click", (function(sId) {
            return function() {
                window.location.assign(LIST_URL);
            }
        })("btnR"), false);
        s.classList.add('btn', 'btn-primary', 'btn-lg', 'btn-block');
        form.appendChild(s);

        if (acc == "edit" || acc == "insert") {
            var s = document.createElement("input");
            s.setAttribute("id", "btnG");
            s.setAttribute("value", "Guardar");

            switch (acc) {
                case "edit":
                    var m = 'PUT';
                    break;
                case "insert":
                    var m = 'POST';
                    break;
                default:
                    break;
            }

            s.addEventListener("click", (function(sId) {
                return function() {
                    setDatosAlumnos(m);
                }
            })("btnG"), false);
            s.classList.add('btn', 'btn-success', 'btn-lg', 'btn-block');
            form.appendChild(s);
        }

        document.getElementById(contenedor).appendChild(form);

    } else {
        window.location.assign(HOME_URL);
    }
}

function getDatosAlumnos() {
    if (checkCookie(COOKIE_NAME)) {
        var matricula = getQueryVariable("matricula");
        var acc = getQueryVariable("acc");

        var cok = getCookie(COOKIE_NAME);
        var endPoint = REST_URL + "alumnos/" + matricula + "?token=" + cok;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        }

        fetch(endPoint, requestOptions)
            .then(response => response.json())
            .then(
                data => {
                    data.data.forEach(
                        alumno => {
                            for (let c of campos) {
                                document.getElementById(c.campo).value = alumno[c.campo];
                                if (acc == "ver") {
                                    document.getElementById(c.campo).disabled = true;
                                }
                            }
                            if (acc == "edit") {
                                document.getElementById('clave_alu').disabled = true;
                            }
                        }
                    )
                }
            )
            .catch(error => console.log('error', error))
    } else {
        window.location.assign(HOME_URL);
    }
}

function setDatosAlumnos(usmethod) {
    if (checkCookie(COOKIE_NAME)) {
        var cok = getCookie(COOKIE_NAME);
        var endPoint = REST_URL + "alumnos";
        if (usmethod == "PUT") {
            var matricula = document.getElementById('clave_alu').value;
            endPoint = endPoint + "/" + matricula;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("token", cok);

        for (let c of campos) {
            urlencoded.append(c.campo, document.getElementById(c.campo).value);
        }

        var requestOptions = {
            method: usmethod,
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        }

        fetch(endPoint, requestOptions)
            .then(response => response.json())
            .then(
                result => {
                    if (result.success) {
                        alert(result.detail);
                        if (usmethod == "POST") {
                            window.location.assign(LIST_URL);
                        }
                    }
                }
            )
            .catch(error => console.log('error', error))
    } else {
        window.location.assign(HOME_URL);
    }
}

function setDatosEvaluacion() {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    var usmethod = "POST";

    if(document.getElementById('calificacion').value=="")
        alert("Ingrese la calificacion!!!")

    else{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        if (checkCookie(COOKIE_NAME)) {
            var cok = getCookie(COOKIE_NAME);
            var endPoint = REST_URL + "evaluar";
            var matricula = urlParams.get('matricula');

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("token", cok);
            urlencoded.append("idMat", document.getElementById('Clave_mat').value);
            urlencoded.append("calificacion", document.getElementById('calificacion').value);
            urlencoded.append("matricula", matricula);

            var formularioCalificaciones=document.getElementById('formularioCalificaciones');
            var listadoCalificaciones=document.getElementById('listadoCalificaciones');

            formularioCalificaciones.style.display="none";
            listadoCalificaciones.style.display="block";

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            }

            fetch(endPoint, requestOptions)
                .then(response => response.text())
                .then(result => localStorage.clear())
                .catch(error => console.log('error', error));

        } else {
            window.location.assign(HOME_URL);
        }
    }


}
//funcion para actualizar calificacion
function actualizaEvaluacion(id, materia) {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    var usmethod = "PUT";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    if (checkCookie(COOKIE_NAME)) {
        var cok = getCookie(COOKIE_NAME);
        var endPoint = REST_URL + "evaluar";
        var matricula = urlParams.get('matricula');

        console.log(endPoint);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("token", cok);
        urlencoded.append("idMat", materia);
        urlencoded.append("calificacion", document.getElementById('calificacion').value);
        urlencoded.append("matricula", matricula);
        urlencoded.append("id", id);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        }

        fetch(endPoint, requestOptions)
            .then(response => response.text())
            .then(result => alert("calificacion actualizada"))
            .catch(error => console.log('error', error));

    } else {
        window.location.assign(HOME_URL);
    }
}

function listarCalificaciones(idT) {
    if (checkCookie(COOKIE_NAME)) {
        var matricula = getQueryVariable("matricula");
        nRow = 1;
        var tabla = document.getElementById(idT);

        var ck = getCookie("tk");

        //alert(ck);

        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        var endPoint = REST_URL + "evaluaciones/" + matricula;

        var cok = getCookie(COOKIE_NAME);
        endPoint = endPoint + "?token=" + cok;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(endPoint, requestOptions)
            .then(response => response.json())
            .then(
                data => {
                    data.data.forEach(calificacion => {
                        var renglon = tabla.insertRow(nRow);
                        for (i = 0; i < celdasCalif.length; i++) {
                            var celda = renglon.insertCell(i);
                            if (celdasCalif[i] == "nombre") {
                                var textoCelda = document.createTextNode(calificacion.nombre);
                            } else {
                                switch (celdasCalif[i]) {
                                    case "clave":
                                        var textoCelda = document.createTextNode(calificacion.clave_mat);
                                        break;
                                    case "calificacion":
                                        var textoCelda = document.createTextNode(calificacion.calificacion);
                                        break;
                                    case "detalle":
                                        var textoCelda = document.createElement('div');
                                        textoCelda.classList.add('bd-example');

                                        var btnEdit = document.createElement('a');
                                        btnEdit.classList.add('btn', 'btn-warning', 'btn-sm');
                                        btnEdit.textContent = 'EDITAR';
                                        btnEdit.onclick = function() {
                                            actualizaEvaluacion(calificacion.id, calificacion.clave_mat);
                                        };

                                        var btnDel = document.createElement('a');
                                        btnDel.classList.add('btn', 'btn-danger', 'btn-sm');
                                        btnDel.textContent = 'BORRAR';
                                        btnDel.onclick = function() {
                                            borrarEvaluacion(calificacion.id);
                                        };

                                        textoCelda.appendChild(btnEdit);
                                        textoCelda.appendChild(btnDel);

                                        break;
                                }
                            }

                            celda.appendChild(textoCelda);
                        }
                        nRow++;
                    });
                }
            )
            .catch(error => console.log('error', error))
    } else {
        window.location.assign(HOME_URL);
    }
}

function borrarEvaluacion(idC) {
    if (checkCookie(COOKIE_NAME)) {
        var endPoint = REST_URL + "calificacion/" + idC;

        var cok = getCookie(COOKIE_NAME);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("token", cok);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(endPoint, requestOptions)
            .then(response => response.text())
            .then(result => window.location = window.location.href)
            .catch(error => console.log('error', error));


    } else {
        window.location.assign(HOME_URL);
    }
}
function zeit()
{
    if(document.cookie)
    {
        a = document.cookie;
        cookiewert = "";
        while(a.length > 0)
        {
            cookiename = a.substring(0,a.indexOf('='));
            if(cookiename == "zeitstempel")
            {
                cookiewert = a.substring(a.indexOf('=')+1,a.indexOf(';'));
                break;
            }
            a = a.substring(a.indexOf(cookiewert)+cookiewert.length+1,a.length);
        }
        if(cookiewert.length > 0)
        {
            alter = new Date().getTime() - cookiewert;

            if(alter > 3600000)
            {   
                document.cookie = "zeitstempel=" + new Date().getTime() + ";";
                location.reload(true);
            }
            else
            {
                return;
            }
        }
        else
        {
            document.cookie = "zeitstempel=" + new Date().getTime() + ";";
            location.reload(true);
        }
    }
    else
    {
        document.cookie = "zeitstempel=" + new Date().getTime() + ";";
        location.reload(true);
    }
}