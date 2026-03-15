const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const program = new Command();

program
  .name('bank-app')
  .description('Програма для роботи з даними НБУ')
  .version('1.0.0');


program
  .requiredOption('-i, --input <file>', 'шлях до файлу для читання') 
  .option('-o, --output <file>', 'шлях до файлу для запису результату') 
  .option('-d, --display', 'вивести результат у консоль');             

program.parse(process.argv);
const options = program.opts();


if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}


if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}


let data;
try {
  data = fs.readFileSync(options.input, 'utf-8');
} catch (err) {
  console.error('Cannot find input file');
  process.exit(1);
}

const result = data;


if (options.display) {
  console.log(result);
}

if (options.output) {
  try {
    fs.writeFileSync(options.output, result, 'utf-8');
  } catch (err) {
    console.error('Error writing to output file:', err.message);
  }
}

