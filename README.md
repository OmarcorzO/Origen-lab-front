[![@coreui angular](https://img.shields.io/badge/@coreui%20-angular-lightgrey.svg?style=flat-square)](https://github.com/coreui/angular)
[![npm-coreui-angular][npm-coreui-angular-badge]][npm-coreui-angular]
[![@coreui coreui](https://img.shields.io/badge/@coreui%20-coreui-lightgrey.svg?style=flat-square)](https://github.com/coreui/coreui)
[![npm package][npm-coreui-badge]][npm-coreui]
![angular](https://img.shields.io/badge/angular-^15.2.0-lightgrey.svg?style=flat-square&logo=angular)

[npm-coreui-angular]: https://www.npmjs.com/package/@coreui/angular
[npm-coreui-angular-badge]: https://img.shields.io/npm/v/@coreui/angular.png?style=flat-square
[npm-coreui-angular-badge-next]: https://img.shields.io/npm/v/@coreui/angular/next?style=flat-square&color=red
[npm-coreui]: https://www.npmjs.com/package/@coreui/coreui
[npm-coreui-badge]: https://img.shields.io/npm/v/@coreui/coreui.png?style=flat-square


# Laboratorio Vivo Olab

El laboratorio vivo Olab es un aplicativo desarrollado con el framework de Angular acondicionado con los servicios prestados de CoreUI,
el cual, cuenta con una paleta de colores amigable compatible con el navegador del sitio y sus diferentes vistas. Disponible para móvil
y PC. Para saber más acerca de los componentes y funcionalidades puede acceder a la documentación.

- [CoreUI Angular Admin Dashboard Template & UI Components Library](https://coreui.io/angular)  
- [CoreUI Angular Demo](https://coreui.io/angular/demo/4.3/free/)
- [CoreUI Angular Docs](https://coreui.io/angular/docs/)  

## Table of Contents

* [Quick Start](#quick-start)
* [Instalación](#instalacion)
* [Uso Básico](#uso-basico)
* [Que incluye](#que-incluye)
* [Documentación](#documentacion)
* [Versionado](#versionado)
* [Copyright and Licencia](#copyright-and-licencia)


## Quick Start

- Clonar el repositorio: `git clone git@bitbucket.org:roberto_porto_solano/olab_frontend.git`

#### <i>Prerequisitos</i>
Antes de empezar, asegurate de que tu enviroment de producción incluya `Node.js®` y un`npm` package manager.

###### Node.js
[**Angular 15**](https://angular.io/guide/what-is-angular) requiere `Node.js` LTS version `^14.20` o `^16.13` o `^18.10`.

- Para verificar la version, ejecute `node -v` en una terminal/consola windows.
- Para obtener `Node.js`, dirijase a [nodejs.org](https://nodejs.org/).

###### Angular CLI
Instala el Angular CLI globalmente usando una terminal/consola windows.
```bash
npm install -g @angular/cli
```

## Instalacion

``` bash
$ npm install
```

## Uso Basico

``` bash
# dev server with hot reload at http://localhost:4200
$ npm start
```

Accede al link [http://localhost:4200](http://localhost:4200). La app será automaticamente recargada si tu modificas alguna parte del código raíz.

### <i> Build</i>

Ejecuta `build` para construir el proyecto. Los artefactos del build estarán ubicados en el directorio `dist/`.

```bash
# build for production with minification
$ npm run build
```
## Que incluye

Dentro de la descarga, encontrará los siguientes directorios y archivos, que agrupan lógicamente los activos comunes y brindan variaciones tanto compiladas como minimizadas. Verás algo como esto:

```
laboratorio-vivo-olab
├── src/                         # root del proyecto
│   ├── app/                     # directorio principal app
|   │   ├── containers/          # contenedores layout
|   |   │   └── default-layout/  # contenedores layout
|   |   |       └── _nav.js      # config de navegación sidebar
|   │   ├── icons/               # iconos que se preestablecen en la app
|   │   └── views/               # vistas de la aplicación
|   |       ├─ auth/             # vistas de autenticación de la aplicación
|   |       ├─ dashboard/        # vistas de la aplicación
|   |       ├─ designprototype/  # vistas de la aplicación
|   |       ├─ error/            # vistas de error para la aplicación
|   |       ├─ EXTRA/            # vistas base de la aplicación
|   |       ├─ guards/           # guards de la aplicación
|   |       ├─ icons/            # vistas de la aplicación
|   |       ├─ ideas/            # vistas de la aplicación
|   |       ├─ ideation/         # vistas de la aplicación
|   |       ├─ interfaces/       # vistas de la aplicación
|   |       ├─ market/           # vistas de la aplicación
|   |       ├─ needs/            # vistas de la aplicación
|   |       └─ services/         # servicios de la aplicación
│   ├── assets/                  # images, icons, etc.
│   ├── components/              # components for demo only
|   └─── enviroments/            # variables de entorno
|        ├── enviroment.ts       # variables de entorno
|        └── enviroment.prod.ts  # variables de entorno de producción
│   ├── scss/                    # scss styles
│   └── index.html               # html template
│
├── angular.json
├── README.md
└── package.json
```

## Documentacion

Esta documentación está basada del sitio web [CoreUI for Angular](https://coreui.io/angular/)

---

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

## Versionado

Para mayor transparencia en nuestro ciclo de lanzamiento y para esforzarnos por mantener la compatibilidad con versiones anteriores, la plantilla de administración gratuita de CoreUI se mantiene bajo [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/coreui/coreui-free-angular-admin-template/releases) for changelogs for each release version.

## Server de desarrollo

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Andamio de código

Ejecute `ng generate component component-name`  para generar un nuevo componente. También puede usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### <i>Build </i>

Ejecute `ng build` para compilar el proyecto. Los artefactos de compilación se almacenarán en el directorio dist/.

### <i>Ejecución de pruebas unitarias</i>

Ejecute `ng test` para ejecutar las pruebas unitarias a través de Karma.

### <i>Ejecución de pruebas de extremo a extremo</i>

Ejecute `ng e2e` para ejecutar las pruebas de extremo a extremo a través de una plataforma de su elección. Para usar este comando, primero debe agregar un paquete que implemente capacidades de prueba de un extremo a otro.

## Copyright and Licencia

copyright 2022 creativeLabs Łukasz Holeczek.   

 
Código desarrollado bajo [the MIT license](https://github.com/coreui/coreui-free-react-admin-template/blob/master/LICENSE).
Esta es solo una copia de desarrollo y limitada en su desarrollo. No puede hacer esto si modifica CoreUI. En el pasado, enfrentamos algunos problemas con personas que intentaron vender plantillas basadas en CoreUI.
