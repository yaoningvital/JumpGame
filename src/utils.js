export const GREY = '#ddd'
export const RED = 'red'
export const ORANGE = 'orange'
export const GREEN = 'green' // 绿
export const TEAL = 'teal' // 深青
export const BLUE = 'blue'  // 蓝
export const PURPLE = 'purple' // 紫
export const BLACK = 'black'  // 黑
export const FUCHSIA = 'fuchsia'  // 紫红
export const MAROON = 'maroon' // 褐
export const NAVY = 'navy' // 深蓝
export const OLIVE = 'olive' // 橄榄
export const BLUEVIOLET = 'BlueViolet' // 蓝紫色
export const CHOCOLATE = 'Chocolate' // 巧克力色
export const CORNFLOWERBLUE = 'CornflowerBlue' // 矢车菊蓝
export const GOLD = 'Gold' // 黄金色
export const LIGHTSLATEGRAY = 'LightSlateGray' // 浅石板灰


// var colorItem = {
//   x: 0, // 该棋子在 xyz 坐标系中 x 坐标的值
//   y: 4, // 该棋子在 xyz 坐标系中 y 坐标的值
//   z: 4, // 该棋子在 xyz 坐标系中 z 坐标的值
//   color: GREY, // 该棋子的颜色 GREY表示这个位置为空，没有放棋子
//   rowIndex: 0, // 该棋子所在的行数，从上到下是 0 到 16
//   columnIndex: 0 // 该棋子所在的列数，每行列数不一样。比如第一行只有1个元素，这一行就只有1列；第五行有13个元素，这一行就有13列，值从0到12
// }

