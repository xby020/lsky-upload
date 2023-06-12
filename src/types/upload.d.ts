export interface UploadInfo {
  /** 图片唯一密钥 */
  key: string;
  /** 图片名称 */
  name: string;
  /** 图片路径名 */
  pathname: string;
  /** 图片原始名 */
  origin_name: string;
  /** 图片大小,单位 KB */
  size: number;
  /** 图片类型 */
  mimetype: string;
  /** 图片拓展名 */
  extension: string;
  /** 图片 md5 值 */
  md5: string;
  /** 图片 sha1 值 */
  sha1: string;
  /** 链接 */
  links: {
    /** 图片访问 url */
    url: string;
    /** - */
    html: string;
    /** - */
    bbcode: string;
    /** - */
    markdown: string;
    /** - */
    markdown_with_link: string;
    /** 缩略图 url */
    thumbnail_url: string;
  };
}
