import { readFileSync } from 'fs';

export function getFiles(infoList: any) {
  const fileInfoList = infoList.map((info: any) => {
    const file = readFileSync(info.path);
    return {
      ...info,
      file,
    };
  });

  return fileInfoList;
}

export function base64ToBuffer(base64String: string) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  return buffer;
}
