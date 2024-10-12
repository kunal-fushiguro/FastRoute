import { App } from "../index"

const app = new App()

app.listen(8080, () => {
    console.log(`Server Started on PORT : 8080`)
})

