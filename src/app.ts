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
    handleAllRequest(req: IncomingMessage, res: ServerResponse) {
        console.log(`Route : ${req.url} , METHOD : ${req.method}`)

        res.end("hello-world")
    }
}

export { App }

