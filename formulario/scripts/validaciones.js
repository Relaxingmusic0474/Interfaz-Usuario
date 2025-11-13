/* ------------------------------------------- FUNCIONES DE BLOQUEO ------------------------------------------- */
function bloquearYSalir(mensaje)  // Funciona como castigo para el usuario que miente en el RUT o la edad
{
    alert(mensaje);

    localStorage.setItem("bloqueadoINE", "true");

    // Elimina el contenido de la página
    document.body.innerHTML = 
    `
        <h1>Acceso denegado</h1>
        <p>Se detectó inconsistencia en los datos colocados.  El formulario le ha sido bloqueado.</p>
        <p>Si cree que se trata de un error, contáctese al teléfono <strong><i>+56 9 7547 6159</i></strong> o al correo <strong><i>andywalls.s17@gmail.com.</i></strong></p>
    `;

    // Evita interacción
    document.body.style.pointerEvents = "none";

    // Impide volver atrás
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", function () {
        history.pushState(null, "", location.href);
    });

    // Impede recargar la página original del formulario 
    history.replaceState(null, "", "acceso_denegado.html");

    return false;
}

// Si el usuario estaba bloqueado, se reemplaza toda la página por la pantalla de bloqueo
window.onload = function() 
{
    localStorage.setItem("bloqueadoINE", "false");   // IMPORTANTE: PARA USARLO EN LA VIDA REAL Y EVITAR CONTRATAR GENTE QUE MIENTE, COMENTAR ESTO

    if (localStorage.getItem("bloqueadoINE") === "true") 
    {
        document.body.innerHTML = `
            <h1>Acceso denegado</h1>
            <p>Se detectó inconsistencia en los datos colocados. El formulario le ha sido bloqueado.</p>
            <p>Si cree que se trata de un error, contáctese al teléfono 
            <b><i>+56 9 7547 6159</i></b> o al correo <b><i>andywalls.s17@gmail.com</i></b>.</p>
        `;
    }
}

/* ---------------------------------------- FUNCIONES PARA VALIDAR RUT ---------------------------------------- */
function normalizarRut(rut)
{
    // Convierte el RUT a una cadena de texto
    rut = String(rut);

    // Elimina puntos y guiones, y convierte a mayúsculas (k != K)
    rut = rut.replace(/\./g, "");
    rut = rut.toUpperCase();

    // Quita posibles espacios en blanco al inicio y al final
    rut = rut.trim();

    return rut;
}

function validarRutChileno(rut)
{
    rut = normalizarRut(rut);

    // Verifica el formato básico
    if (!/^\d{1,8}-[\dK]$/.test(rut)) 
    {
        return false;
    }

    // Separa el cuerpo y el dígito verificador
    const numero = rut.slice(0, -2);
    const dv_teorico = rut.slice(-1);

    // Calcula el dígito verificador
    let multiplicadores = [2, 3, 4, 5, 6, 7];
    let suma = 0;

    for (let i=numero.length - 1, j = 0; i >= 0; i--, j++) {
        suma += parseInt(numero.charAt(i)) * multiplicadores[j % multiplicadores.length];
    }

    let dv_experimental = 11 - (suma % 11);

    if (dv_experimental === 11) 
    {
        dv_experimental = '0';
    }

    else if (dv_experimental === 10) 
    {
        dv_experimental = 'K';
    }

    else 
    {
        dv_experimental = dv_experimental.toString();
    }

    // Valida el dígito verificador
    return dv_experimental === dv_teorico;
}

function validarRutIngresado()
{
    const rut = document.getElementById("rut").value;
    const resultado = validarRutChileno(rut);
    
    if (!resultado) 
    {
        return false; // Evita el envío del formulario
    }

    return true; // Permite el envío del formulario
}

function validarRUToSegfault() 
{
    if (!validarRutIngresado()) 
    {
        return bloquearYSalir('RUT inválido. Se le bloqueará el acceso al formulario por mentiroso.');
    }

    return true;
}


/* ------------------------ FUNCIONES PARA VALIDAR CONSISTENCIA ENTRE FECHA DE NACIMIENTO Y EDAD ------------------------- */
function calcularEdad(fechaNacimiento) 
{
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();  // Calcula la diferencia de años
    const mes = hoy.getMonth() - nacimiento.getMonth();  // Calcula la diferencia de meses

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate()))  // Considera caso especial de cumpleaños no cumplido
    {
        edad--;
    }
    
    return edad;
}

function validarConsistenciaEdadFecha()
{
    const fechaNacimiento = document.getElementById("fecha_nacimiento").value;
    const edadIngresada = parseInt(document.getElementById("edad").value, 10);
    const edadCalculada = calcularEdad(fechaNacimiento);

    if (!isFinite(edadCalculada) || edadCalculada !== edadIngresada)
    {
        return bloquearYSalir(`Según la fecha de nacimiento que ingresó, su edad es ${edadCalculada} años.  Se le bloqueará el acceso al formulario por mentiroso.`);
    }

    return true; // Permite el envío del formulario
}

function validacionCheckboxGrupo(name, mensaje) 
{
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    const algunoMarcado = [...checkboxes].some(ch => ch.checked);

    if (!algunoMarcado) 
    {
        alert(mensaje);
        return false;
    }

    return true;
}


/* ---------------------------------------- FUNCIONES PARA VALIDAR TODO ---------------------------------------- */
function validarTodoSeccion1()
{
    // Valida campos HTML5 de la sección 1
    const seccion1 = document.getElementById("seccion1");
    const campos = seccion1.querySelectorAll("input, select, textarea");

    for (const campo of campos) 
    {
        if (!campo.checkValidity()) 
        {
            campo.reportValidity();   // Muestra el mensaje del navegador
            return false;
        }
    }

    if (!validarRUToSegfault())
    {
        return false;
    }

    if (!validarConsistenciaEdadFecha())
    {
        return false;
    }

    return true;
}

function validarTodoSeccion2()
{
    // 1) Valida campos HTML5 de la sección 2
    const seccion2 = document.getElementById("seccion2");
    const campos = seccion2.querySelectorAll("input, select, textarea");

    for (const campo of campos) 
    {
        if (!campo.checkValidity()) 
        {
            campo.reportValidity();   // Muestra el mensaje del navegador
            return false;
        }
    }

    if (!validacionCheckboxGrupo("horario", "Debe seleccionar al menos un horario"))
    {
        return false;
    }

    return true;
}