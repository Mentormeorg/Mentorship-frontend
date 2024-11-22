// @Pipe({
//     name: 'flag',
//     pure: true,
// })
// export class FlagPipe implements PipeTransform {
//     private readonly flagUrl = 'https://flagcdn.com';
//     private readonly extension: imageExtensions = 'png';
//     private readonly size: String = '24x18';
//     transform(value: string | undefined, ...args: unknown[]): string | null {
//         if (!value) {
//             return null;
//         } else {
//             return `${this.flagUrl}/${this.size}/${value.toLocaleLowerCase()}.${
//                 this.extension
//             }`;
//         }
//     }
// }
