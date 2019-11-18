import React from 'react'
import Board from './Board'
import '../index.scss'
import { circlesDefault, COLORS } from '../utils'
import clickAudio from '../assets/audio/click02.wav'

import _ from 'lodash'


class Game extends React.Component {
  constructor (props) {
    super(props)
    this.setCircleRadius = this.setCircleRadius.bind(this)
    this.setCirclesDistance = this.setCirclesDistance.bind(this)
    this.handleRotateDirectionChange = this.handleRotateDirectionChange.bind(this)
    this.setRotateDegNum = this.setRotateDegNum.bind(this)
    
    this.state = {
      r: 20, // 棋子半径
      a: 20, // 棋子与同轴线上相邻棋子边缘的最短距离
      playing: false, // 游戏是否正在进行中
      circlesOrigin: circlesDefault,
      history: [
        { // 一条棋盘棋子布局的记录
          circles: circlesDefault
        },
      ],
      currentStep: 0,
      playerNum: 0,// 当前玩家数
      checked: false,
      boardRotateDirection: '+', // 棋盘旋转的方向（顺时针+ ，逆时针-）
      boardRotateDegNum: 0, // 棋盘旋转的角度
      availableColors: this.initAvailableColors(COLORS), // 可选颜色数组
    }
  }
  
  render () {
    let currentCircles = this.state.history[this.state.currentStep].circles
    
    return (
      <div className="game">
        <div className="board-wrap">
          <Board
            circles={currentCircles}
            handleClickCircle={() => this.handleClickCircle()}
            r={this.state.r}
            a={this.state.a}
            direction={this.state.boardRotateDirection}
            degNum={this.state.boardRotateDegNum}
          />
        </div>
        
        <div className="btns">
          <audio src={clickAudio} id="click-audio">
            您的浏览器不支持 audio 标签。
          </audio>
          
          <div className="set-radius">
            <h4>设置棋子半径大小：（默认20px）</h4>
            <input type="text"
                   onKeyUp={this.setCircleRadius}/><span> px</span>
          </div>
          
          <div>
            <h4>设置相邻棋子之间的距离：（默认20px）</h4>
            <input type="text"
                   onKeyUp={this.setCirclesDistance}
            />
            <span> px</span>
          </div>
          
          <div className="player-num">
            <h4>请选择玩家数</h4>
            <p>当前玩家数：{this.state.playerNum} 人</p>
            {
              [1, 2, 3, 4, 5, 6].map((playerNum) => {
                return (
                  <button
                    key={playerNum}
                    onClick={() => this.choosePlayerNum(playerNum)}
                  >{playerNum}人玩</button>
                )
              })
            }
          </div>
          
          <div>
            <h4>请选择棋子颜色</h4>
            <div className="circles-color-wrap">
              {
                this.state.availableColors.map((colorItem, index) => {
                  return (
                    <div key={index}
                         className="color-item">
                      <input
                        type="checkbox"
                        onChange={() => this.chooseCircleColor(colorItem.colorValue)}
                        checked={colorItem.checked}
                        disabled={!this.state.playerNum || colorItem.disabled}
                      />
                      <button
                        style={{
                          opacity: (!this.state.playerNum || colorItem.disabled) ? 0.4 : 1,
                          backgroundImage: `radial-gradient(at 80px 80px, rgba(0,0,0,0), ${colorItem.colorValue})`
                        }}
                        onClick={() => this.chooseCircleColor(colorItem.colorValue)}
                        disabled={!this.state.playerNum || colorItem.disabled}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
          
          <div className="rotate-board">
            <h4>旋转棋盘</h4>
            <div className="btn-wrap">
              <select name="" id="" onChange={this.handleRotateDirectionChange}>
                <option value="+">顺时针</option>
                <option value="-">逆时针</option>
              </select>
              <input type="number"
                     placeholder="请输入旋转角度"
                     onKeyUp={this.setRotateDegNum}
              />
              <span> °</span>
            </div>
            <div className="rotate-preset">
              <div>
                <button onClick={() => this.handleRotate('+', 60)}>顺时针转60°</button>
                <button onClick={() => this.handleRotate('+', 120)}>顺时针转120°</button>
                <button onClick={() => this.handleRotate('+', 180)}>顺时针转180°</button>
              </div>
              <div>
                <button onClick={() => this.handleRotate('-', 60)}>逆时针转60°</button>
                <button onClick={() => this.handleRotate('-', 120)}>逆时针转120°</button>
                <button onClick={() => this.handleRotate('-', 180)}>逆时针转180°</button>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    )
  }
  
  // var availableColors=[
  //   {
  //     colorValue:'red',
  //     checked:false,
  //     disabled:false
  //   }
  // ]
  
  /**
   * 初始化 this.state.availableColors
   * @param colors
   * @returns {[]}
   */
  initAvailableColors (colors) {
    let availableColors = []
    
    for (let color of colors) {
      let o = {
        colorValue: color,
        checked: false,
        disabled: false,
      }
      availableColors.push(o)
    }
    
    return availableColors
  }
  
  
  /**
   * 处理点击 选择玩家数
   * @param playerNum ：要选择的玩家数
   */
  choosePlayerNum (playerNum) {
    if (this.state.playing) return // 游戏还没开始，才可以选择玩家数量
    
    let availableColors = _.cloneDeep(this.state.availableColors)
    
    // 拿到颜色面板中 已经选择的颜色
    let choosedColorsArr = this.getChoosedColorArr(availableColors)
    
    if (choosedColorsArr.length === playerNum) return
    
    // A : 如果 已选择颜色数量 > 新给定的玩家数，自动将已选择的颜色中后边多余数量的丢弃
    if (choosedColorsArr.length > playerNum) {
      
      // 拿到 最后剩余的 要选择的 颜色数组 newColorsArr
      let newColorsArr = choosedColorsArr.slice(0, playerNum)
      
      // 1、更新颜色面板 checked
      for (let colorItem of availableColors) {
        if (colorItem.checked && !newColorsArr.includes(colorItem.colorValue)) {
          colorItem.checked = false
        }
      }
      
      // 2、更新颜色面板 disabled
      availableColors = this.updateDisabled(availableColors, playerNum)
      
      // 3、更新棋盘中棋子的颜色
      this.updateCirclesColorInBoard(newColorsArr)
      
    }
    // B : 如果 已选择颜色数量 < 新给定的玩家数
    else {
      // 1、颜色面板 checked 状态 不用更新
      // 2、更新颜色面板 disabled
      availableColors = this.updateDisabled(availableColors, playerNum)
      // 3、棋盘中棋子的颜色不用更新
    }
    
    // 4、更新显示的“当前玩家数”
    this.setState({
      playerNum,
      availableColors
    })
    
  }
  
  /**
   *
   * @param availableColors : 要更新disabled状态的颜色面板数组
   * @param currentPlayerNum : 当前的玩家数
   * @returns {*} :更新disabled状态之后的颜色面板数组
   */
  updateDisabled (availableColors, currentPlayerNum) {
    let choosedColorsArr = this.getChoosedColorArr(availableColors) // 已选择的颜色组成的数组
    let canAddColor; // 是否可以继续追加颜色
    
    canAddColor = !(choosedColorsArr.length >= currentPlayerNum)
    
    // 如果不能再追加勾选颜色了，把其他没选上的都设置为 disabled=true
    if (!canAddColor) {
      for (let colorItem of availableColors) {
        if (!colorItem.checked) {
          colorItem.disabled = true
        }
      }
    }
    // 还能再追加颜色，让所有颜色的 disabled 都为 false
    else {
      for (let colorItem of availableColors) {
        colorItem.disabled = false
      }
    }
    
    return availableColors
  }
  
  /**
   * 返回当前已选择的颜色组成的数组
   * @param availableColors : 颜色面板数组
   * @returns {[]}
   */
  getChoosedColorArr (availableColors) {
    let choosedColors = []
    for (let colorItem of availableColors) {
      if (colorItem.checked) {
        choosedColors.push(colorItem.colorValue)
      }
    }
    
    return choosedColors
  }
  
  /**
   * 播放棋盘中棋子放下的声音
   */
  handleClickCircle () {
    let audioEle = document.getElementById('click-audio')
    audioEle.play()
  }
  
  
  // 设置棋子半径r
  setCircleRadius (e) {
    let r = Number(e.target.value.trim())
    if (e.keyCode === 13 && !isNaN(r)) {
      this.setState({
        r
      })
    }
  }
  
  // 设置相邻棋子之间的距离
  setCirclesDistance (e) {
    let a = Number(e.target.value.trim())
    if (e.keyCode === 13 && !isNaN(a)) {
      this.setState({
        a
      })
    }
  }
  
  // 棋盘旋转方向变化
  handleRotateDirectionChange (e) {
    this.setState({
      boardRotateDirection: e.target.value
    })
  }
  
  // 设置旋转角度
  setRotateDegNum (e) {
    let deg = Number(e.target.value.trim())
    if (e.keyCode === 13 && !isNaN(deg)) {
      this.setState({
        boardRotateDegNum: deg
      })
    }
  }
  
  // 点击预设旋转按钮
  handleRotate (boardRotateDirection, boardRotateDegNum) {
    this.setState({
      boardRotateDirection,
      boardRotateDegNum
    })
  }
  
  /**
   * 处理点击颜色面板的某个颜色
   * @param color : 点击的颜色
   */
  chooseCircleColor (color) {
    let availableColors = _.cloneDeep(this.state.availableColors)
    
    // 1、更新 颜色面板 checked 状态
    for (let colorItem of availableColors) {
      if (colorItem.colorValue === color) {
        colorItem.checked = !colorItem.checked
        break
      }
    }
    
    // 2、更新 disabled
    availableColors = this.updateDisabled(availableColors, this.state.playerNum)
    
    // 3、更新 棋盘中棋子的颜色
    let choosedColors = this.getChoosedColorArr(availableColors)
    this.updateCirclesColorInBoard(choosedColors)
    
    this.setState({
      availableColors
    })
    
  }
  
  /**
   *  根据当前颜色面板中选择的颜色，更新棋盘中棋子的颜色。游戏开始后就不能更改棋盘中棋子的颜色了
   * @param choosedColors : 颜色面板中已经选择的颜色值组成的数组
   */
  updateCirclesColorInBoard (choosedColors) {
    if (this.state.playing) return
    
    // 将所有棋子重置为默认状态，然后再设置 已选择的颜色
    this.setState({
      history: [
        {
          circles: circlesDefault
        }
      ]
    }, () => {
      // 此时的 this.state.history[0].circles 一定为 circlesDefault ；也可用：
      // let circles=_.cloneDeep(circlesDefault)
      let circles = _.cloneDeep(this.state.history[0].circles)
      
      // 1、选择的颜色数为 0，则棋盘中棋子颜色不需更新
      if (choosedColors.length === 0) return
      
      // 2、选择了 1 个颜色，设置 南边10子
      if (choosedColors.length === 1) {
        for (let i = circles.length - 4; i < circles.length; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[0]
          }
        }
      }
      // 3、选择了 2 个颜色，设置 南边10子 和 北边10子
      else if (choosedColors.length === 2) {
        // 设置 南边10子
        for (let i = circles.length - 4; i < circles.length; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[0]
          }
        }
        // 设置 北边10子
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[1]
          }
        }
      }
      // 4、选择了 3 个颜色，设置 南边10子 、西北边10子 、 东北边10子
      else if (choosedColors.length === 3) {
        // 设置 南边10子
        for (let i = circles.length - 4; i < circles.length; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[0]
          }
        }
        // 设置 西北边10子
        for (let i = 4; i < 8; i++) {
          for (let j = 0; j < 8 - i; j++) {
            circles[i][j].color = choosedColors[1]
          }
        }
        // 设置 东北边10子
        for (let i = 4; i < 8; i++) {
          for (let j = 9; j < 17 - i; j++) {
            circles[i][j].color = choosedColors[2]
          }
        }
      }
      // 5、选择了 4 个颜色，设置 南边10子 、西南边10子 、北边10子、 东北边10子
      else if (choosedColors.length === 4) {
        // 设置 南边10子
        for (let i = circles.length - 4; i < circles.length; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[0]
          }
        }
        // 设置 西南边10子
        for (let i = 9; i < 13; i++) {
          for (let j = 0; j < i - 8; j++) {
            circles[i][j].color = choosedColors[1]
          }
        }
        // 设置 北边10子
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[2]
          }
        }
        // 设置 东北边10子
        for (let i = 4; i < 8; i++) {
          for (let j = 9; j < 17 - i; j++) {
            circles[i][j].color = choosedColors[3]
          }
        }
      }
      // 6、选择了 5 个颜色，设置 南边10子 、西南边10子 、西北边10子、北边10子、 东北边10子
      else if (choosedColors.length === 5) {
        // 设置 南边10子
        for (let i = circles.length - 4; i < circles.length; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[0]
          }
        }
        // 设置 西南边10子
        for (let i = 9; i < 13; i++) {
          for (let j = 0; j < i - 8; j++) {
            circles[i][j].color = choosedColors[1]
          }
        }
        // 设置 西北边10子
        for (let i = 4; i < 8; i++) {
          for (let j = 0; j < 8 - i; j++) {
            circles[i][j].color = choosedColors[2]
          }
        }
        // 设置 北边10子
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[3]
          }
        }
        // 设置 东北边10子
        for (let i = 4; i < 8; i++) {
          for (let j = 9; j < 17 - i; j++) {
            circles[i][j].color = choosedColors[4]
          }
        }
      }
      // 7、选择了 6 个颜色，设置 南边10子 、西南边10子 、西北边10子、北边10子、 东北边10子、东南边10子
      else if (choosedColors.length === 6) {
        // 设置 南边10子
        for (let i = circles.length - 4; i < circles.length; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[0]
          }
        }
        // 设置 西南边10子
        for (let i = 9; i < 13; i++) {
          for (let j = 0; j < i - 8; j++) {
            circles[i][j].color = choosedColors[1]
          }
        }
        // 设置 西北边10子
        for (let i = 4; i < 8; i++) {
          for (let j = 0; j < 8 - i; j++) {
            circles[i][j].color = choosedColors[2]
          }
        }
        // 设置 北边10子
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].color = choosedColors[3]
          }
        }
        // 设置 东北边10子
        for (let i = 4; i < 8; i++) {
          for (let j = 9; j < 17 - i; j++) {
            circles[i][j].color = choosedColors[4]
          }
        }
        // 设置 东南边10子
        for (let i = 9; i < 13; i++) {
          for (let j = 9; j < i + 1; j++) {
            circles[i][j].color = choosedColors[5]
          }
        }
      }
      
      
      this.setState({
        history: [
          {
            circles: circles
          }
        ]
      })
      
    })
    
  }
}

export default Game