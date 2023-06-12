export declare namespace Notice {
  interface NoticeInfo {
    id?: string;
    title?: string;
    content?: string;
    type: 'success' | 'info' | 'warning' | 'error';
    typeClass?: string;
    typeIcon?: string;
    duration?: number;
    timer?: any;
  }

  interface Notice {
    create: (info: NoticeInfo) => void;
    success: (info: Omit<NoticeInfo, 'type'> | string) => void;
    info: (info: Omit<NoticeInfo, 'type'> | string) => void;
    warning: (info: Omit<NoticeInfo, 'type'> | string) => void;
    error: (info: Omit<NoticeInfo, 'type'> | string) => void;
  }
}
