export type FileInfo = {
  /**
   * @description 文件id
   *
   * @type {string}
   */
  id: string;
  /**
   * @description 文件名
   *
   * @type {string}
   */
  name?: string;
  /**
   * @description 文件路径
   *
   * @type {string}
   */
  path?: string;
  /**
   * @description 文件对象
   *
   * @type {File}
   */
  file: File;
  /**
   * @description 文件url，由file转换而来,用于预览
   *
   * @type {string}
   */
  url?: string;
  /**
   * @description 文件大小
   *
   * @type {number}
   */
  size?: number;
  /**
   * @description 文件大小单位
   *
   * @type {string}
   */
  sizeUnit?: string;
  /**
   * @description 文件上传进度
   *
   * @type {number}
   */
  progress: number;
  /**
   * @description 文件上传状态
   *
   * @type {('waiting' | 'uploading' | 'success' | 'error')}
   */
  status: 'waiting' | 'uploading' | 'success' | 'error';
  links?: Record<string, any>;
};
