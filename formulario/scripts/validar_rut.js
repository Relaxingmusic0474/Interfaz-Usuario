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
