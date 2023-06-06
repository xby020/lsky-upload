import { readFileSync } from 'fs';

export function getFiles(infoList: any): File[] {
  const fileInfoList = infoList.map((info: any) => {
    const fileBuffer = readFileSync(info.path);
    const file = new File([fileBuffer], info.name);
    return file;
  });
  return fileInfoList;
}

/**
 * @description 生成由数字和字母组成的12位随机id
 *
 * @export
 */
export function getRandomId() {
  let id = '';
  for (let i = 0; i < 12; i++) {
    const randomNum = Math.floor(Math.random() * 36);
    if (randomNum < 10) {
      id += randomNum;
    } else {
      id += String.fromCharCode(randomNum + 87);
    }
  }
  return id;
}

export function getFileNameFromPath(path: string) {
  const pathSplit = path.split('\\');
  const fileName = pathSplit[pathSplit.length - 1];
  return fileName;
}

export function base64ToBuffer(base64String: string) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  return buffer;
}
