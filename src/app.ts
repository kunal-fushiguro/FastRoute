import { createServer, IncomingMessage, ServerResponse } from "http"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// Updated Handler type
type Handler = (request: IncomingMessage, response: ServerResponse, next?: () => void) => void

class App {
    private routes: Map<Method, Map<string, Handler[]>>
    private createServer: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>

    constructor() {
        this.routes = new Map()
        this.createServer = createServer((req, res) => {
            this.handleAllRequest(req, res)
        })
    }

    // Listening to the server on a PORT
    listen(port: number, cb: () => void) {
        this.createServer.listen(port, cb)
    }

    // Handle requests
    private handleAllRequest(req: IncomingMessage, res: ServerResponse) {
        const method = req.method as Method
        const url = req.url || "/"

        console.log(`Route : ${req.url} , METHOD : ${req.method}`)

        const routeHandlers = this.routes.get(method)?.get(url)

        if (routeHandlers) {
            this.runHandlers(req, res, routeHandlers)
        } else {
            res.statusCode = 404
            res.end("404 Not Found")
        }
    }

    // Run all handlers (middlewares + final handler) sequentially
    private runHandlers(req: IncomingMessage, res: ServerResponse, handlers: Handler[]) {
        let index = -1

        const runNext = () => {
            index++
            if (index >= handlers.length) {
                return
            }
            handlers[index](req, res, runNext)
        }

        runNext()
    }

    // Route method for registering routes with multiple handlers (middlewares + route)
    private route(method: Method, path: string, ...handlers: Handler[]) {
        if (!this.routes.has(method)) {
            this.routes.set(method, new Map())
        }
        this.routes.get(method)?.set(path, handlers)
    }

    // Registering routes for different HTTP methods
    get(path: string, ...handlers: Handler[]) {
        this.route("GET", path, ...handlers)
    }

    post(path: string, ...handlers: Handler[]) {
        this.route("POST", path, ...handlers)
    }

    patch(path: string, ...handlers: Handler[]) {
        this.route("PATCH", path, ...handlers)
    }

    put(path: string, ...handlers: Handler[]) {
        this.route("PUT", path, ...handlers)
    }

    delete(path: string, ...handlers: Handler[]) {
        this.route("DELETE", path, ...handlers)
    }
}

export { App, IncomingMessage, ServerResponse }

