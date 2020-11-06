import { ViewModel } from '@utils';

/**
 * 参数
 */
export class UserRegionViewModel extends ViewModel {
    /**
     * 区域拼音
     */
    pinyin: string;
    /**
     * 区域名称
     */
    region: Array<UserRegionItemViewModel>;
}

export class UserRegionItemViewModel {
    /**
     * 代码
     */
    code: string;
    /**
     * 名称
     */
    name: string;
}
