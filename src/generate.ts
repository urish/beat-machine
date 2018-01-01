import 'core-js/es7/reflect';
import 'zone.js/dist/zone-node';

import * as fs from 'fs';
import * as path from 'path';

import { CompilerFactory, Compiler, enableProdMode } from '@angular/core';
import { renderModule, platformDynamicServer, renderModuleFactory } from '@angular/platform-server';
import { ResourceLoader } from '@angular/compiler';

import { AppServerModule } from './app/app-server.module';

// workaround for https://github.com/angular/universal/issues/844
(global as any).Event = null;
(global as any).document = null;

export class FileSystemResourceLoader extends ResourceLoader {
  get(url: string): string {
    console.log('get', url);
    const templatePath = path.join(__dirname, url);
    return fs.readFileSync(templatePath, 'utf-8');
  }
}

enableProdMode();

async function main() {
  const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);
  const compiler: Compiler = compilerFactory.createCompiler([{
    providers: [
      { provide: ResourceLoader, useClass: FileSystemResourceLoader, deps: [], },
    ]
  }]);
  const factory = await compiler.compileModuleAsync(AppServerModule)

  renderModuleFactory(factory, {
    document: fs.readFileSync(path.join(__dirname, '../dist/index.html')).toString('utf-8')
  }).then((result: string) => {
    fs.writeFileSync(path.join(__dirname, '../dist/index.html'), result, { encoding: 'utf-8' });
  });
}

main();
