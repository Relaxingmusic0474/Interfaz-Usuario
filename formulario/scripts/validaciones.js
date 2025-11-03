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
        alert("El RUT es inválido.");
        return false; // Evita el envío del formulario
    }

    return true; // Permite el envío del formulario
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

    if (edadCalculada !== edadIngresada)
    {
        alert(`Ha mentido sobre su edad.  Según la fecha de nacimiento, su edad es ${edadCalculada} años.  No podrá continuar con el formulario de postulación.`);
        return false; // Evita el envío del formulario
    }

    return true; // Permite el envío del formulario
}