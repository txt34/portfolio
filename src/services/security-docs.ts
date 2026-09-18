import fs from 'fs';
import path from 'path';

export interface DocItem {
  path: string;
  name: string;
}

export interface SecurityDocsCatalog {
  security: DocItem[];
  serverSecurity: DocItem[];
  deployment: DocItem[];
  accessibility: DocItem[];
}

export class SecurityDocsService {
  private static getMarkdownFiles(dir: string, base: string = ''): DocItem[] {
    let results: DocItem[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of list) {
      const resPath = path.resolve(dir, file.name);
      const relativePath = path.join(base, file.name).replace(/\\/g, '/');
      if (file.isDirectory()) {
        results = results.concat(SecurityDocsService.getMarkdownFiles(resPath, relativePath));
      } else if (file.name.endsWith('.md')) {
        results.push({ path: relativePath, name: file.name });
      }
    }
    return results;
  }

  public static getCatalog(rootDir: string): SecurityDocsCatalog {
    return {
      security: SecurityDocsService.getMarkdownFiles(path.join(rootDir, 'security'), 'security'),
      serverSecurity: SecurityDocsService.getMarkdownFiles(path.join(rootDir, 'server', 'security'), 'server/security'),
      deployment: SecurityDocsService.getMarkdownFiles(path.join(rootDir, 'deployment'), 'deployment'),
      accessibility: SecurityDocsService.getMarkdownFiles(path.join(rootDir, 'accessibility'), 'accessibility')
    };
  }
}