export let circlesDefault = [ // 默认全部为灰色
  [ // 一行
    {x: 0, y: 4, z: 4, color: GREY, rowIndex: 0, columnIndex: 0},  // 一个点
  ],
  [
    {x: 1, y: 3, z: 4, color: GREY, rowIndex: 1, columnIndex: 0},
    {x: 1, y: 4, z: 5, color: GREY, rowIndex: 1, columnIndex: 1},
  ],
  [
    {x: 2, y: 2, z: 4, color: GREY, rowIndex: 2, columnIndex: 0},
    {x: 2, y: 3, z: 5, color: GREY, rowIndex: 2, columnIndex: 1},
    {x: 2, y: 4, z: 6, color: GREY, rowIndex: 2, columnIndex: 2},
  ],
  [
    {x: 3, y: 1, z: 4, color: GREY, rowIndex: 3, columnIndex: 0},
    {x: 3, y: 2, z: 5, color: GREY, rowIndex: 3, columnIndex: 1},
    {x: 3, y: 3, z: 6, color: GREY, rowIndex: 3, columnIndex: 2},
    {x: 3, y: 4, z: 7, color: GREY, rowIndex: 3, columnIndex: 3},
  ],
  [
    {x: 4, y: -4, z: 0, color: GREY, rowIndex: 4, columnIndex: 0},
    {x: 4, y: -3, z: 1, color: GREY, rowIndex: 4, columnIndex: 1},
    {x: 4, y: -2, z: 2, color: GREY, rowIndex: 4, columnIndex: 2},
    {x: 4, y: -1, z: 3, color: GREY, rowIndex: 4, columnIndex: 3},
    {x: 4, y: 0, z: 4, color: GREY, rowIndex: 4, columnIndex: 4},
    {x: 4, y: 1, z: 5, color: GREY, rowIndex: 4, columnIndex: 5},
    {x: 4, y: 2, z: 6, color: GREY, rowIndex: 4, columnIndex: 6},
    {x: 4, y: 3, z: 7, color: GREY, rowIndex: 4, columnIndex: 7},
    {x: 4, y: 4, z: 8, color: GREY, rowIndex: 4, columnIndex: 8},
    {x: 4, y: 5, z: 9, color: GREY, rowIndex: 4, columnIndex: 9},
    {x: 4, y: 6, z: 10, color: GREY, rowIndex: 4, columnIndex: 10},
    {x: 4, y: 7, z: 11, color: GREY, rowIndex: 4, columnIndex: 11},
    {x: 4, y: 8, z: 12, color: GREY, rowIndex: 4, columnIndex: 12},
  ],
  [
    {x: 5, y: -4, z: 1, color: GREY, rowIndex: 5, columnIndex: 0},
    {x: 5, y: -3, z: 2, color: GREY, rowIndex: 5, columnIndex: 1},
    {x: 5, y: -2, z: 3, color: GREY, rowIndex: 5, columnIndex: 2},
    {x: 5, y: -1, z: 4, color: GREY, rowIndex: 5, columnIndex: 3},
    {x: 5, y: 0, z: 5, color: GREY, rowIndex: 5, columnIndex: 4},
    {x: 5, y: 1, z: 6, color: GREY, rowIndex: 5, columnIndex: 5},
    {x: 5, y: 2, z: 7, color: GREY, rowIndex: 5, columnIndex: 6},
    {x: 5, y: 3, z: 8, color: GREY, rowIndex: 5, columnIndex: 7},
    {x: 5, y: 4, z: 9, color: GREY, rowIndex: 5, columnIndex: 8},
    {x: 5, y: 5, z: 10, color: GREY, rowIndex: 5, columnIndex: 9},
    {x: 5, y: 6, z: 11, color: GREY, rowIndex: 5, columnIndex: 10},
    {x: 5, y: 7, z: 12, color: GREY, rowIndex: 5, columnIndex: 11},
  ],
  [
    {x: 6, y: -4, z: 2, color: GREY, rowIndex: 6, columnIndex: 0},
    {x: 6, y: -3, z: 3, color: GREY, rowIndex: 6, columnIndex: 1},
    {x: 6, y: -2, z: 4, color: GREY, rowIndex: 6, columnIndex: 2},
    {x: 6, y: -1, z: 5, color: GREY, rowIndex: 6, columnIndex: 3},
    {x: 6, y: 0, z: 6, color: GREY, rowIndex: 6, columnIndex: 4},
    {x: 6, y: 1, z: 7, color: GREY, rowIndex: 6, columnIndex: 5},
    {x: 6, y: 2, z: 8, color: GREY, rowIndex: 6, columnIndex: 6},
    {x: 6, y: 3, z: 9, color: GREY, rowIndex: 6, columnIndex: 7},
    {x: 6, y: 4, z: 10, color: GREY, rowIndex: 6, columnIndex: 8},
    {x: 6, y: 5, z: 11, color: GREY, rowIndex: 6, columnIndex: 9},
    {x: 6, y: 6, z: 12, color: GREY, rowIndex: 6, columnIndex: 10},
  ],
  [
    {x: 7, y: -4, z: 3, color: GREY, rowIndex: 7, columnIndex: 0},
    {x: 7, y: -3, z: 4, color: GREY, rowIndex: 7, columnIndex: 1},
    {x: 7, y: -2, z: 5, color: GREY, rowIndex: 7, columnIndex: 2},
    {x: 7, y: -1, z: 6, color: GREY, rowIndex: 7, columnIndex: 3},
    {x: 7, y: 0, z: 7, color: GREY, rowIndex: 7, columnIndex: 4},
    {x: 7, y: 1, z: 8, color: GREY, rowIndex: 7, columnIndex: 5},
    {x: 7, y: 2, z: 9, color: GREY, rowIndex: 7, columnIndex: 6},
    {x: 7, y: 3, z: 10, color: GREY, rowIndex: 7, columnIndex: 7},
    {x: 7, y: 4, z: 11, color: GREY, rowIndex: 7, columnIndex: 8},
    {x: 7, y: 5, z: 12, color: GREY, rowIndex: 7, columnIndex: 9},
  ],
  [
    {x: 8, y: -4, z: 4, color: GREY, rowIndex: 8, columnIndex: 0},
    {x: 8, y: -3, z: 5, color: GREY, rowIndex: 8, columnIndex: 1},
    {x: 8, y: -2, z: 6, color: GREY, rowIndex: 8, columnIndex: 2},
    {x: 8, y: -1, z: 7, color: GREY, rowIndex: 8, columnIndex: 3},
    {x: 8, y: 0, z: 8, color: GREY, rowIndex: 8, columnIndex: 4},
    {x: 8, y: 1, z: 9, color: GREY, rowIndex: 8, columnIndex: 5},
    {x: 8, y: 2, z: 10, color: GREY, rowIndex: 8, columnIndex: 6},
    {x: 8, y: 3, z: 11, color: GREY, rowIndex: 8, columnIndex: 7},
    {x: 8, y: 4, z: 12, color: GREY, rowIndex: 8, columnIndex: 8},
  ],
  [
    {x: 9, y: -5, z: 4, color: GREY, rowIndex: 9, columnIndex: 0},
    {x: 9, y: -4, z: 5, color: GREY, rowIndex: 9, columnIndex: 1},
    {x: 9, y: -3, z: 6, color: GREY, rowIndex: 9, columnIndex: 2},
    {x: 9, y: -2, z: 7, color: GREY, rowIndex: 9, columnIndex: 3},
    {x: 9, y: -1, z: 8, color: GREY, rowIndex: 9, columnIndex: 4},
    {x: 9, y: 0, z: 9, color: GREY, rowIndex: 9, columnIndex: 5},
    {x: 9, y: 1, z: 10, color: GREY, rowIndex: 9, columnIndex: 6},
    {x: 9, y: 2, z: 11, color: GREY, rowIndex: 9, columnIndex: 7},
    {x: 9, y: 3, z: 12, color: GREY, rowIndex: 9, columnIndex: 8},
    {x: 9, y: 4, z: 13, color: GREY, rowIndex: 9, columnIndex: 9},
  ],
  [
    {x: 10, y: -6, z: 4, color: GREY, rowIndex: 10, columnIndex: 0},
    {x: 10, y: -5, z: 5, color: GREY, rowIndex: 10, columnIndex: 1},
    {x: 10, y: -4, z: 6, color: GREY, rowIndex: 10, columnIndex: 2},
    {x: 10, y: -3, z: 7, color: GREY, rowIndex: 10, columnIndex: 3},
    {x: 10, y: -2, z: 8, color: GREY, rowIndex: 10, columnIndex: 4},
    {x: 10, y: -1, z: 9, color: GREY, rowIndex: 10, columnIndex: 5},
    {x: 10, y: 0, z: 10, color: GREY, rowIndex: 10, columnIndex: 6},
    {x: 10, y: 1, z: 11, color: GREY, rowIndex: 10, columnIndex: 7},
    {x: 10, y: 2, z: 12, color: GREY, rowIndex: 10, columnIndex: 8},
    {x: 10, y: 3, z: 13, color: GREY, rowIndex: 10, columnIndex: 9},
    {x: 10, y: 4, z: 14, color: GREY, rowIndex: 10, columnIndex: 10},
  ],
  [
    {x: 11, y: -7, z: 4, color: GREY, rowIndex: 11, columnIndex: 0},
    {x: 11, y: -6, z: 5, color: GREY, rowIndex: 11, columnIndex: 1},
    {x: 11, y: -5, z: 6, color: GREY, rowIndex: 11, columnIndex: 2},
    {x: 11, y: -4, z: 7, color: GREY, rowIndex: 11, columnIndex: 3},
    {x: 11, y: -3, z: 8, color: GREY, rowIndex: 11, columnIndex: 4},
    {x: 11, y: -2, z: 9, color: GREY, rowIndex: 11, columnIndex: 5},
    {x: 11, y: -1, z: 10, color: GREY, rowIndex: 11, columnIndex: 6},
    {x: 11, y: 0, z: 11, color: GREY, rowIndex: 11, columnIndex: 7},
    {x: 11, y: 1, z: 12, color: GREY, rowIndex: 11, columnIndex: 8},
    {x: 11, y: 2, z: 13, color: GREY, rowIndex: 11, columnIndex: 9},
    {x: 11, y: 3, z: 14, color: GREY, rowIndex: 11, columnIndex: 10},
    {x: 11, y: 4, z: 15, color: GREY, rowIndex: 11, columnIndex: 11},
  ],
  [
    {x: 12, y: -8, z: 4, color: GREY, rowIndex: 12, columnIndex: 0},
    {x: 12, y: -7, z: 5, color: GREY, rowIndex: 12, columnIndex: 1},
    {x: 12, y: -6, z: 6, color: GREY, rowIndex: 12, columnIndex: 2},
    {x: 12, y: -5, z: 7, color: GREY, rowIndex: 12, columnIndex: 3},
    {x: 12, y: -4, z: 8, color: GREY, rowIndex: 12, columnIndex: 4},
    {x: 12, y: -3, z: 9, color: GREY, rowIndex: 12, columnIndex: 5},
    {x: 12, y: -2, z: 10, color: GREY, rowIndex: 12, columnIndex: 6},
    {x: 12, y: -1, z: 11, color: GREY, rowIndex: 12, columnIndex: 7},
    {x: 12, y: 0, z: 12, color: GREY, rowIndex: 12, columnIndex: 8},
    {x: 12, y: 1, z: 13, color: GREY, rowIndex: 12, columnIndex: 9},
    {x: 12, y: 2, z: 14, color: GREY, rowIndex: 12, columnIndex: 10},
    {x: 12, y: 3, z: 15, color: GREY, rowIndex: 12, columnIndex: 11},
    {x: 12, y: 4, z: 16, color: GREY, rowIndex: 12, columnIndex: 12},
  ],
  [
    {x: 13, y: -4, z: 9, color: GREY, rowIndex: 13, columnIndex: 0},
    {x: 13, y: -3, z: 10, color: GREY, rowIndex: 13, columnIndex: 1},
    {x: 13, y: -2, z: 11, color: GREY, rowIndex: 13, columnIndex: 2},
    {x: 13, y: -1, z: 12, color: GREY, rowIndex: 13, columnIndex: 3},
  ],
  [
    {x: 14, y: -4, z: 10, color: GREY, rowIndex: 14, columnIndex: 0},
    {x: 14, y: -3, z: 11, color: GREY, rowIndex: 14, columnIndex: 1},
    {x: 14, y: -2, z: 12, color: GREY, rowIndex: 14, columnIndex: 2},
  ],
  [
    {x: 15, y: -4, z: 11, color: GREY, rowIndex: 15, columnIndex: 0},
    {x: 15, y: -3, z: 12, color: GREY, rowIndex: 15, columnIndex: 1},
  ],
  [
    {x: 16, y: -4, z: 12, color: GREY, rowIndex: 16, columnIndex: 0},
  ]
]


export const COLORS = [
  RED,
  ORANGE,
  GOLD,
  GREEN,
  TEAL,
  BLUE,
  PURPLE,
  BLACK,
  
  MAROON,
  FUCHSIA,
  CHOCOLATE,
  OLIVE,
  CORNFLOWERBLUE,
  NAVY,
  BLUEVIOLET,
  LIGHTSLATEGRAY
]

/**
 * 返回当前已选择的颜色组成的数组 ['red','orange',...]
 * @param availableColors : 颜色面板数组
 * @returns {[]}
 */
export function getChoosedColorArr (availableColors) {
  let choosedColors = []
  for (let colorItem of availableColors) {
    if (colorItem.checked) {
      choosedColors.push(colorItem.colorValue)
    }
  }
  
  return choosedColors
}


