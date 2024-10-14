import { App } from "../index"
import { IncomingMessage, ServerResponse } from "http"

const example = new App()

function middlewares(req: IncomingMessage, res: ServerResponse, next: () => void) {
    console.log("Hello from middlewares")
    next()
}

example.get("/", middlewares, (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200
    res.setHeader("Content-Type", "text/plain")
    res.end("hello world")
})

example.get("/hello", (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200
    res.setHeader("Content-Type", "text/plain")
    res.end("oedasfbudsafakjdfjkakjfakkdjashdsa")
})

example.get(
    "/hello1",
    (
        req: IncomingMessage,
        res: ServerResponse,
        _,
        querys: {
            [key: string]: any
        }
    ) => {
        console.log(querys)
        console.log(querys.value)

        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")
        res.end("oedasfbudsafakjdfjkakjfakkdjashdsa")
    }
)

example.get("/hello2", (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200
    res.setHeader("Content-Type", "text/plain")
    res.end("oedasfbudsafakjdfjkakjfakkdjashdsa")
})

example.listen(8080, () => {
    console.log(`Server Started on PORT : 8080`)
})

export { example }

