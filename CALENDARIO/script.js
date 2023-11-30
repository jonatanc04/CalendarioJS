let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let loginBtn = document.getElementById("login");
let registerBtn = document.getElementById("regis");
let alerta = document.getElementById("mensaje");
let titulo = document.getElementById("titulo");
let cerrarSesion = document.getElementById("cerrarSesion");
let anyadirTarea = document.getElementById("anyade");

let formSesion = document.getElementById("conSesion");
let calendar = document.getElementById("conCalendar");

let tareasVer = document.getElementById("tareas");

let userList = JSON.parse(localStorage.getItem("listaUsuarios"));
let tareasList = JSON.parse(localStorage.getItem("listaTareas"));

let usuario;
let intervalo;

let codigoStorage;
let usuarioStorage;

let fechaActual = new Date();
let diaActual = fechaActual.getDay();
let mesActual = fechaActual.getMonth();
let anyoActual = fechaActual.getFullYear();

let dias = document.getElementById("dias");
let mes = document.getElementById("mes");
let anyo = document.getElementById("anyo");

let atras = document.getElementById("atras");
let alante = document.getElementById("alante");

/*

Esta parte del código se encarga de ir cambiando la fecha que aparece arriba de las tareas y 
de generar el código del día en el que estamos situados

*/

mes.innerHTML = meses[mesActual];
anyo.innerHTML = anyoActual.toString();

escribeMes(mesActual);

let fechaTarea = document.getElementById("currentDay");
fechaTarea.innerHTML = fechaActual.getDate() + " de " + meses[mesActual] + " de " + anyoActual;
codigoStorage = generarCodigo(fechaActual.getDate(), mesActual, anyoActual);

/*
Esta función sirve para crear una tarea con su usuario, código y nombre de la tarea a introducir
*/

const crearTarea = (user, codigo, nombre) => ({
    user: user,
    codigo: codigo,
    nombre: nombre,
});

/*
Esta función sirve introducir una tarea dentro del localstorage
*/

function generarTarea(user, codigo, nombre) {

    tareasList.push(crearTarea(user, codigo, nombre));
    localStorage.setItem("listaTareas", JSON.stringify(tareasList));
}

/*
Estas funciones sirven para filtrar nuestra lista de tareas por código y el resultado de la misma
por usuarios
*/

const filterByCodigo = codigo => tareasList.filter(
    (Tarea) => Tarea.codigo == codigo
);

const filterByUser = (user, lista) => lista.filter(
    (Tarea) => Tarea.user == user
);

/*
Esta función se encarga de dibujar los meses que nos va a ir mostrando por pantalla, también
dibuja los días del mes anterior y los del siguiente suficientes para ocupar el espacio
*/

function escribeMes(mes) {
    dias.innerHTML = "";

    let primerDia = empieza();
    let ultimoDia = totalDias(mes);
    
    for (let i = primerDia - 1; i >= 0; i--) {
        crearDiaElemento(totalDias(mesActual - 1) - i, 'last');
    }

    for (let i = 1; i <= ultimoDia; i++) {
        let clase = (i === fechaActual.getDate() && mes === mesActual) ? 'day today' : 'day';
        crearDiaElemento(i, clase);
    }

    for (let i = 1; i <= 42 - ultimoDia - primerDia; i++) {
        crearDiaElemento(i, 'last');
    }
}

/*
Esta función se encarga de gestionar los clicks que hacemos en los días para cambiar su clase
*/

dias.addEventListener('click', function(event) {
    let target = event.target;
    
    if (target.tagName === 'P') {
        target = target.parentElement;
    }

    if (target.classList.contains('day') && !target.classList.contains('last')) {
        mostrarInfo(target.textContent);
        resaltarDia(target);
    }
});

/*
Esta función es la encargada de ir creando el html necesario para mostrar los días por pantalla
*/

function crearDiaElemento(numero, clase) {
    let diaElemento = document.createElement('div');
    diaElemento.className = clase + ' day';

    let numeroParrafo = document.createElement('p');
    numeroParrafo.className = 'num';
    numeroParrafo.textContent = numero;

    diaElemento.appendChild(numeroParrafo);
    dias.appendChild(diaElemento);
}

/*
Esta función es la que aplica un resalte a los días que tenemos seleccionados
*/

function resaltarDia(elemento) {
    let elementoAnterior = document.querySelector('.today');
    
    if (elementoAnterior) {
        elementoAnterior.classList.remove('today');
    }

    elemento.classList.add('today');
}

