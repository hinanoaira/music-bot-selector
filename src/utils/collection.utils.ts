/**
 * コレクション操作のユーティリティクラス
 */
export class CollectionUtils {
  /**
   * 配列が空かどうかを判定
   * @param items - 判定対象の配列
   * @returns 配列が空の場合true
   */
  static isEmpty<T>(items: T[]): boolean {
    return items.length === 0
  }

  /**
   * 配列に要素が存在するかを判定
   * @param items - 判定対象の配列
   * @returns 配列に要素が存在する場合true
   */
  static hasItems<T>(items: T[]): boolean {
    return items.length > 0
  }

  /**
   * 配列から条件に合致する最初の要素を取得
   * @param items - 検索対象の配列
   * @param predicate - 条件判定関数
   * @returns 条件に合致する最初の要素、見つからない場合はnull
   */
  static findFirst<T>(items: T[], predicate: (item: T) => boolean): T | null {
    const found = items.find(predicate)
    return found || null
  }

  /**
   * 配列から条件に合致する要素をフィルタリング
   * @param items - フィルタリング対象の配列
   * @param predicate - 条件判定関数
   * @returns 条件に合致する要素の配列
   */
  static filter<T>(items: T[], predicate: (item: T) => boolean): T[] {
    return items.filter(predicate)
  }
}
