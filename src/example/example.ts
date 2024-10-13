import { App } from "../index"

const app = new App()

app.get("GET", "/", (req, res) => {
    console.log(`Path : ${req.url} , method : ${req.method}`)
    const data = {
        message: "hello"
    }

    res.writeHead(200, { "Content-type": "application/json" })
    res.end(JSON.stringify(data))
})

app.listen(8080, () => {
    console.log(`Server Started on PORT : 8080`)
})

