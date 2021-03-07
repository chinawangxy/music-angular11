import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(time: number): any {
    if (!time) {
      return '00:00';
    }
    // 向下取整
    const temp = time | 0;
    // 向下取整
    const minute = (temp / 60) | 0;
    // 秒 转 字符串 前置补零
    const second = (temp % 60).toString().padStart(2, '0');
    return `${minute}:${second}`;
  }
}
