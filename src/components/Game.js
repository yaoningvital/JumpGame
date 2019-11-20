import React from 'react'
import Board from './Board'
import '../index.scss'
import { circlesDefault, COLORS, getChoosedColorArr } from '../utils'
import clickAudio from '../assets/audio/click02.wav'
import _ from 'lodash'
import NextPlayer from "./NextPlayer";
import PlayerNum from "./operate-area/PlayerNum";
import ChooseColorsArea from "./operate-area/ChooseColorsArea";


class Game extends React.Component {
  constructor (props) {
    super(props)
    this.setCircleRadius = this.setCircleRadius.bind(this)
    this.setCirclesDistance = this.setCirclesDistance.bind(this)
    this.handleRotateDirectionChange = this.handleRotateDirectionChange.bind(this)
    this.setRotateDegNum = this.setRotateDegNum.bind(this)
    this.handleClickCircle = this.handleClickCircle.bind(this)
    
    this.state = {
      r: 20, // 棋子半径
      a: 20, // 棋子与同轴线上相邻棋子边缘的最短距离
      circlesOrigin: circlesDefault,
      playerNum: 0,// 当前玩家数
      boardRotateDirection: '+', // 棋盘旋转的方向（顺时针+ ，逆时针-）
      boardRotateDegNum: 0, // 棋盘旋转的角度
      availableColors: this.initAvailableColors(COLORS), // 可选颜色数组
      
      currentStep: 0,
      history: [
        { // 一条棋盘棋子布局的记录
          circles: circlesDefault
        },
      ],
      cashCirclesArr: [circlesDefault], // 记录下棋过程中的circles，只有在点击“确定”之后，这个数组中的最后一条circles记录才会push到history中
      currentSelectedCircle: null, // 当前被选中的棋子 {}
      ableReceiveCells: [], // 当前正在走的棋子 的 落子点
    }
  }
  
