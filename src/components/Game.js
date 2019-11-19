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
      circlesOrigin: circlesDefault,
      history: [
        { // 一条棋盘棋子布局的记录
          circles: circlesDefault
        },
      ],
      cashCircles: circlesDefault, // 记录下棋过程中的circles，只有在点击“确定”之后这个记录才会push到history中
      currentStep: 0,
      playerNum: 0,// 当前玩家数
      checked: false,
      boardRotateDirection: '+', // 棋盘旋转的方向（顺时针+ ，逆时针-）
      boardRotateDegNum: 0, // 棋盘旋转的角度
      availableColors: this.initAvailableColors(COLORS), // 可选颜色数组
      selectedRowIndex: null, // 当前选中的棋子所在行的索引
      selectedColumnIndex: null, // 当前选中的棋子所在列的索引
    }
  }
  
  render () {
    let currentCircles = this.state.history[this.state.currentStep].circles
    
    return (
      <div className="game">
        {/*棋盘*/}
        <div className="board-wrap">
          <Board
            circles={currentCircles}
            handleClickCircle={(circleData) => this.handleClickCircle(circleData)}
            r={this.state.r}
            a={this.state.a}
            direction={this.state.boardRotateDirection}
            degNum={this.state.boardRotateDegNum}
            selectedRowIndex={this.state.selectedRowIndex}
            selectedColumnIndex={this.state.selectedColumnIndex}
          />
          <div className="status">
            <span>下一步：</span>
            {/*<button style={{*/}
            {/*  width: `${this.state.r * 2}px`,*/}
            {/*  height: `${this.state.r * 2}px`,*/}
            {/*  borderRadius: `${this.state.r}px`,*/}
            {/*  backgroundColor: 'red'*/}
            {/*}}/>*/}
          </div>
        </div>
        
        {/*操作区*/}
        <div className="btns">
          {/*请选择玩家数*/}
          <div className="player-num">
            <h4>请选择玩家数</h4>
            <p>当前玩家数：{this.state.playerNum} 人</p>
            {
              [1, 2, 3, 4, 5, 6].map((playerNum) => {
                return (
                  <button
                    key={playerNum}
                    onClick={() => this.choosePlayerNum(playerNum)}
                    disabled={this.state.history.length > 1}
                  >{playerNum}人玩</button>
                )
              })
            }
          </div>
          {/*请选择棋子颜色*/}
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
                        disabled={this.state.history.length > 1 || !this.state.playerNum || colorItem.disabled}
                      />
                      <button
                        style={{
                          opacity: (this.state.history.length > 1 || !this.state.playerNum || colorItem.disabled) ? 0.4 : 1,
                          backgroundImage: `radial-gradient(at 80px 80px, rgba(0,0,0,0), ${colorItem.colorValue})`
                        }}
                        onClick={() => this.chooseCircleColor(colorItem.colorValue)}
                        disabled={this.state.history.length > 1 || !this.state.playerNum || colorItem.disabled}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
          {/*旋转棋盘*/}
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
          {/*历史步骤*/}
          <div>
            <h4>历史步骤：</h4>
            {
              this.state.history.map((step, move) => {
                let desc = `回退到第${move}步`
                return move ? <button>{desc}</button> : null
              })
            }
          </div>
          {/*设置棋子半径大小*/}
          <div className="set-radius">
            <h4>设置棋子半径大小：（默认20px）</h4>
            <input type="text"
                   onKeyUp={this.setCircleRadius}/><span> px</span>
          </div>
          {/*设置相邻棋子之间的距离*/}
          <div>
            <h4>设置相邻棋子之间的距离：（默认20px）</h4>
            <input type="text"
                   onKeyUp={this.setCirclesDistance}
            />
            <span> px</span>
          </div>
          {/*audio*/}
          <audio src={clickAudio} id="click-audio">
            您的浏览器不支持 audio 标签。
          </audio>
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
   *  根据当前颜色面板中选择的颜色，更新棋盘中棋子的颜色。
   * @param choosedColors : 颜色面板中已经选择的颜色值组成的数组
   */
  updateCirclesColorInBoard (choosedColors) {
    // 将所有棋子重置为默认状态，然后再设置 已选择的颜色
    this.setState({
      history: [
        {
          circles: circlesDefault
        }
      ],
      cashCircles: circlesDefault // 初始的“缓存棋子布局”
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
        ],
        cashCircles: circles // 设置 初始的“缓存棋子布局”
      })
      
    })
    
  }
  
  
  /**
   * 播放棋盘中棋子放下的声音
   */
  playAudio () {
    let audioEle = document.getElementById('click-audio')
    audioEle.play()
  }
  
  /**
   * 处理点击棋子
   */
  handleClickCircle (circleData) {
    // console.log('circleData:', circleData)
    
    // A: 点击了棋子
    if (circleData.color !== '#ddd') {
      // 1、改变被选中的棋子的样式
      this.setState({
        selectedRowIndex: circleData.rowIndex,
        selectedColumnIndex: circleData.columnIndex,
      })
      // 2、找到 当前选中的棋子 可以跳到的格子
      this.findAbleReceiveCells(circleData)
    }
    
    // B: 点击了空格
    
  }
  
  /**
   * 返回 当前选中的棋子 可以跳到的 格子 组成的数组
   * @param selectedCircle :当前选中的棋子
   */
  // var selectedCircle = {
  //   x: 1,
  //   y: 3,
  //   z: 4,
  //   color: GREY,
  //   rowIndex: 1,
  //   columnIndex: 0
  // }
  findAbleReceiveCells (selectedCircle) {
    let ableReceiveCells = [] // 当前选中的棋子所有可以落子的点
    let cashCircles = _.cloneDeep(this.state.cashCircles)
    
    let circlesLeft = [] // 与选择的棋子 在同一条x轴上的  在它左边的 棋子
    let circlesRight = [] // 与选择的棋子 在同一条x轴上的  在它右边的 棋子
    // let leftNeighborIsBlank = false // 选择点 左边的 相邻点 是不是一个空格
    
    
    for (let i = 0; i < cashCircles.length; i++) {
      for (let j = 0; j < cashCircles[i].length; j++) {
        if (cashCircles[i][j].x === selectedCircle.x && cashCircles[i][j].color !== '#ddd') {
          // 在选择点 左边的棋子
          if (cashCircles[i][j].y < selectedCircle.y) {
            circlesLeft.push(cashCircles[i][j])
          }
          // 在选择点 右边的棋子
          else if (cashCircles[i][j].y > selectedCircle.y) {
            circlesRight.push(cashCircles[i][j])
          }
        }
        
        // 与选择点在同一条x轴上、位于选择点的左边一个、并且是一个空格
        // if (cashCircles[i][j].x === selectedCircle.x &&
        //   cashCircles[i][j].y + 1 === selectedCircle.y &&
        //   cashCircles[i][j].color === '#ddd') {
        //   leftNeighborIsBlank = true
        // }
      }
    }
    
    // 左边有棋子
    if (circlesLeft.length > 0) {
      // a) 找到左边的桥点
      let circlesLeftNearest = circlesLeft[circlesLeft.length - 1]
      
      // b) 计算基于 桥点 向左边跳的话，下一步会跳到哪个位置（简称：基于 桥点 找 目标点）
      let distance = selectedCircle.y - circlesLeftNearest.y
      let goalY = circlesLeftNearest.y - distance  // 目标点的 y值
      let goalX = selectedCircle.x // 目标点的 x 值
      
      // c) 判断目标点是否可以落子
      for (let i = 0; i < cashCircles.length; i++) {
        for (let j = 0; j < cashCircles[i].length; j++) {
          if (cashCircles[i][j].x === goalX && cashCircles[i][j].y === goalY && cashCircles[i][j].color === '#ddd') {
            // 棋盘中存在这个点，并且这个点是一个空格
            // 判断这个 目标点 和 桥点 之间是否还有棋子
            let exist = false // 默认 目标点 和 桥点 之间没有棋子
            for (let i = 0; i < circlesLeft.length - 1; i++) {
              if (circlesLeft[i].y > goalY && circlesLeft[i].y < circlesLeftNearest.y) {
                exist = true
                break
              }
            }
            if (!exist) { // 目标点 和 桥点 之间没有棋子，那么这个目标点就是一个可以落子的点
              ableReceiveCells.push(cashCircles[i][j])
            }
          }
        }
      }
    }
    
    // 左边相邻点（与选择点的左边紧挨着的）是空格
    // if () {
    //
    //
    // }
    
    // 右边有棋子
    if (circlesRight.length > 0) {
      // a) 找右边的桥点
      let circlesRightNearest = circlesRight[0]
      
      // b) 基于 桥点 找 目标点
      let distance = circlesRightNearest.y - selectedCircle.y
      let goalY = circlesRightNearest.y + distance  // 目标点的 y值
      let goalX = selectedCircle.x // 目标点的 x 值
      
      // c) 判断目标点是否可以落子
      for (let i = 0; i < cashCircles.length; i++) {
        for (let j = 0; j < cashCircles[i].length; j++) {
          if (cashCircles[i][j].x === goalX && cashCircles[i][j].y === goalY && cashCircles[i][j].color === '#ddd') {
            // 棋盘中存在这个点，并且这个点是一个空格
            // 判断这个 目标点 和 桥点 之间是否还有棋子
            let exist = false // 默认 目标点 和 桥点 之间没有棋子
            for (let i = 1; i < circlesRight.length; i++) {
              if (circlesRight[i].y > circlesRightNearest.y && circlesRight[i].y < goalY) {
                exist = true
                break
              }
            }
            if (!exist) { // 目标点 和 桥点 之间没有棋子，那么这个目标点就是一个可以落子的点
              ableReceiveCells.push(cashCircles[i][j])
            }
          }
        }
      }
    }
    
    // 右边相邻点 为空格
    
  }
  
}

export default Game