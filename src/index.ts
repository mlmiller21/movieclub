import { createConnection } from "typeorm";
import { dbConfig } from "./typeormconfig";
import { __prod__ } from "./constants";
import { Friends } from "./entities/Friends";
import { User } from "./entities/User";

const main : any = async () => {
    const connection = await createConnection({
        type: "postgres",
        database: dbConfig.database,
        username: dbConfig.username,
        password: dbConfig.password,
        logging: true,
        synchronize: true,
        entities: [User, Friends]
    });
    
}

main();