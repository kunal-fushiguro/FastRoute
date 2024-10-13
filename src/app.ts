import { createServer, IncomingMessage, ServerResponse } from "http"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

class App {
    private routes: Map<Method, Map<string, (request: any, response: any) => void>>
    private createServer: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>
    //  initialize a server
    constructor() {
        this.routes = new Map()
        this.createServer = createServer((req, res) => {
            this.handleAllRequest(req, res)
        })
    }

    // listening a server on PORT
    listen(port: number, cb: () => void) {
        this.createServer.listen(port, cb)
    }

    // handle urls
    private handleAllRequest(req: IncomingMessage, res: ServerResponse) {
        const method = req.method as Method
        const url = req.url || "/"

        console.log(`Route : ${req.url} , METHOD : ${req.method}`)

        const routerHandler = this.routes.get(method)?.get(url)

        if (routerHandler) {
            routerHandler(req, res)
        } else {
            res.statusCode = 404
            res.end("404 Not Found")
        }
    }

    // route

    private route(method: Method, path: string, cb: (request: IncomingMessage, response: ServerResponse) => void) {
        if (!this.routes.has(method)) {
            this.routes.set(method, new Map())
        }
        this.routes.get(method)?.set(path, cb)
    }

    // create a routes
    get(METHOD: Method, path: string, cb: (request: IncomingMessage, response: ServerResponse) => void) {
        this.route("GET", path, cb)
    }

    post(METHOD: Method, path: string, cb: (request: IncomingMessage, response: ServerResponse) => void) {
        this.route("POST", path, cb)
    }

    patch(METHOD: Method, path: string, cb: (request: IncomingMessage, response: ServerResponse) => void) {
        this.route("PATCH", path, cb)
    }

    put(METHOD: Method, path: string, cb: (request: IncomingMessage, response: ServerResponse) => void) {
        this.route("PUT", path, cb)
    }

    delete(METHOD: Method, path: string, cb: (request: IncomingMessage, response: ServerResponse) => void) {
        this.route("DELETE", path, cb)
    }
}

export { App }

