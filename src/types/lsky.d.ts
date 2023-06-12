/**
 * page	Integer	页码
order	String	排序方式，newest=最新，earliest=最早，most=图片最多，least=图片最少
keyword	String	筛选关键字
 */
export type AlbumsQueryParams = {
  page: number;
  order: 'newest' | 'earliest' | 'most' | 'least';
  keyword: string;
};

/**
 * current_page	Integer	当前所在页页码
last_page	Integer	最后一页页码
per_page	Integer	每页展示数据数量
total	Integer	图片总数量
data	Object[]	相册列表
id	Integer	相册自增 ID
name	String	相册名称
intro	String	相册简介
image_num	Integer	相册图片数量
 */

export type AlbumsQueryResponse = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: {
    id: number;
    name: string;
    intro: string;
    image_num: number;
  }[];
};
