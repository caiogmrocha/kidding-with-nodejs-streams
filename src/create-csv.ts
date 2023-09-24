import fs from "fs";


const writeStream = fs.createWriteStream("datasource.csv")

writeStream.write(`id, name, age\n`);