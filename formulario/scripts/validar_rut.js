function validarRutChileno(rut)
{
    // Eliminar puntos y guiones (si los hay)
    rut = rut.replace(/\./g, "").replace(/-/g, "");

    // Separar el cuerpo y el dígito verificador
    const partes = rut.split('-');
    const numero = partes[0];
    const dv_teorico = partes[1].toUpperCase();

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

validarRutChileno()