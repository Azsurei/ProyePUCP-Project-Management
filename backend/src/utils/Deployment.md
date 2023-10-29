# Configuración de Despliegue en EC2

## Creación de Instancia EC2

1. **Crea una instancia EC2**:
   - Utiliza Ubuntu 20.04.
   - Abre los puertos inbound 8080 y 3000 para todos.

## Instalación de Dependencias en la Instancia

2. **Descarga npm y node**.
https://github.com/nodesource/distributions
3. **Descarga las herramientas adicionales**:
   - pm2: npm install pm2 -g
   - git
   - certbot: https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal **Es importante configurar el certbot antes del nginx**
   - nginx: sudo apt install nginx y darle start y enable

   
## Configuración de Nginx

4. **Crea un archivo de configuración para tu front-end**:
   ```bash
      sudo nano /etc/nginx/sites-available/frontend-PROYEPUCP
   ```
5. Añade la siguiente configuración:
   ``` javascript
    server {
        listen 80;
        server_name tu_dominio_o_ip;

        location / {
            proxy_pass http://localhost:3000; # Asegúrate de que esto coincida con el puerto de Next.js
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

   ```
6. Habilita el sitio:
   ``` bash
   sudo ln -s /etc/nginx/sites-available/frontend-PROYEPUCP /etc/nginx/sites-enabled/
    ```
    Borrar todos los default de los sites-* pues estos no permiten el correcto funcionamiento del nginx
    
7. Reinicia nginx:
   ``` bash
sudo systemctl restart nginx
    ```
## Configuracion de SSH 
8. Configura SSH en la instancia para poder hacer un git pull al proyecto privado.

## Preparacion para el despliegue

### Backend
9. Navega a la ruta del backend y ejecuta:

``` bash
npm install
```
### Frontend

10. En el directorio del frontend, ejecuta los siguientes comandos:
    ``` bash
    npm run preinstall
    npm install
    npm run build
    ```
## Lanzamiento de la Aplicación con PM2

11. **Desde el archivo raiz escribir**:

```bash
pm2 start ecosystem.config.js
```

FrontEnd

pm2 start npm --name "PROYEPUCP-CLIENT" -- run start -p 3000

Backend
pm2 start server.js --name "PROYEPUCP-SERVER"


Con estos pasos, tu aplicación estará desplegada y ejecutándose en la instancia EC2.

# Nota

El ecosystem.config.js ya esta configurado con la ejecucion de el pm2 tanto para back como para front.

git clone git@github.com:Gabo52/INGESOFT-LosDibujitos.git