/*
Esta función se encarga de, cada vez que cambiamos de día, generar su código y de paso mostrarnos
las tareas de ese día.
*/

function mostrarInfo(dia) {
    fechaTarea.innerHTML = dia + " de " + meses[mesActual] + " de " + anyoActual;
    codigoStorage = generarCodigo(dia, mesActual, anyoActual);
    fill();
}

/*
Esta función genera los códigos de los días
*/

function generarCodigo(dia, mes, anyo) {
    return dia + "" + mes + "" + anyo;
}

/*
Estas funciones de aquí se engargan de generar el calendario en su totalidad
*/

function totalDias(mes) {
    if (mes === -1) {
        mes = 11;
    }

    if (mes == 0 || mes == 2 || mes == 4 || mes == 6 || mes == 7 || mes == 9 || mes == 11) {
        return 31
    } else if (mes == 3 || mes == 5 || mes == 8 || mes == 10) {
        return 30;
    } else {
        return bisiesto() ? 29:28;
    }
}

function bisiesto() {
    if((anyoActual % 100 !== 0) && (anyoActual % 4 === 0) || (anyoActual % 400 === 0)) {
        return true;
    } else {
        return false;
    }
}

function empieza() {
    let emp = new Date(anyoActual, mesActual, 0);
    return emp.getDay();
}

function ultimoMes() {
    if(mesActual !== 0) {
        mesActual--;
    } else {
        mesActual = 11;
        anyoActual--;
    }
    nuevaFecha();
}

function siguenteMes() {
    if(mesActual !== 11) {
        mesActual++;
    } else {
        mesActual = 0;
        anyoActual++;
    }
    nuevaFecha();
}

function nuevaFecha() {
    fechaActual.setFullYear(anyoActual, mesActual, fechaActual.getDate());
    mes.innerHTML = meses[mesActual];
    anyo.innerHTML = anyoActual.toString();
    dias.innerHTML = "";
    escribeMes(mesActual);
}

/*
Esta función elimina la tarea seleccionada
*/

function borrarTarea() {
    let tarea = this.closest(".tarea");
    let tituloTarea = tarea.querySelector("#title").innerText;

    tareasList = tareasList.filter(tarea =>
        tarea.nombre !== tituloTarea || tarea.codigo !== codigoStorage
    );

    localStorage.setItem("listaTareas", JSON.stringify(tareasList));
    tarea.remove();
    fill();
}

/*
Esta función realiza una modificación a la tarea seleccionada
*/

function modificarTarea() {

    let tareaElemento = this.parentElement;
    let p = tareaElemento.querySelector('p');
    let nombreTarea = p.innerHTML;

    let input = document.createElement('input');
    input.classList.add("modificando");
    input.value = nombreTarea;

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            let tarea = tareasList.find(t => 
                t.nombre === nombreTarea && 
                t.codigo === codigoStorage && 
                t.user === usuarioStorage
            );

            if (tarea) {
                tarea.nombre = input.value;
                localStorage.setItem("listaTareas", JSON.stringify(tareasList));
            }
            p.innerHTML = input.value;
            input.replaceWith(p);
        }
    });

    p.replaceWith(input);
    input.focus();
}

/*
Esta función se encarga de llenar el apartado de tareas cada vez que realizamos una actualización de
la misma.
*/

function fill() {

    let tareas = document.getElementById("contTareas");
    tareas.innerHTML = "";
    if (!tareasList) {
        tareasList = [];
    }

    let lista = filterByCodigo(codigoStorage);
    let listaDef = filterByUser(usuarioStorage, lista);

    if (lista != '') {
        listaDef.forEach(element=> {

            let tarea = document.createElement("div");
            tarea.setAttribute("id", "tarea");
            tarea.classList.add("tarea");
            tareas.appendChild(tarea);

            let p = document.createElement("p");
            p.setAttribute("id", "title");
            p.innerHTML = element.nombre;
            tarea.appendChild(p);

            let imgMod = document.createElement("img");
            imgMod.setAttribute("id", "mod");
            imgMod.classList.add("icoTarea");
            imgMod.addEventListener('click', modificarTarea);
            imgMod.src = "img/edit.png";
            tarea.appendChild(imgMod);

            let imgBorr = document.createElement("img");
            imgBorr.setAttribute("id", "borr");
            imgBorr.classList.add("icoTarea");
            imgBorr.addEventListener('click', borrarTarea);
            imgBorr.src = "img/trash.png";
            tarea.appendChild(imgBorr);

        });
    } else {
        let mensaje = document.createElement("p");
        mensaje.classList.add("mens");
        mensaje.innerHTML = "No hay tareas...";
        tareas.appendChild(mensaje);
    }
}

