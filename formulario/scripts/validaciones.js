/* ------------------------------------------- FUNCIONES DE BLOQUEO ------------------------------------------- */
function bloquearYSalir(mensaje)  // Funciona como castigo para el usuario que miente en el RUT o la edad
{
    alert(mensaje);
    
    // 1) Intento “legal” de cierre
    try 
    {
        window.open('', '_self');  // Ayuda en algunos navegadores
        window.close();  // Intenta cerrar la ventana actual para evitar que el usuario rellene el formulario
    } 
    catch (e) 
    {}

    setTimeout(() => {
    document.body.innerHTML =
      '<h1>Acceso denegado</h1>' +
      '<p>Se detectó inconsistencia en los datos declarados. ' +
      'El formulario ha sido bloqueado.</p>';
    
    // Deshabilitar cualquier interacción residual
    [...document.querySelectorAll('input,select,textarea,button,a')].forEach(el => {
      el.disabled = true;
      el.onclick = e => e.preventDefault();
    });
    }, 50);

    return false;
}

/* ---------------------------------------- FUNCIONES PARA VALIDAR RUT ---------------------------------------- */
function normalizarRut(rut)
{
    // Convierte el RUT a una cadena de texto
    rut = String(rut);

    // Eliminar puntos y guiones, y convertir a mayúsculas (k != K)
    rut = rut.replace(/\./g, "");
    rut = rut.toUpperCase();

    // Quita posibles espacios en blanco al inicio y al final
    rut = rut.trim();

    return rut;
}

function validarRutChileno(rut)
{
    rut = normalizarRut(rut);

    // Verificar formato básico
    if (!/^\d{1,8}-[\dK]$/.test(rut)) 
    {
        return false;
    }

    // Separar el cuerpo y el dígito verificador
    const numero = rut.slice(0, -2);
    const dv_teorico = rut.slice(-1);

    // Calcular el dígito verificador
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

    // Validar el dígito verificador
    return dv_experimental === dv_teorico;
}

function validarRutIngresado()
{
    const rut = document.getElementById("rut").value;
    const resultado = validarRutChileno(rut);
    
    if (!resultado) 
    {
        // alert("El RUT es inválido.");
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

/* ---------------------------------------- FUNCIONES PARA VALIDAR TODO ---------------------------------------- */
function validarTodo()
{
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