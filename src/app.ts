import { createServer, IncomingMessage, ServerResponse } from "http"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
type Handler = (request: IncomingMessage, response: ServerResponse, next: () => void, querys: object, params: object) => void

class App {
    private routes: Map<Method, { pathRegex: RegExp; paramNames: string[]; handlers: Handler[] }[]>
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

        const [path, queryString] = url.split("?")
        const querys: { [key: string]: any } = {}
        if (queryString) {
            queryString.split("&").forEach((query) => {
                const [key, value] = query.split("=")
                querys[key] = value
            })
        }

        const routeHandlers = this.matchRoute(method, path)

        if (routeHandlers) {
            const { handlers, params } = routeHandlers
            this.runHandlers(req, res, handlers, querys, params)
        } else {
            res.statusCode = 404
            res.end("404 Not Found")
        }
    }

    // Match route and extract params
    private matchRoute(method: Method, path: string) {
        const routes = this.routes.get(method)
        if (!routes) return null

        for (const route of routes) {
            const match = path.match(route.pathRegex)
            if (match) {
                const params: { [key: string]: string } = {}
                route.paramNames.forEach((paramName, index) => {
                    params[paramName] = match[index + 1]
                })
                return { handlers: route.handlers, params }
            }
        }

        return null
    }

    // Run all handlers (middlewares + final handler) sequentially
    private runHandlers(
        req: IncomingMessage,
        res: ServerResponse,
        handlers: Handler[],
        querys: { [key: string]: any },
        params: { [key: string]: string }
    ) {
        let index = -1

        const runNext = () => {
            index++
            if (index >= handlers.length) {
                return
            }
            handlers[index](req, res, runNext, querys, params)
        }

        runNext()
    }

    // Register routes with support for params
    private route(method: Method, path: string, ...handlers: Handler[]) {
        if (!this.routes.has(method)) {
            this.routes.set(method, [])
        }

        const paramNames: string[] = []
        const pathRegex = path.replace(/:([^\/]+)/g, (_, paramName) => {
            paramNames.push(paramName)
            return "([^\\/]+)"
        })
        const regex = new RegExp(`^${pathRegex}$`)

        this.routes.get(method)?.push({ pathRegex: regex, paramNames, handlers })
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

