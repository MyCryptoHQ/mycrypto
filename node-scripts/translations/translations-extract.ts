/* tslint:disable:no-console */
import { tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const PROJECT_FILE_PATTERN = './common/**/*.{ts,tsx}';
const TRANSLATION_FILE_PATTERN = './common/v2/translations/lang/*.json';
const TRANSLATE_FUNCTIONS = ['translateRaw', 'translate', 'translateMarker'];
const JSX_ELEMENTS_WITH_PROP: [string, string][] = [['Trans', 'id']];

const replaceApostrophe = (s: string) => s
  .replace(/'/g, '')
  .replace(/`/g, '')
  .replace(/"/g, '');

const findCallExpressions = (node: ts.Node, functionName: string): ts.CallExpression[] => {
  const functionsQuery = `CallExpression:has(Identifier[name="${functionName}"]):not(:has(PropertyAccessExpression))`;
  return tsquery(node, functionsQuery, { visitAllChildren: true });
};

const findIinsideTemplateCallExpressions = (node: ts.Node, functionName: string): ts.CallExpression[] => {
  const insideTemplateQuery = `JsxExpression CallExpression:has(Identifier[name="${functionName}"])`;
  return tsquery(node, insideTemplateQuery, { visitAllChildren: true });
};

const findJxsElementExpressions = (
  node: ts.Node,
  identifierArray: [string, string]
): ts.StringLiteral[] => {
  const query = `JsxSelfClosingElement:has(Identifier[name="${identifierArray[0]}"]) JsxAttribute:has(Identifier[name="${identifierArray[1]}"]) StringLiteral`;
  return tsquery(node, query, { visitAllChildren: true });
};

const getStringFromExpression = (expression: ts.Node) => {
  const text = expression.getText();

  if (
    text &&
    typeof text === 'string' &&
    text.toUpperCase() === text &&
    /^[0-9]*['"][A-Z][A-Z0-9_'"]*$/.test(text) // Ignore only digits
  ) {
    return [text];
  }
  return [];
};

const getFilesMatchingPattern = (pattern: string) =>
  glob.sync(pattern).filter((filePath: string) => {
    return fs.statSync(filePath).isFile();
  });

const extract = () => {
  console.log('Extracting... ');

  const files = getFilesMatchingPattern(path.resolve(PROJECT_FILE_PATTERN));
  let keys: string[] = [];

  files.forEach((filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const ast = tsquery.ast(fileContent, 'filePath', ts.ScriptKind.TSX);

    const callExpressions = TRANSLATE_FUNCTIONS.map(transFunc => [
      ...findCallExpressions(ast, transFunc),
      ...findIinsideTemplateCallExpressions(ast, transFunc)
    ]).flat();

    if (callExpressions.length) {
      callExpressions.forEach(callExpression => {
        const [firstArg] = callExpression.arguments;
        if (!firstArg) {
          return;
        }
        keys = [...keys, ...getStringFromExpression(firstArg)];
      });
    }

    const jsxExpressions = JSX_ELEMENTS_WITH_PROP.map(identifierArray =>
      findJxsElementExpressions(ast, identifierArray)
    ).flat();

    if (jsxExpressions.length) {
      jsxExpressions.forEach(callExpression => {
        keys = [...keys, ...getStringFromExpression(callExpression)];
      });
    }
  });

  // Get unique object
  return [...new Set(keys)]
    .map(k => replaceApostrophe(k))
    .filter(k => k.length)
    .reduce((acc, item) => ({ ...acc, [item]: '' }), {});
};

const updateTranslations = (translated: { [name: string]: string }) => {
  console.log(`Found ${Object.keys(translated).length} translation keys`);
  console.log('Updating translations...');

  const translationFilePaths = getFilesMatchingPattern(path.resolve(TRANSLATION_FILE_PATTERN));
  translationFilePaths.forEach((translationFilePath: string) => {
    const translationFileJson = JSON.parse(fs.readFileSync(translationFilePath));

    const translationJson = {
      ...translated,
      ...translationFileJson.data
    };
    translationFileJson.data = Object.keys(translationJson)
      .map(k => replaceApostrophe(k))
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: translationJson[key] || '' }), {});

    fs.writeFileSync(translationFilePath, JSON.stringify(translationFileJson, null, '\t'));
    console.log(`File ${path.basename(translationFilePath)} updated`);
  });
};

updateTranslations(extract());