/*
Estos dos addeventlisteners se encargas de ir hacia atrás o hacia delante en el calendario
*/

atras.addEventListener("click", ()=>ultimoMes());
alante.addEventListener("click", ()=>siguenteMes());

/*
Esta función se encarga de hacer que el formulario de inicio de sesión pase a ser invisible
y veamos el calendario
*/

const verCalendario = () => {
    calendar.classList.remove("invisible");
    formSesion.classList.add("invisible");
};

/*
Esta función sirve para crear usuarios
*/

const crearUsuario = (usuario, password) => ({
    usuario: usuario,
    password: password
});

/*
Estas funciones sirven para mandar las alertas de errores a la hora de mandar tareas o de
iniciar sesión
*/

const terminarAlerta = () => {
    alerta.innerHTML = "";
    clearInterval(intervalo);
}

const terminarAlerta2 = () => {
    let alerta2 = document.getElementById("errorIntro");
    alerta2.innerHTML = "";
    clearInterval(intervalo);
}

const incioAlerta = mensaje => {
    clearInterval(intervalo);
    alerta.innerHTML = mensaje;
    intervalo = setInterval(() => terminarAlerta(), 4000);
};

const incioAlerta2 = mensaje => {
    clearInterval(intervalo);
    let alerta2 = document.getElementById("errorIntro");
    alerta2.innerHTML = mensaje;
    intervalo = setInterval(() => terminarAlerta2(), 4000);
};

/*
Este addeventlistener sirve para realizar inicio de sesión
*/

loginBtn.addEventListener("click", () => {

    usuarioStorage = document.getElementById("user").value;
    let pwd = document.getElementById("pass").value;

    if (usuarioStorage == "" || pwd == "") {
        incioAlerta("No puedes dejar campos vacíos");
    } else {
        if (!userList) {
            incioAlerta("No existen usuarios registrados");
        } else {
            usuario = userList.filter(
                (Usuario) => Usuario.usuario == usuarioStorage
            );
    
            if(usuario[0] == undefined) {
                incioAlerta("No existen usuarios con ese nombre");
            } else {
                if (usuario[0].password == pwd) {
                    verCalendario();
                    titulo.innerHTML = "Calendario de " + usuario[0].usuario;
                    fill();
                } else {
                    incioAlerta("La contraseña introducida no es correcta");
                }
            }
        }
    }

});

/*
Este addeventlistener sirve para realizar un registro
*/

registerBtn.addEventListener("click", () => {

    if (!userList) {
        userList = [];
    }

    usuarioStorage = document.getElementById("user").value;
    let pwd = document.getElementById("pass").value;

    if (usuarioStorage == "" || pwd == "") {
        incioAlerta("No puedes dejar campos vacíos");
    } else {
        let existeUsuario = userList.some(o => o.usuario === usuarioStorage);
        if (existeUsuario) {
            incioAlerta("Nombre de usuario no disponible");
        } else {
            userList.push(crearUsuario(usuarioStorage, pwd));
            localStorage.setItem("listaUsuarios", JSON.stringify(userList));
            verCalendario();
            titulo.innerHTML = "Calendario de " + usuarioStorage;
            fill();
        }
    }

});

/*
Este addeventlistener sirve para anyadir una tarea
*/

anyadirTarea.addEventListener("click", () => {

    if (!tareasList) {
        tareasList = [];
    }

    let lista = filterByCodigo(codigoStorage);
    let listaDef = filterByUser(usuarioStorage, lista);

    let nomTarea = document.getElementById("nomTarea").value;
    let existeTarea = listaDef.some(o => o.nombre === nomTarea);
    if (nomTarea == "") {
        incioAlerta2("Las tareas han de tener un título");
    } else if (existeTarea) {
        incioAlerta2("Esta tarea ya existe hoy...");
    } else {
        generarTarea(usuarioStorage, codigoStorage, nomTarea);
        fill();
    }

});

/*
Este addeventlistener sirve para cerrar sesión
*/

cerrarSesion.addEventListener("click", () => {
    formSesion.classList.remove("invisible");
    calendar.classList.add("invisible");
});