declare const utool: UToolsApi;

declare module 'grade-js' {
  import Grade from 'grade-js';
  export = Grade;
}
interface Window {
  $notice: Notice.Notice;
}
