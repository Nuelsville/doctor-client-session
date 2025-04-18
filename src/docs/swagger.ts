import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Doctor-Patient Portal API",
            version: "1.0.0",
            description: "API documentation for the Doctor-Patient Consultation Portal",
        },
        servers: [
            {
                url: "http://127.0.0.1:5500", // your backend URL
            },
        ],
        tags: [
            {
                name: "Auth",
                description: "Authentication endpoints",
            },
            {
                name: "Users",
                description: "User management",
            },
            {
                name: "Sessions",
                description: "Session handling",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // adjust this to match where your route files are
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
