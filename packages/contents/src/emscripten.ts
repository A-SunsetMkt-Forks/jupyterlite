// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Types and implementation inspired from https://github.com/jvilk/BrowserFS
// LICENSE: https://github.com/jvilk/BrowserFS/blob/8977a704ea469d05daf857e4818bef1f4f498326/LICENSE
// And from https://github.com/gzuidhof/starboard-notebook

// LICENSE: https://github.com/gzuidhof/starboard-notebook/blob/cd8d3fc30af4bd29cdd8f6b8c207df8138f5d5dd/LICENSE

/**
 * Types for Emscripten primitives.
 *
 * Ideally, much more of these would be taken from `@types/emscripten`.
 */

type EmscriptenFS = typeof FS;

export const DIR_MODE = 16895; // 040777
export const FILE_MODE = 33206; // 100666
export const SEEK_CUR = 1;
export const SEEK_END = 2;

export interface IStats {
  dev: number;
  ino?: number;
  mode?: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atime: Date | string;
  mtime: Date | string;
  ctime: Date | string;
  timestamp?: number;
}

export interface IEmscriptenFSNode {
  id: number;
  name: string;
  mode: number;
  parent: IEmscriptenFSNode;
  mount: { opts: { root: string } };
  stream_ops: IEmscriptenStreamOps;
  node_ops: IEmscriptenNodeOps;
  timestamp: number;
}

export interface IEmscriptenStream {
  node: IEmscriptenFSNode;
  nfd: any;
  flags: string;
  position: number;
}

export function instanceOfStream(
  nodeOrStream: IEmscriptenFSNode | IEmscriptenStream,
): nodeOrStream is IEmscriptenStream {
  return 'node' in nodeOrStream;
}

export interface IEmscriptenNodeOps {
  getattr(node: IEmscriptenFSNode | IEmscriptenStream): IStats;
  setattr(node: IEmscriptenFSNode | IEmscriptenStream, attr: IStats): void;
  lookup(
    parent: IEmscriptenFSNode | IEmscriptenStream,
    name: string,
  ): IEmscriptenFSNode;
  mknod(
    parent: IEmscriptenFSNode | IEmscriptenStream,
    name: string,
    mode: number,
    dev: number,
  ): IEmscriptenFSNode;
  rename(
    oldNode: IEmscriptenFSNode | IEmscriptenStream,
    newDir: IEmscriptenFSNode | IEmscriptenStream,
    newName: string,
  ): void;
  unlink(parent: IEmscriptenFSNode | IEmscriptenStream, name: string): void;
  rmdir(parent: IEmscriptenFSNode | IEmscriptenStream, name: string): void;
  readdir(node: IEmscriptenFSNode | IEmscriptenStream): string[];
  symlink(
    parent: IEmscriptenFSNode | IEmscriptenStream,
    newName: string,
    oldPath: string,
  ): void;
  readlink(node: IEmscriptenFSNode | IEmscriptenStream): string;
}

export interface IEmscriptenStreamOps {
  open(stream: IEmscriptenStream): void;
  close(stream: IEmscriptenStream): void;
  read(
    stream: IEmscriptenStream,
    buffer: Uint8Array,
    offset: number,
    length: number,
    position: number,
  ): number;
  write(
    stream: IEmscriptenStream,
    buffer: Uint8Array,
    offset: number,
    length: number,
    position: number,
  ): number;
  llseek(stream: IEmscriptenStream, offset: number, whence: number): number;
}

/**
 * The emscripten filesystem module API.
 */
export type FS = EmscriptenFS & {
  ErrnoError: any;
  createNode: (
    parent: IEmscriptenFSNode | null,
    name: string,
    mode: number,
    dev: number,
  ) => IEmscriptenFSNode;
};

/**
 * The emscripten filesystem error codes.
 */
export type ERRNO_CODES = any;

/**
 * The emscripten FS Path API.
 */
export type PATH = {
  basename: (path: string) => string;
  dirname: (path: string) => string;
  join: (...parts: string[]) => string;
  join2: (l: string, r: string) => string;
  normalize: (path: string) => string;
  splitPath: (filename: string) => string;
};
