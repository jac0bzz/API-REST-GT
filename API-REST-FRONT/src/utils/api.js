
export const customFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem('access_token');
    
    // Asegurar que lleven las cabeceras por defecto
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    let response = await fetch(url, options);

    // ¡ALERTA!: Si el servidor responde 401 (Unauthorized), significa que el token expiró
    if (response.status === 401) {
        console.log("El Token de acceso expiró. Intentando renovarlo...");
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
        try {
            // Le pedimos a Django una nueva llave usando la ruta de refresh
            const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            
            // Guardamos la nueva llave brillante en el navegador
            localStorage.setItem('access_token', data.access);
            console.log("¡Token renovado con éxito de forma automática!");

            // Actualizamos la cabecera con el nuevo token y REINTENTAMOS la petición original
            options.headers['Authorization'] = `Bearer ${data.access}`;
            response = await fetch(url, options);
            } else {
            // Si el refresh token también expiró, hay que mandar al usuario al login
            console.warn("El Refresh Token también expiró. Sesión caducada por completo.");
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.reload(); // Recarga la página para forzar el login
            }
        } catch (err) {
            console.error("Error en la conexión al intentar refrescar token", err);
        }
        }
    }

    return response;
};