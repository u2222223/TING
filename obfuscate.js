const fs = require('fs');
const { parse } = require('node-html-parser');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 读取HTML文件
function readHtmlFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// 写入文件
function writeToFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

// 深度混淆函数（使用javascript-obfuscator）
function deepObfuscateJavaScript(code) {
  // 使用javascript-obfuscator进行深度混淆
  const obfuscationResult = JavaScriptObfuscator.obfuscate(
    code,
    {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: 4000,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      renameGlobals: true,
      rotateStringArray: true,
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
      
      // 高级配置
      evalRootExpressions: true,
      functionParametersEncryption: true,
      globalConcealing: true,
      ignoreImports: false,
      inputFileName: '',
      mapCommentsToSource: false,
      mangle: true,
      mergeStrings: true,
      numbersToExpressions: true,
      optionsPreset: 'high-obfuscation',
      preventEvalTrap: true,
      restructureClasses: true,
      simplify: true,
      sourceMap: false,
      sourceMapBaseUrl: '',
      sourceMapEmbed: false,
      sourceMapFileName: '',
      sourceMapMode: 'separate',
      splitLiterals: true,
      stringArrayIndexesType: ['hexadecimal-number'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArraySelfStoring: true,
      stringArrayStorageIndex: true,
      target: 'browser',
      transformObjectKeys: true,
      unicodeArray: true
    }
  );

  return obfuscationResult.getObfuscatedCode();
}

// 主处理函数
function obfuscateScriptInHtml(htmlContent) {
  const root = parse(htmlContent);
  const scriptTags = root.querySelectorAll('script');
  
  if (scriptTags.length > 1) { // Vue脚本是第二个<script>标签
    const vueScript = scriptTags[scriptTags.length - 1]; // 第一个script是vue.js引用
    
    if (vueScript && vueScript.innerHTML.trim().includes('new Vue')) {
      const originalScript = vueScript.innerHTML;
      
      // 进行深度混淆
      const obfuscatedScript = deepObfuscateJavaScript(originalScript);
      
      // 替换原始脚本
      vueScript.innerHTML = obfuscatedScript;
      
      return root.toString();
    }
  }
  
  return htmlContent;
}

// 文件路径
const inputFilePath = 'TING_code.html';
const outputFilePath = 'index.html';

// 执行混淆
try {
  const originalHtml = readHtmlFile(inputFilePath);
  const modifiedHtml = obfuscateScriptInHtml(originalHtml);
  writeToFile(outputFilePath, modifiedHtml);
  console.log(`深度混淆完成，结果已保存至 ${outputFilePath}`);
} catch (error) {
  console.error('处理过程中发生错误:', error);
}