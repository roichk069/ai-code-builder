export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

export class VirtualFileSystem {
  private files: Map<string, string> = new Map();

  setFile(path: string, content: string) {
    this.files.set(path, content);
  }

  getFile(path: string): string | undefined {
    return this.files.get(path);
  }

  deleteFile(path: string) {
    this.files.delete(path);
  }

  getAllFiles(): Map<string, string> {
    return new Map(this.files);
  }

  getFileTree(): FileNode {
    const root: FileNode = {
      name: 'root',
      path: '/',
      type: 'directory',
      children: [],
    };

    const paths = Array.from(this.files.keys()).sort();

    paths.forEach((path) => {
      const parts = path.split('/').filter(Boolean);
      let currentNode = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const currentPath = '/' + parts.slice(0, index + 1).join('/');

        if (!currentNode.children) {
          currentNode.children = [];
        }

        let existingNode = currentNode.children.find((n) => n.name === part);

        if (!existingNode) {
          existingNode = {
            name: part,
            path: currentPath,
            type: isFile ? 'file' : 'directory',
            children: isFile ? undefined : [],
          };
          currentNode.children.push(existingNode);
        }

        currentNode = existingNode;
      });
    });

    return root;
  }

  clear() {
    this.files.clear();
  }

  setFiles(files: Map<string, string>) {
    this.files = new Map(files);
  }
}
