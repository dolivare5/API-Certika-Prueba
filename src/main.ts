import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import bodyParser from "body-parser";
import {json, urlencoded} from "express";

async function main() {
    /* Creando una instancia de la aplicación NestJS */
    const app = await NestFactory.create(AppModule);
    
    
    /* Configuración del prefijo global para todas las rutas. */
    app.setGlobalPrefix('api');
    /* Configuración de la validación de datos de entrada. */
    app.useGlobalPipes(
        /* ValidationPipe es un pipe que se encarga de validar los datos de entrada de las rutas. */
        new ValidationPipe({
            /* whitelist es una propiedad que indica si se deben ignorar los datos de entrada que no estén definidos en la clase DTO. */
            whitelist: true,
            /* forbidNonWhitelisted es una propiedad que indica si se debe lanzar una excepción cuando se reciban datos de entrada que no estén definidos en la clase DTO. */
            forbidNonWhitelisted: true,
            /* transform es una propiedad que indica si se deben transformar los datos de entrada a los tipos definidos en la clase DTO. */
            transform: true,
            /* transformOptions es una propiedad que permite configurar la transformación de datos de entrada. */
            transformOptions: {
                /* enableImplicitConversion es una propiedad que indica si se deben transformar los datos de entrada a los tipos definidos en la clase DTO. */
                enableImplicitConversion: true
            }
        })
    );
    const config = new DocumentBuilder()
        .setTitle('Prueba Técnica Certika RESTFul API')
        .setDescription('Library Endpoints')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    /* Solucionando el error 413 Payload Too Large in NestJS */
    app.use(json({limit: '50mb'}));
    app.use(urlencoded({limit: '50mb', extended: true}));
    app.enableCors();
    /* Configuración del puerto en el que se ejecutará la aplicación. */
    await app.listen(process.env.PORT_SERVER );
}

main().then(() =>  {
    const logger = new Logger('NestApplication');
    logger.log(`Server running on port ${process.env.PORT_SERVER} successfully`)
});
