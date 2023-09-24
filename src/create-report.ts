import fs from 'fs';
import path from 'path';
import readline from 'readline'

console.time('create-report');

const dataSourceReadStream = fs.createReadStream(path.resolve(__dirname, 'resources', 'datasource.csv'));

const reportData: { [key: string]: bigint } = {};

dataSourceReadStream.on('finish', () => dataSourceReadStream.close());

const rl = readline.createInterface({
	input: dataSourceReadStream,
	terminal: false,
});

rl.on('line', (line) => {
	const [plate, traveled_kilometers] = line.split(',');

	reportData[plate] = BigInt(traveled_kilometers) + (reportData[plate] || 0n);
});

rl.on('close', () => {
	const reportWriteStream = fs.createWriteStream(path.resolve(__dirname, 'resources', 'report.json'));

	const treatedReportData = Object.entries(reportData).map(([plate, traveled_kilometers]) => ({
		plate,
		traveled_kilometers: traveled_kilometers.toString(),
	}));

	reportWriteStream.write(JSON.stringify(treatedReportData, null, 2));

	reportWriteStream.on('finish', () => reportWriteStream.close());

	console.timeEnd('create-report');;
});

rl.resume();
