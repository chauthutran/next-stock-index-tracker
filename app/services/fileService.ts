import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const getFilePath = (fileName: string) =>
  path.join(process.cwd(), "public", "data", fileName);
let writeQueue: Promise<void> = Promise.resolve();

export const readJsonFile = async <T>(fileName: string): Promise<T> => {
  const contents = await readFile(getFilePath(fileName), "utf8");
  return JSON.parse(contents) as T;
};

export const readFileData = async <T>(fileName: string): Promise<T[]> => {
  try {
    const parsed = await readJsonFile<unknown>(fileName);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
};

export const writeDataList = async <T>(fileName: string, dataList: T[]) => {
  const filePath = getFilePath(fileName);
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(
    temporaryPath,
    `${JSON.stringify(dataList, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryPath, filePath);
};

export const updateDataList = async <T, R = T[]>(
  fileName: string,
  update: (list: T[]) => R,
): Promise<R> => {
  const operation = writeQueue.then(async () => {
    const list: T[] = await readFileData(fileName);
    const result = update(list);
    await writeDataList(fileName, list);
    return result;
  });
  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );
  return operation;
};
