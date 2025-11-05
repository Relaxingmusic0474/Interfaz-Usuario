function rendir_prueba_estadistica()
{
    // Se valida lo ingresado antes de rendir la prueba
    if (!validarTodo()) 
    {
        return; // Si alguna validación falla, se detiene el proceso
    }
    
    // Redirigir a la página de resultados
    window.location.href = "resultados.html";
}
