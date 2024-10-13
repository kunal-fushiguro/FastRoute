import { App } from "../index"
import { IncomingMessage, ServerResponse } from "http"

const app = new App()

// function middlewares(req: IncomingMessage, res: ServerResponse, next: () => void) {
//     console.log("Hello from middlewares")
//     next()
// }

app.get(
    "/",
    (req, res, next) => {
        if (!next) {
            return
        }
        console.log("Hello by middleware")
        next()
    },
    (req: IncomingMessage, res: ServerResponse) => {
        res.end("hello world")
    }
)

app.listen(8080, () => {
    console.log(`Server Started on PORT : 8080`)
})

