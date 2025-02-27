import 'dotenv/config'
import path from 'path'

import Fastify, {FastifyError, FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'
import FastifyPostgres from '@fastify/postgres'
import FastifyCors from '@fastify/cors'
import FastifyCompress from '@fastify/compress'
import FastifyView from '@fastify/view'

import PinoPretty from 'pino-pretty'
import Nunjucks from 'nunjucks'

import { DashboardController } from '@presentation/http/controller/DashboardController'
import { DivisesController } from '@presentation/http/controller/DivisesController'
import { EstatesController } from '@presentation/http/controller/EstatesController'
import { MapController } from '@presentation/http/controller/MapController'
import { OperationsController } from '@presentation/http/controller/OperationsController'
import { ProjectsController } from '@presentation/http/controller/ProjectsController'
import { PropertiesController } from '@presentation/http/controller/PropertiesController'
import { ScraperController } from '@presentation/http/controller/ScraperController'
import { UsersController } from '@presentation/http/controller/UsersController'
import { SessionController } from '@presentation/http/controller/SessionController'
import FastifyStatic from '@fastify/static'
import { EstateScraperApi } from '@presentation/http/api/EstateScraperApi'
import { PortalScraperApi } from '@presentation/http/api/PortalScraperApi'
import { DataSourceApi } from '@presentation/http/api/DataSourceApi'
import { DataSourceController } from '@presentation/http/controller/DataSourceController'
import { SuccessResponse } from '@application/responses/SuccessResponse'
import { ErrorResponse } from '@application/responses/ErrorResponse'
import { DataSourceUseCase } from '@application/usecases/DataSourceUseCase'

class App {
    fastify: FastifyInstance;

    constructor(){
        this.fastify = Fastify({
            //logger: true
            logger: {
                level: 'trace',
                stream: PinoPretty(),
                redact: ['req.headers.authorization']
            }
        });
    }
    
    async run(){
        this.loadStatic();
        this.loadCompression();
        this.loadViewer();
        this.loadDecorators();
        this.loadErrorHandler();
        this.loadCors();
        this.loadDatabase();
        this.loadControllers();

        try {
            await this.fastify.listen({ port: 8080 });
        } catch (err) {
            this.fastify.log.error(err);
            process.exit(1);
        }
    }

    loadStatic() {
        console.log(path.join(process.cwd(), "public"));
        this.fastify.register(FastifyStatic, {
            root: path.join(process.cwd(), "public"),
            prefix: "/"
        });
    }

    loadDecorators() {
        this.fastify.decorateReply('success', function(message: String, data?: any) {
            let res: SuccessResponse = {
                status: 'success',
                success: {
                    message: message,
                    data: data
                }
            }

            this.status(200)
                .header('Content-Type', 'application/json')
                .send(res);
        });

        this.fastify.decorateReply('error', function(message: string, internal_message: string, data?: any) {
            const res: ErrorResponse = {
                status: 'error',
                error: {
                    message: message,
                    internal_message: internal_message,
                    data: data
                }
            };
        
            this.status(500)
                .header('Content-Type', 'application/json')
                .send(res);
        });
    }

    loadCompression() {
        // Registrar el plugin de compresión
        this.fastify.register(FastifyCompress);
    }

    loadViewer() {
        this.fastify.register(FastifyView, {
            engine:{
                nunjucks: Nunjucks
            },
            root: path.join(__dirname, "presentation/views")
        });
    }

    loadErrorHandler() {
        this.fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
            console.error(error.message);
            let message = null;
            if(error.message.includes('duplicate key')){
                message = 'Upps, ya existe';
            }
            reply.error(message ?? error.message, error.message, error);
        });
    }

    loadCors() {
        // Registrar el plugin CORS
        this.fastify.register(FastifyCors, {
            // Opciones de CORS (configura según tus necesidades)
            origin: "*", // Permite todas las fuentes (puedes restringirlo a dominios específicos)
            methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        });
    }

    loadDatabase() {
        const dbHost = process.env.DB_HOST;
        const dbPort = process.env.DB_PORT;
        const dbName = process.env.DB_NAME;
        const dbUsername = process.env.DB_USERNAME;
        const dbPassword = process.env.DB_PASSWORD;

        // Registrar el plugin de PostgreSQL
        this.fastify.register(FastifyPostgres, {
            connectionString: `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
        });
    }

    loadControllers(){
        

        const apis = [ EstateScraperApi, PortalScraperApi, DataSourceApi ];
        const controllers = [
            DashboardController,
            DivisesController,
            EstatesController,
            MapController,
            OperationsController,
            ProjectsController,
            PropertiesController,
            ScraperController,
            DataSourceController,
            UsersController,
            SessionController
        ];
        
        apis.forEach(Api => new Api(this.fastify));
        controllers.forEach(Controller => new Controller(this.fastify));
    }
}

const app = new App;
app.run();