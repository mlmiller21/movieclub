import { server } from "./app";

const port = process.env.PORT || 3080;

const main: any = async () => {
    const app = await server();

    if (!app){
        throw new Error;
    }

    app.listen(port, () => {
        console.log(`server started on http://localhost:${port}`);
    })
    
}

main();