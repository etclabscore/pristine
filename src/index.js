const parseSchema = require('@open-rpc/schema-utils-js');
const util = require('util');
const _ = require('lodash');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const fsx = require('fs-extra');

const cwd = process.cwd();

const cleanBuildDir = async (destinationDirectoryName) => {
  await fsx.ensureDir(destinationDirectoryName);
  await fsx.emptyDir(destinationDirectoryName);
};

const compileMethodTemplate = async (method) => {
  const templatePath = path.join(__dirname, '../', '/templates/method.template.md');
  const templates = await readFile(templatePath, 'utf-8');
  const compile = _.template(templates);

  return compile({ method, _ });
};

module.exports = async () => {
  const outputDirName= 'build';
  const parsedSchema = await parseSchema('https://raw.githubusercontent.com/open-rpc/examples/master/service-descriptions/petstore-expanded.json');
  const methodDocsPromises = parsedSchema.methods.map((method) => {
    return compileMethodTemplate(method);
  });
  const methodDocs = await Promise.all(methodDocsPromises);

  const destinationDirectoryName = `${cwd}/${outputDirName}`;
  await cleanBuildDir(destinationDirectoryName);
  await writeFile(`${destinationDirectoryName}/methods.md`, methodDocs.join('\n'), 'utf8');

  return true;
};
module.exports().then(() => console.log('done!'));
