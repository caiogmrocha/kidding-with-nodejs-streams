import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

const dataSourceWriteStream = fs.createWriteStream(path.resolve(__dirname, 'resources', 'datasource.csv'));

console.time('create-csv');

const totalRegistros = 100000000;
const fatorPercentualUnitario = totalRegistros / 100;
let registrosEscritos = 0;

const availablePlates = Array.from({ length: 100 }, () => faker.vehicle.vrm());

function escreverRegistro() {
  while (registrosEscritos < totalRegistros) {
		if (registrosEscritos % fatorPercentualUnitario === 0) {
			const percentual = (registrosEscritos / totalRegistros) * 100;
			console.clear();
			console.log(`Criação da base de dados fake: ${percentual.toFixed(0)}%`);
		}

    const placa = faker.helpers.arrayElement(availablePlates);
    const quilometrosRodados = Math.floor(Math.random() * 100000);

    const registro = `${placa},${quilometrosRodados}\n`;

    const ok = dataSourceWriteStream.write(registro);

    if (!ok) {
      dataSourceWriteStream.once('drain', escreverRegistro);
      return;
    }

    registrosEscritos++;
  }

  dataSourceWriteStream.end(() => {
    console.timeEnd('create-csv');
  });
}

escreverRegistro();
