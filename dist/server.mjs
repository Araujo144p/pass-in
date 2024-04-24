import {
  registerForEvent
} from "./chunk-CNN7TGRA.mjs";
import {
  errorHandler
} from "./chunk-DCZJQNPL.mjs";
import {
  checkIn
} from "./chunk-SYJ3QRNJ.mjs";
import {
  createEvent
} from "./chunk-YPFUH3NE.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeesBadge
} from "./chunk-R5T677MV.mjs";
import {
  getEventAttendee
} from "./chunk-EVQHWX5H.mjs";
import {
  getEvent
} from "./chunk-OVXU67HD.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeesBadge);
app.register(checkIn);
app.register(getEventAttendee);
app.setErrorHandler(errorHandler);
app.listen({ port: 3030, host: "0.0.0.0" }).then(() => {
  console.log("server is running!");
});
