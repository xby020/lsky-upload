import { defineStore } from 'pinia';
import cookies from '@/utils/cookies';
import Dayjs from 'dayjs';
import { request } from '@/utils/http/axios';
import { LskyStrategy } from '@/types/user';
import { UploadInfo } from '@/types/upload';
import lodash from 'lodash';
import { UserInfo } from 'os';
import { FileInfo } from '@/types/files';
import { AlbumsQueryParams, AlbumsQueryResponse } from '@/types/lsky';

export interface User {
  token: string;
  email: string;
  password: string;
  baseUrl: string;
  name: string;
  avatar: string;
  capacity: number;
  used_capacity: number;
  image_num: number;
  album_num: number;
  choosenStrategy: number;
}

interface UserState extends User {
  rev: string;
}

function dbSet(data: User, rev: string) {
  const dbResult = utools.db.put({
    _id: 'user',
    data: data,
    _rev: rev,
  });
  return dbResult;
}

function dbGet() {
  const dbResult = utools.db.get('user');
  if (dbResult) {
    return {
      rev: dbResult._rev || '',
      data: dbResult.data as User,
    };
  } else {
    return null;
  }
}

interface CostomResponse {
  status: boolean;
  message: string;
  data?: any;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => {
    const state = {
      rev: '',
      token: '',
      email: '',
      password: '',
      baseUrl: '',
      name: '',
      avatar: '',
      capacity: 0,
      used_capacity: 0,
      image_num: 0,
      album_num: 0,
      choosenStrategy: 0,
    };

    const dbResult = dbGet();
    if (dbResult) {
      state.rev = dbResult.rev;
      Object.assign(state, dbResult.data);
    }

    return state;
  },
  getters: {},
  actions: {
    async req<T = Record<string, any>>(options: {
      url: string;
      method: 'get' | 'post' | 'put' | 'delete';
      data?: any;
      params?: any;
      [key: string]: any;
    }): Promise<T> {
      try {
        const baseOption = {
          baseURL: this.baseUrl,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        };
        const finalOptions = lodash.merge(baseOption, options);
        const res = await request<CostomResponse>(finalOptions);

        if (res.status) {
          return res.data as T;
        } else {
          window.$notice.error(res.message);
          throw new Error(res.message);
        }
      } catch (err) {
        throw new Error();
      }
    },
    save() {
      // 获取去掉rev的this.$state
      const { rev, ...state } = this.$state;
      // 保存到数据库
      const result = dbSet(state, rev);
      // 更新rev
      if (result.rev) {
        this.rev = result.rev;
      } else {
        throw new Error('保存失败');
      }
    },
    async login() {
      const { token, email, password, baseUrl } = this;
      if (!baseUrl) {
        window.$notice.warning('请设置接口地址');
        return false;
      }
      if (!email || !password) {
        window.$notice.warning('请先设置邮箱和密码');
        return false;
      }

      const res = await this.req<{ token: string }>({
        url: '/tokens',
        method: 'post',
        data: {
          email,
          password,
        },
      });

      if (res.token) {
        this.token = res.token;
        this.save();
        return true;
      }
    },
    async getProfile() {
      const { token, email, password, baseUrl } = this;
      if (!baseUrl) {
        window.$notice.warning('请设置接口地址');
        return false;
      }
      if (!email || !password) {
        window.$notice.warning('请先设置邮箱和密码');
        return false;
      }
      const res = await this.req({
        url: '/profile',
        method: 'get',
      });
      this.name = res.name;
      this.avatar = res.avatar;
      this.capacity = res.capacity;
      this.used_capacity = res.used_capacity;
      this.image_num = res.image_num;
      this.album_num = res.album_num;

      this.save();
    },
    async getStrategies() {
      const { token, email, password, baseUrl } = this;
      if (!baseUrl) {
        window.$notice.warning('请设置接口地址');
        return false;
      }
      if (!email || !password) {
        window.$notice.warning('请先设置邮箱和密码');
        return false;
      }
      const res = await this.req<{ strategies: LskyStrategy[] }>({
        url: '/strategies',
        method: 'get',
      });
      const strategies = res.strategies;

      // 默认选中第一个策略
      if (this.choosenStrategy === 0 && strategies.length > 0) {
        this.choosenStrategy = strategies[0].id;
      }

      this.save();
      return strategies;
    },
    async uploadImg(file: FileInfo, strategyId: number) {
      const { token, email, password, baseUrl } = this;
      if (!baseUrl) {
        window.$notice.warning('请设置接口地址');
        return false;
      }
      if (!email || !password) {
        window.$notice.warning('请先设置邮箱和密码');
        return false;
      }
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('strategy_id', strategyId.toString());
      console.log(formData);

      const res = await this.req<UploadInfo>({
        url: 'upload',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          file.progress = percentCompleted;
        },
      });

      return res;
    },
    async getAlbums(options: AlbumsQueryParams) {
      const { token, email, password, baseUrl } = this;
      if (!baseUrl) {
        window.$notice.warning('请设置接口地址');
        return false;
      }
      if (!email || !password) {
        window.$notice.warning('请先设置邮箱和密码');
        return false;
      }
      const res = await this.req<AlbumsQueryResponse>({
        url: '/albums',
        method: 'get',
        params: options,
      });
      return res.data;
    },
    async getImages(options: any) {
      const { token, email, password, baseUrl } = this;
      if (!baseUrl) {
        window.$notice.warning('请设置接口地址');
        return false;
      }
      if (!email || !password) {
        window.$notice.warning('请先设置邮箱和密码');
        return false;
      }
      const res = await this.req({
        url: '/images',
        method: 'get',
        params: options,
      });
      return res;
    },
  },
});