  render () {
    let currentCircles = this.state.cashCirclesArr[this.state.cashCirclesArr.length - 1]
    
    return (
      <div className="game">
        {/*棋盘*/}
        <div className="board-wrap">
          <Board
            circles={currentCircles}
            handleClickCircle={(circleData, ableReceive) => this.handleClickCircle(circleData, ableReceive)}
            r={this.state.r}
            a={this.state.a}
            direction={this.state.boardRotateDirection}
            degNum={this.state.boardRotateDegNum}
            currentSelectedCircle={this.state.currentSelectedCircle}
            ableReceiveCells={this.state.ableReceiveCells}
          />
          
          {/*下一步指示区*/}
          <NextPlayer
            availableColors={this.state.availableColors}
            history={this.state.history}
            r={this.state.r}
          />
        </div>
        
        {/*操作区*/}
        <div className="btns">
          {/*请选择玩家数*/}
          <PlayerNum
            playerNum={this.state.playerNum}
            choosePlayerNum={(playerNum) => this.choosePlayerNum(playerNum)}
            history={this.state.history}
          />
          {/*请选择棋子颜色*/}
          <ChooseColorsArea
            availableColors={this.state.availableColors}
            chooseCircleColor={(color) => this.chooseCircleColor(color)}
            history={this.state.history}
            playerNum={this.state.playerNum}
          />
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
    let choosedColorsArr = getChoosedColorArr(availableColors)
    
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
    let choosedColorsArr = getChoosedColorArr(availableColors) // 已选择的颜色组成的数组
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
    let choosedColors = getChoosedColorArr(availableColors)
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
      cashCirclesArr: [circlesDefault] // 初始的“缓存棋子布局”
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
        cashCirclesArr: [circles] // 设置 初始的“缓存棋子布局”
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
   * @param circleData : 点击的棋子的相关数据
   * @param ableReceive : 这个点是否是一个当前选中棋子 的 落子点
   */
  handleClickCircle (circleData, ableReceive) {
    // A: 点击了棋子
    if (circleData.color !== '#ddd') {
      // 1、更新 this.state.currentSelectedCircle ，改变被选中的棋子的样式
      this.setState({
        currentSelectedCircle: circleData
      })
      // 2、找到 当前选中的棋子 的落子点
      let ableReceiveCells = this.findAbleReceiveCells(circleData)
      this.setState({
        ableReceiveCells
      })
    }
    
    // B: 点击了空格
    else {
      if (ableReceive) { // 点击了落子点
        let cashCircles = _.cloneDeep(this.state.cashCirclesArr[this.state.cashCirclesArr.length - 1])
        // 1、把当前选中棋子 变为 空格
        let selectedToBlankComplete = false // 把选择点 变为 空格 是否已完成
        for (let i = 0; i < cashCircles.length; i++) {
          for (let j = 0; j < cashCircles[i].length; j++) {
            if (
              cashCircles[i][j].x === this.state.currentSelectedCircle.x &&
              cashCircles[i][j].y === this.state.currentSelectedCircle.y
            ) {
              cashCircles[i][j].color = '#ddd'
              selectedToBlankComplete = true
              break
            }
          }
          if (selectedToBlankComplete) {
            break
          }
        }
        // 2、把 落子点 变成 当前选中棋子的颜色
        let blankToSelectedComplete = false // 落子点 变 已选择点 是否已完成
        for (let i = 0; i < cashCircles.length; i++) {
          for (let j = 0; j < cashCircles[i].length; j++) {
            if (cashCircles[i][j].x === circleData.x && cashCircles[i][j].y === circleData.y) {
              cashCircles[i][j].color = this.state.currentSelectedCircle.color
              blankToSelectedComplete = true
              break
            }
          }
          if (blankToSelectedComplete) {
            break
          }
        }
        
        // 3、更新 当前选择点 currentSelectedCircle
        let currentSelectedCircle = _.cloneDeep(circleData)
        currentSelectedCircle.color = this.state.currentSelectedCircle.color
        
        // 4、更新 state
        let cashCirclesArr = _.cloneDeep(this.state.cashCirclesArr)
        cashCirclesArr.push(cashCircles)
        
        this.setState({
          cashCirclesArr,
          currentSelectedCircle,
        }, () => {
          // 5、找到 新选择点 的 落子点
          let ableReceiveCells = this.findAbleReceiveCells(currentSelectedCircle)
          this.setState({
            ableReceiveCells: ableReceiveCells,
          })
        })
      }
    }
  }
  
  /**
   * 返回 当前选中的棋子 的 落子点
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
    // 落子点 分为两种：可以跳到的落子点（简称：跳落子点） 和 可以通过移动一步而达到的落子点（这样的落子点就在选择点的紧挨着的位置，简称：移落子点）
    // 我们知道，一个棋子的一步是可以跳到多个落子点的。
    // 我们称一个棋子从开始跳 到 跳到 最后的落子点 的这个过程叫做这个棋子的“一步”，
    // 这一步的第一跳叫“首跳”，后边的所有次跳叫“非首跳”。
    // a) 对于棋子的 首跳，它的 落子点 包括 跳落子点 和 移落子点
    // b) 对于棋子的 非首跳，它的 落子点 只包括 跳落子点
    
    let cashCircles = _.cloneDeep(this.state.cashCirclesArr[this.state.cashCirclesArr.length - 1])
    
    let axes = ['x', 'y', 'z']
    for (let axisIndex = 0; axisIndex < axes.length; axisIndex++) {
      let nextAxisIndex = (axisIndex + 1) % axes.length // 当前处理的轴后面的轴，如果当前处理轴是z，那么它后面的轴是x
      
      // 先找这个棋子的 跳落子点
      let circlesLeft = [] // 与选择的棋子 在同一条当前处理上的  在它左边的 棋子
      let circlesRight = [] // 与选择的棋子 在同一条当前处理轴上的  在它右边的 棋子
      
      for (let i = 0; i < cashCircles.length; i++) {
        for (let j = 0; j < cashCircles[i].length; j++) {
          if (cashCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] && cashCircles[i][j].color !== '#ddd') {
            
            // 在选择点 左边的棋子
            if (cashCircles[i][j][axes[nextAxisIndex]] < selectedCircle[axes[nextAxisIndex]]) {
              circlesLeft.push(cashCircles[i][j])
            }
            // 在选择点 右边的棋子
            else if (cashCircles[i][j][axes[nextAxisIndex]] > selectedCircle[axes[nextAxisIndex]]) {
              circlesRight.push(cashCircles[i][j])
            }
          }
        }
      }
      
      // 找棋子左边的 跳落子点
      if (circlesLeft.length > 0) {
        // a) 找到左边的桥点
        let circlesLeftNearest = circlesLeft[circlesLeft.length - 1]
        
        // b) 计算基于 桥点 向左边跳的话，下一步会跳到哪个位置（简称：基于 桥点 找 目标点）
        let distance = selectedCircle[axes[nextAxisIndex]] - circlesLeftNearest[axes[nextAxisIndex]]
        let goalNextAxis = circlesLeftNearest[axes[nextAxisIndex]] - distance  // 目标点的 另外一个轴的值（取的是轴数组中当前处理轴的后面那个轴）
        let goalCurrentAxis = selectedCircle[axes[axisIndex]] // 目标点的 当前处理轴的 值
        
        // c) 判断目标点是否可以落子
        for (let i = 0; i < cashCircles.length; i++) {
          for (let j = 0; j < cashCircles[i].length; j++) {
            if (
              cashCircles[i][j][axes[axisIndex]] === goalCurrentAxis &&
              cashCircles[i][j][axes[nextAxisIndex]] === goalNextAxis &&
              cashCircles[i][j].color === '#ddd'
            ) {
              // 棋盘中存在这个点，并且这个点是一个空格
              // 判断这个 目标点 和 桥点 之间是否还有棋子
              let exist = false // 默认 目标点 和 桥点 之间没有棋子
              for (let i = 0; i < circlesLeft.length - 1; i++) {
                if (circlesLeft[i][axes[nextAxisIndex]] > goalNextAxis &&
                  circlesLeft[i][axes[nextAxisIndex]] < circlesLeftNearest[axes[nextAxisIndex]]) {
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
      
      
      // 找棋子右边的 跳落子点
      if (circlesRight.length > 0) {
        // a) 找右边的桥点
        let circlesRightNearest = circlesRight[0]
        
        // b) 基于 桥点 找 目标点
        let distance = circlesRightNearest[axes[nextAxisIndex]] - selectedCircle[axes[nextAxisIndex]]
        let goalNextAxis = circlesRightNearest[axes[nextAxisIndex]] + distance  // 目标点的 另外一个轴的值（取的是轴数组中当前处理轴的后面那个轴）
        let goalCurrentAxis = selectedCircle[axes[axisIndex]] // 目标点的 当前处理轴的 值
        
        // c) 判断目标点是否可以落子
        for (let i = 0; i < cashCircles.length; i++) {
          for (let j = 0; j < cashCircles[i].length; j++) {
            if (
              cashCircles[i][j][axes[axisIndex]] === goalCurrentAxis &&
              cashCircles[i][j][axes[nextAxisIndex]] === goalNextAxis &&
              cashCircles[i][j].color === '#ddd'
            ) {
              // 棋盘中存在这个点，并且这个点是一个空格
              // 判断这个 目标点 和 桥点 之间是否还有棋子
              let exist = false // 默认 目标点 和 桥点 之间没有棋子
              for (let i = 1; i < circlesRight.length; i++) {
                if (
                  circlesRight[i][axes[nextAxisIndex]] > circlesRightNearest[axes[nextAxisIndex]] &&
                  circlesRight[i][axes[nextAxisIndex]] < goalNextAxis
                ) {
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
      
      
      //  如果这一跳是这个棋子的 首跳，还要把 在当前处理轴上的 移落子点 加进去
      if (this.state.cashCirclesArr.length === 1) { // 首跳
        for (let i = 0; i < cashCircles.length; i++) {
          for (let j = 0; j < cashCircles[i].length; j++) {
            if (
              cashCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] &&   // 跟选择点在同一个 当前处理轴 上
              cashCircles[i][j].color === '#ddd' &&   // 是一个空格
              Math.abs(cashCircles[i][j][axes[nextAxisIndex]] - selectedCircle[axes[nextAxisIndex]]) === 1  // 在选择点相邻的格子
            ) { // 那么这一个点 就是 移落子点
              ableReceiveCells.push(cashCircles[i][j])
            }
          }
        }
      }
    }
    
    return ableReceiveCells
  }
  
  
}

export default Game