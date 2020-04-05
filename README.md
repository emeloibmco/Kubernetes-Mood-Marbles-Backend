# Aplicacion Node.js con el framework Express en IBM Kubernetes Service (IKS)

[![Apache License](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](http://www.apache.org/licenses/LICENSE-2.0)
[![GitHub](https://img.shields.io/github/release/emeloibmco/Kubernetes-Mood-Marbles-Backend.svg?style=flat-square)](https://github.com/emeloibmco/Kubernetes-Mood-Marbles-Backend/releases)

El repositorio contiene todos los archivos necesarios para desplegar una aplicación node.js en el IKS. La aplicación de ejemplo es la usada para el backend de [Mood Marbles](http://moodmarblesfcol.mybluemix.net)

Para consultar el código del Frontend visitar el **[repositorio](https://github.com/emeloibmco/Kubernetes-Mood-Marbles-Front)** dispuesto.

---

## :package: Arquitectura

En azul se resalta la parte contenida en este repositorio <br/>
![Arquitectura Kubernetes Backend Service](https://github.com/emeloibmco/Kubernetes-Mood-Marbles-Backend/master/github/images/Mood_Marbles_Arch.png)

---

## 🚀 Guia Despliegue en IBM Kubernetes Service (IKS) 📦

### Requisitos:

- Tener un servicio de **[Kubernetes Cluster]()** disponible en la cuenta IBM Cloud. Para cuentas Lite este servicio está disponible por 30 días.
- [IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cloud-cli-getting-started&locale=en) :cloud:
- [Docker](https://www.docker.com/products/docker-desktop) :whale:
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/). La version de esta herramienta debe ser compatible con la version de IKS que se desplegó en la cuenta.
- [TypeScript](https://www.typescriptlang.org/#download-links)

### **Hands On**:

### Instalar o actualizar los plugins necesarios del IBM Cloud CLI. Reemplazar `install` con `update` si es el caso.

```sh
ibmcloud plugin install kubernetes-service
ibmcloud plugin install container-registery
```

### Configuración del Container Registery (CR) de IBM en nuestra interfaz de comandos:

- Iniciar sesión en nuestro terminal de comandos: <br/>
  `ibmcloud cr login`<br/>
  **Importante**: Tener en cuenta la región que aparece en pantalla, ya que tomará parte de los pasos siguientes.

- Crear espacio de nombres: <br/>
  `ibmcloud cr namespace-add <namespace>`<br/>
  Este espacio de nombres tambien formará parte de los comandos siguientes. Se puede comprobar el nombre en cualquier momento usando el comando: <br/> `ibmcloud cr namespaces`

### Desplegar la imagen de la Base de Datos 🐳💾

La aplicación utiliza MongoDB como base de datos NoSQL.

- Descargar la imagen de MongoDB del registro Docker Hub:<br/>
  Para descargar la imagen oficial de MongoDB, almacenada en el registro de imagenes Docker Hub, utilizar el comando: <br/>
  `docker pull mongo:latest`

- Cambiar tag de la imagen para que sea compatible con la region y el espacio de nombre de nuestro IKS:<br/>
  `docker tag mongo:latest <region>/<namespace>/mongo`

- Subir imagen a Container Registery:
  `docker push <region>/<namespace>/mongo`

Necesitamos desplegar la imagen de MongoDB para enlazar la base de datos a nuestra aplicación antes de crear y desplegar la imagen de nuestra aplicación.

- Configurar el plugin kubernetes-service: <br/>
  `ibmcloud cs cluster config --cluster <nombre_cluster>`<br/>
  Si no conocemos el nombre de nuestro cluster podemos utilizar el comando `ibmcloud cs clusters`

- Desplegar la imagen en nuestro Cluster: <br/>
  `kubectl run mongo --image=<region>/<namespace>/mongo`

- Exponer el Pod creado:<br/>
  `kubectl expose deployment/mongo --type="NodePort" --port=27017`<br/>

### Crear y desplegar la imagen Docker :whale: de nuestra aplicación

Para poder enlazar la imagen creada con nuestra aplicación necesitamos la IP y el puerto generado en el paso anterior, para eso ejecutamos el comando: <br/>

- Puerto: `kubectl describe service mongo`<br/>

- IP: `ibmcloud cs workers --cluster <nombre_cluster>`

Con la IP y el puerto editamos el archivo app.ts ubicado en la carpeta server, modificando las lineas de conexión con la base de datos.

```typescript
mongoose
  .connect("mongodb://<IP>:<NodePort>/<nombre_db>")
  .then((_db: any) => {
    console.log(`Connected to MongoDB!`);
  })
  .catch((err: any) => console.error(err));
```

- Crear la imagen desplegable en el Container Registery de IBM:<br/>
  `docker build --tag <region>/<namespace>/<nombre_imagen>`

- Subir imagen al Container Registery:
  `docker push <region>/<namespace>/<nombre_imagen>`

- Desplegar la imagen como servicio en nuestro Cluster: <br/>
  `kubectl run <nombre_servicio> --image=<region>/<namespace>/<nombre_imagen>`

- Exponer el Pod creado:<br/>
  `kubectl expose deployment/<nombre_servicio> --type="NodePort" --port=<port>`<br/>
  _El puerto debe ser el definido en el archivo app.ts_

Como en el despliegue de la imagen de nuestra base de datos, debemos encontrar el Endpoint de nuestra aplicacion, ejecutamos los mismos comandos listados al inicio de esta sección. Se podrá dar cuenta que la IP no ha cambiado ya que el IKS se encarga de enrutar los servicios por puerto y por carga, usando el Load Balancer provisto.

- Puerto: `kubectl describe service <nombre_servicio>`<br/>

- IP: `ibmcloud cs workers --cluster <nombre_cluster>`

Como nuestra aplicación es una API, es necesario conocer las URI asociadas, para el ejemplo de Mood Marbles se presentan en la siguiente tabla solo las peticiones GET:

| URI                         | TIPO |
| --------------------------- | ---- |
| 173.193.92.5:30837/pools    | GET  |
| 173.193.92.5:30837/pool/:id | GET  |
| 173.193.92.5:30837/users    | GET  |
| 173.193.92.5:30837/user/:id | GET  |

Para más información consulte la [Documentación de IKS](https://cloud.ibm.com/docs/containers?topic=containers-getting-started)
