const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
  .name('bank-app')
  .description('Програма для роботи з даними НБУ')
  .version('1.0.0');


program
  .requiredOption('-i, --input <file>', 'шлях до файлу для читання')
  .option('-o, --output <file>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program
  .option('-m, --mfo', 'Відображати код МФО перед назвою банку')
  .option('-n, --normal', 'Відображати лише працюючі банки з кодом 1 "Нормальний"');

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
  const fileContent = fs.readFileSync(options.input, 'utf-8');
  data = JSON.parse(fileContent);
} catch (err) {
  console.error('Cannot find input file');
  process.exit(1);
}


let resultLines = [];

data.forEach(item => {

  if (options.normal && item.COD_STATE !== 1) return;


  let line = '';
  if (options.mfo) {
    line += item.MFO + ' ';
  }
  line += item.SHORTNAME || item.FULLNAME || 'Unknown Bank';

  resultLines.push(line);
});


if (resultLines.length === 0 && !options.output && !options.display) {
  process.exit(0);
}


const resultText = resultLines.join('\n');


if (options.display) {
  console.log(resultText);
}


if (options.output) {
  try {
    fs.writeFileSync(options.output, resultText, 'utf-8');
  } catch (err) {
    console.error('Error writing to output file:', err.message);
  }
}