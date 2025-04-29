import csv from "csv-parser";
import fs from "fs";

const filePath = "./natural-diamond.csv";
let count = 0;

fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
        if (count < 5) {
            console.log("Row:", row);
            count++;
        }
    })
    .on("end", () => {
        console.log("CSV file successfully processed");
    }); 