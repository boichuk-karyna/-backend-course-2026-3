const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
  .exitOverride()
  .configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-m, --mfo', 'відображати код МФО банку перед назвою')
  .option('-n, --normal', 'відображати лише працюючі банки (COD_STATE: 1)');

try {
  program.parse(process.argv);
} catch (err) {
  console.error("Please, specify input file");
  process.exit(1);
}

const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(options.input, 'utf8');
  let data = JSON.parse(rawData);

  if (options.normal) {
    data = data.filter(item => item.COD_STATE === 1);
  }

  const resultLines = data.map(item => {
    let line = "";
    if (options.mfo) {
      line += `${item.MFO} `; 
    }
    line += item.FULLNAME;
    return line.trim();
  });

  const finalResult = resultLines.join('\n');

  if (options.display) {
    console.log(finalResult);
  }

  if (options.output) {
    fs.writeFileSync(options.output, finalResult, 'utf8');
  }

} catch (err) {
  console.error("Error processing file: " + err.message);
  process.exit(1);
}