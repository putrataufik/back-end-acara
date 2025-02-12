import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Acara",
        description: "Dokumentasi API Acara",
    },
    servers:[
        {
            url: "http://localhost:3000/api",
            description: "Local Development Server",
        },
        {
            url: "https://back-end-acara-seven.vercel.app/api",
            description: "Deploy Server"
        }
    ],
    components:{
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest:{
                identifier: "putrataufik",
                password:"12345678",
            },
            RegisterRequest:{
                fullName: "Putra Taufik",
                userName: "putrataufik",
                email: "putrataufik@gmail.com",
                password: "12345678",
                confirmPassword: "12345678",
            },
            ActivationRequest: {
                code: "abcdef"
            }
        },
    },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"]


swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc);