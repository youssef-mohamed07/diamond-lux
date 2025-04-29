import csv from "csv-parser";
import fs from "fs";

const filePath = "./natural-diamond.csv";
let count = 0;
let lgTypes = {};

fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
        // Count occurrences of each lg value
        lgTypes[row.lg] = (lgTypes[row.lg] || 0) + 1;
        count++;
    })
    .on("end", () => {
        console.log("Total rows:", count);
        console.log("lg field values:", lgTypes);
    }); 