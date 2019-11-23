import React from 'react'
import Board from './Board'
import '../index.scss'
import { circlesDefault, COLORS, getChoosedColorArr } from '../utils'
import _ from 'lodash'
import NextPlayer from "./NextPlayer";
import PlayerNum from "./operate-area/PlayerNum";
import ChooseColorsArea from "./operate-area/ChooseColorsArea";
import RotateBoard from "./operate-area/RotateBoard";
import HistorySteps from "./operate-area/HistorySteps";
import SetRadius from "./operate-area/SetRadius";
import SetCirclesDistance from "./operate-area/SetCirclesDistance";
import ConfirmStep from "./operate-area/ConfirmStep";
import Ranking from "./operate-area/Ranking";


class Game extends React.Component {
  constructor (props) {
    super(props)
    this.setCircleRadius = this.setCircleRadius.bind(this)
    this.setCirclesDistance = this.setCirclesDistance.bind(this)
    this.handleRotateDirectionChange = this.handleRotateDirectionChange.bind(this)
    this.handleRotate = this.handleRotate.bind(this)
    this.setRotateDegNum = this.setRotateDegNum.bind(this)
    this.handleClickCircle = this.handleClickCircle.bind(this)
    this.handleStepConfirm = this.handleStepConfirm.bind(this)
    this.handleStepBackTo = this.handleStepBackTo.bind(this)
    
    this.state = {
      r: 20, // 棋子半径
      a: 20, // 棋子与同轴线上相邻棋子边缘的最短距离
      playerNum: 0,// 当前玩家数
      boardRotateDirection: '+', // 棋盘旋转的方向（顺时针+ ，逆时针-）
      boardRotateDegNum: 0, // 棋盘旋转的角度
      availableColors: this.initAvailableColors(COLORS), // 可选颜色数组
      
      currentStep: 0,
      history: [
        { // 一条棋盘棋子布局的记录
          circles: circlesDefault, // 棋子布局
          currentPlayingColor: '', // 当前玩家的颜色
          ranking: [], // 已经完成游戏的颜色
        },
      ],
      cashCirclesArr: [circlesDefault], // 记录下棋过程中的circles，只有在点击“确定”之后，这个数组中的最后一条circles记录才会push到history中
      currentSelectedCircle: null, // 当前被选中的棋子 {}
      ableReceiveCells: [], // 当前正在走的棋子 的 落子点
      ranking: [],// 当前排名
      currentPlayingColor: '', // 当前玩家的颜色
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
            currentStep={this.state.currentStep}
            r={this.state.r}
            getNotCompleteColors={this.getNotCompleteColors}
            ranking={this.state.ranking}
            currentPlayingColor={this.state.currentPlayingColor}
          />
          
          {/*确认按钮*/}
          <ConfirmStep
            cashCirclesArr={this.state.cashCirclesArr}
            handleStepConfirm={this.handleStepConfirm}
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
          <RotateBoard
            handleRotateDirectionChange={this.handleRotateDirectionChange}
            setRotateDegNum={this.setRotateDegNum}
            handleRotate={this.handleRotate}
          />
          {/*历史步骤*/}
          <HistorySteps
            history={this.state.history}
            handleStepBackTo={(move) => this.handleStepBackTo(move)}
          />
          {/*设置棋子半径大小*/}
          <SetRadius
            setCircleRadius={this.setCircleRadius}
          />
          {/*设置相邻棋子之间的距离*/}
          <SetCirclesDistance
            setCirclesDistance={this.setCirclesDistance}
          />
          {/*排名*/}
          <Ranking
            ranking={this.state.ranking}
          />
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
    
    let currentPlayingColor = choosedColorsArr[0]
    
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
      currentPlayingColor,
      availableColors,
      currentSelectedCircle: null,
      ableReceiveCells: []
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
    console.log('e.target.value:', e.target.value)
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
    
    // 4、更新 当前玩家的颜色
    let currentPlayingColor = choosedColors[0]
    
    this.setState({
      availableColors,
      currentPlayingColor
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
      cashCirclesArr: [circlesDefault], // 初始的“缓存棋子布局”
      currentSelectedCircle: null,
      ableReceiveCells: []
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
        cashCirclesArr: [circles], // 设置 初始的“缓存棋子布局”
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
    // 颜色还没选完，不能开始游戏
    let selectedColors = getChoosedColorArr(this.state.availableColors)
    if (selectedColors.length !== this.state.playerNum) {
      alert('请先选择棋子颜色')
      return
    }
    
    // A: 点击了棋子
    if (circleData.color !== '#ddd') {
      // 只能点当前玩家的棋子
      if (circleData.color !== this.state.currentPlayingColor) return
      
      // 已经有当前玩家的棋子走出去至少一小步了，其他棋子不能再走；
      // 而对于已经走出去至少一小步的棋子，点它本身是没有反应的。
      // 现在只能点落子点（空格）继续移动这颗棋子；或者点“确定”按钮确认这一步棋
      if (this.state.cashCirclesArr.length > 1) return
      
      // 棋盘中有效点击播放声音
      this.playAudio()
      
      // 1、找到 当前选中的棋子 的落子点
      let ableReceiveCells = this.findAbleReceiveCells(circleData)
      
      // 2、更新 this.state，
      // ableReceiveCells: 显示落子点
      // currentSelectedCircle : 改变被选中的棋子的样式
      this.setState({
        ableReceiveCells,
        currentSelectedCircle: circleData
      })
    }
    
    // B: 点击了空格
    else {
      if (ableReceive) { // 点击了落子点
        // 棋盘中有效点击播放声音
        this.playAudio()
        
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
        
        // 3、更新 state
        // cashCirclesArr
        let cashCirclesArr = _.cloneDeep(this.state.cashCirclesArr)
        
        if (cashCirclesArr.length === 1) { // 如果是这个棋子的 首步，那么这一步（cashCircles）肯定跟初始状态不同，应该直接push进 小步状态数组（cashCirclesArr）
          cashCirclesArr.push(cashCircles)
        } else { // 这个棋子至少走出过1步了，那么这时应该判断 这一步 是否跟它在这一大步中走过的位置有重复，如果有重复，就相当于它又回退到了这一步
          let hasDuplicateSmallStep = false
          for (let i = cashCirclesArr.length - 2; i >= 0; i--) {
            if (this.isBoardLayoutTheSame(cashCirclesArr[i], cashCircles)) {
              cashCirclesArr = cashCirclesArr.slice(0, i + 1)
              hasDuplicateSmallStep = true
              break
            }
          }
          if (!hasDuplicateSmallStep) {
            cashCirclesArr.push(cashCircles)
          }
        }
        
        // currentSelectedCircle
        let currentSelectedCircle = _.cloneDeep(circleData)
        currentSelectedCircle.color = this.state.currentSelectedCircle.color
        
        this.setState({
          cashCirclesArr,
          currentSelectedCircle,
        }, () => {
          // 4、找到 新选择点 的 落子点
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
  findAbleReceiveCells (selectedCircle) {
    let ableReceiveCells = [] // 当前选中的棋子所有可以落子的点
    // 落子点 分为两种：可以跳到的落子点（简称：跳落子点） 和 可以通过移动一步而达到的落子点（这样的落子点就在选择点的紧挨着的位置，简称：移落子点）
    // 我们知道，一个棋子的一步是可以跳到多个落子点的。
    // 我们称一个棋子从开始走 到 走到 最后的落子点 的这个过程叫做这个棋子的“一大步”，
    // 这一大步中的第一小步叫“首步”，后边的所有次小步叫“非首步”。
    // a) 对于棋子的 首步，它的 落子点 包括 跳落子点 和 移落子点
    // b) 对于棋子的 非首步，如果它的前一小步是 跳过来 的，那么它的落子点只包括 跳落子点；
    // c) 对于棋子的 非首步，如果它的前一小步是 移过来 的，那么它的落子点只包括一个：它原来的位置；
    
    let cashCirclesArr = _.cloneDeep(this.state.cashCirclesArr) // 当前这一大步的数据的深拷贝
    let cashCircles = _.cloneDeep(this.state.cashCirclesArr[this.state.cashCirclesArr.length - 1]) // 当前棋子布局
    
    // 首步
    if (this.state.cashCirclesArr.length === 1) {
      let jumpToCells = this.findJumpToCells(cashCircles, selectedCircle)  // 拿到跳落子点
      let moveToCells = this.findMoveToCells(cashCircles, selectedCircle)  // 拿到移落子点
      
      ableReceiveCells = ableReceiveCells.concat(jumpToCells, moveToCells)
    }
    // 非首步
    else if (this.state.cashCirclesArr.length > 1) {
      // 判断当前棋子是不是移过来的
      let isMoveHere = this.isMoveHere(cashCirclesArr, selectedCircle)
      if (isMoveHere) { // 是移过来的，isMoveHere 是 原来移过来的位置对象
        ableReceiveCells.push(isMoveHere)
      } else { // 是跳过来的，isMoveHere 是 false
        let jumpToCells = this.findJumpToCells(cashCircles, selectedCircle)  // 拿到跳落子点
        ableReceiveCells = ableReceiveCells.concat(jumpToCells)
      }
    }
    
    return ableReceiveCells
  }
  
  /**
   * 返回 当前选中棋子 的 跳落子点
   * @param currentCashCircles : 当前棋子布局
   * @param selectedCircle : 当前选中的棋子
   */
  findJumpToCells (currentCashCircles, selectedCircle) {
    let jumpToCells = [] // 要返回的 当前选中棋子 的 跳落子点
    
    let axes = ['x', 'y', 'z']
    for (let axisIndex = 0; axisIndex < axes.length; axisIndex++) {
      
      let nextAxisIndex = (axisIndex + 1) % axes.length // 当前处理的轴后面的轴，如果当前处理轴是z，那么它后面的轴是x
      
      let circlesLeft = [] // 与选择的棋子 在同一条当前处理轴上的  在它左边的 棋子
      let circlesRight = [] // 与选择的棋子 在同一条当前处理轴上的  在它右边的 棋子
      
      for (let i = 0; i < currentCashCircles.length; i++) {
        for (let j = 0; j < currentCashCircles[i].length; j++) {
          if (currentCashCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] && currentCashCircles[i][j].color !== '#ddd') {
            
            // 在选择点 左边的棋子
            if (currentCashCircles[i][j][axes[nextAxisIndex]] < selectedCircle[axes[nextAxisIndex]]) {
              circlesLeft.push(currentCashCircles[i][j])
            }
            // 在选择点 右边的棋子
            else if (currentCashCircles[i][j][axes[nextAxisIndex]] > selectedCircle[axes[nextAxisIndex]]) {
              circlesRight.push(currentCashCircles[i][j])
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
        for (let i = 0; i < currentCashCircles.length; i++) {
          for (let j = 0; j < currentCashCircles[i].length; j++) {
            if (
              currentCashCircles[i][j][axes[axisIndex]] === goalCurrentAxis &&
              currentCashCircles[i][j][axes[nextAxisIndex]] === goalNextAxis &&
              currentCashCircles[i][j].color === '#ddd'
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
              if (!exist) { // 目标点 和 桥点 之间没有棋子，那么这个目标点就是一个 跳落子点
                jumpToCells.push(currentCashCircles[i][j])
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
        for (let i = 0; i < currentCashCircles.length; i++) {
          for (let j = 0; j < currentCashCircles[i].length; j++) {
            if (
              currentCashCircles[i][j][axes[axisIndex]] === goalCurrentAxis &&
              currentCashCircles[i][j][axes[nextAxisIndex]] === goalNextAxis &&
              currentCashCircles[i][j].color === '#ddd'
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
              if (!exist) { // 目标点 和 桥点 之间没有棋子，那么这个目标点就是一个 跳落子点
                jumpToCells.push(currentCashCircles[i][j])
              }
            }
          }
        }
      }
      
    }
    
    return jumpToCells
  }
  
  /**
   * 返回 当前选中棋子 的 移落子点
   * @param currentCashCircles : 当前棋子布局
   * @param selectedCircle : 当前选中的棋子
   */
  findMoveToCells (currentCashCircles, selectedCircle) {
    let moveToCells = [] // 要返回的 当前选中棋子的 所有 移落子点
    
    let axes = ['x', 'y', 'z']
    for (let axisIndex = 0; axisIndex < axes.length; axisIndex++) {
      
      let nextAxisIndex = (axisIndex + 1) % axes.length // 当前处理的轴后面的轴，如果当前处理轴是z，那么它后面的轴是x
      
      for (let i = 0; i < currentCashCircles.length; i++) {
        for (let j = 0; j < currentCashCircles[i].length; j++) {
          if (
            currentCashCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] &&   // 跟选择点在同一个 当前处理轴 上
            currentCashCircles[i][j].color === '#ddd' &&   // 是一个空格
            Math.abs(currentCashCircles[i][j][axes[nextAxisIndex]] - selectedCircle[axes[nextAxisIndex]]) === 1  // 在选择点相邻的格子
          ) { // 那么这一个点 就是 移落子点
            moveToCells.push(currentCashCircles[i][j])
          }
        }
      }
    }
    
    return moveToCells
  }
  
  /**
   * 判断 当前正在下的棋子 是 移过来的 还是 跳过来的 （是通过 移 还是 跳 到现在这一步的）
   * @param currentCashCirclesArr : 当前这一大步的数据（是一个包含这一大步中每一小步的棋子布局的数组）
   * @param selectedCircle ： 当前选中的棋子（当前正在下的棋子，即当前正在走这一大步的棋子）
   * @return : 如果是移过来的，返回移过来的位置点对象，如果不是移过来的，返回 false
   */
  isMoveHere (currentCashCirclesArr, selectedCircle) {
    let isMoveHere = false // 当前棋子是否是 移过来 的，默认不是移过来的（是跳过来的）
    let preStepCircles = currentCashCirclesArr[currentCashCirclesArr.length - 2] // 上一步的棋子布局
    let currentStepCircles = currentCashCirclesArr[currentCashCirclesArr.length - 1] // 当前的棋子布局
    
    let axes = ['x', 'y', 'z']
    for (let axisIndex = 0; axisIndex < axes.length; axisIndex++) {
      
      let nextAxisIndex = (axisIndex + 1) % axes.length // 当前处理的轴后面的第一个轴，如果当前处理轴是z，那么它后面的轴是x
      let nextTwoAxisIndex = (axisIndex + 2) % axes.length // 当前处理的轴后面的第二个轴，如果当前处理轴是y，那么它后面的轴是x
      
      for (let i = 0; i < preStepCircles.length; i++) {
        for (let j = 0; j < preStepCircles[i].length; j++) {
          if (
            preStepCircles[i][j].color !== '#ddd' && // 上一步中，有这么一个 棋子
            preStepCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] && // 这个棋子 与 当前棋子 同在某一条轴上
            Math.abs(preStepCircles[i][j][axes[nextAxisIndex]] - selectedCircle[axes[nextAxisIndex]]) === 1 && // 这个棋子 与 当前棋子 在另外一条轴上的 坐标值相差1
            Math.abs(preStepCircles[i][j][axes[nextTwoAxisIndex]] - selectedCircle[axes[nextTwoAxisIndex]]) === 1 && // 这个棋子 与 当前棋子 在另外第二条轴上的 坐标值相差1
            currentStepCircles[i][j].color === '#ddd'  // 在上一步中，这个位置是一个棋子，但是在这一步中，这个位置是一个空格
          ) {
            isMoveHere = currentStepCircles[i][j] // 是移过来的，返回 原来移过来的位置
            break
          }
        }
        if (isMoveHere) {
          break
        }
      }
      if (isMoveHere) {
        break
      }
    }
    
    return isMoveHere
  }
  
  /**
   * 判断两次棋子布局是否完全一样，完全一样返回 true
   * @param circlesOne : 一个棋子布局
   * @param circlesTwo : 另一个棋子布局
   */
  isBoardLayoutTheSame (circlesOne, circlesTwo) {
    let isTheSame = true // 先假设两次棋子布局完全一样
    for (let i = 0; i < circlesOne.length; i++) {
      for (let j = 0; j < circlesOne[i].length; j++) {
        if (circlesOne[i][j].color !== circlesTwo[i][j].color) {
          isTheSame = false
          break
        }
      }
      if (!isTheSame) {
        break
      }
    }
    
    return isTheSame
  }
  
  /**
   * 处理点击右下角“确认”按钮，确认这一步棋子的移动
   */
  handleStepConfirm () {
    let newCircles = _.cloneDeep(this.state.cashCirclesArr[this.state.cashCirclesArr.length - 1])
    let history = _.cloneDeep(this.state.history.slice(0, this.state.currentStep + 1))
    
    
    let newRanking = this.updateRanking(newCircles, this.state.ranking)
    let newCurrentStep = this.state.currentStep + 1
    
    let newCurrentPlayingColor = this.getNewCurrentPlayingColor(this.state.ranking, newRanking, this.state.currentPlayingColor)
    
    history.push({
      circles: newCircles,
      currentPlayingColor: newCurrentPlayingColor,
      ranking: newRanking,
    })
    
    this.setState({
      currentStep: newCurrentStep,
      currentPlayingColor: newCurrentPlayingColor,
      history,
      cashCirclesArr: [newCircles],
      ranking: newRanking,
      currentSelectedCircle: null,
      ableReceiveCells: []
    })
  }
  
  /**
   * 点击历史记录回退按钮
   * @param move
   */
  handleStepBackTo (move) {
    let temporaryCircles = _.cloneDeep(this.state.history[move].circles)
    let history = this.state.history.slice()
    if (move === 0) {
      history = [
        {
          circles: temporaryCircles,
          currentPlayingColor: getChoosedColorArr(this.state.availableColors)[0],
          ranking: []
        }
      ]
    }
    
    let currentPlayingColor = history[move].currentPlayingColor
    let ranking = history[move].ranking
    
    this.setState({
      history,
      currentStep: move,
      currentPlayingColor, // 更新当前玩家颜色
      ranking, // 更新已经完成游戏的颜色
      cashCirclesArr: [temporaryCircles], // 更新棋子布局
      currentSelectedCircle: null,
      ableReceiveCells: []
    })
  }
  
  /**
   * 判断 当前布局中，南边10子 是否都是给定的颜色
   * @param color : 给定的颜色
   * @param circles : 当前布局
   * @return : 返回 是或否
   */
  southTenAreTheSameGivenColor (color, circles) {
    let allIsThisColor = true // 假设这10个点都是给定的颜色
    for (let i = circles.length - 4; i < circles.length; i++) {
      for (let j = 0; j < circles[i].length; j++) {
        if (circles[i][j].color !== color) {
          allIsThisColor = false
          break
        }
      }
      if (!allIsThisColor) {
        break
      }
    }
    
    return allIsThisColor
  }
  
  /**
   * 判断 西南方10子 是否都是给定的颜色
   * @param color : 给定的颜色
   * @param circles : 当前布局
   * @returns {boolean} : 如果都是给定的颜色，返回 true
   */
  westSouthTenAreTheSameGivenColor (color, circles) {
    let allIsThisColor = true // 假设这10个点都是给定的颜色
    for (let i = 9; i < 13; i++) {
      for (let j = 0; j < i - 8; j++) {
        if (circles[i][j].color !== color) {
          allIsThisColor = false
          break
        }
      }
      if (!allIsThisColor) {
        break
      }
    }
    return allIsThisColor
  }
  
  /**
   * 判断 西北10子 是否都是给定的颜色
   * @param color : 给定的颜色
   * @param circles : 当前布局
   * @returns {boolean}
   */
  westNorthTenAreTheSameGivenColor (color, circles) {
    let allIsThisColor = true // 假设这10个点都是给定的颜色
    for (let i = 4; i < 8; i++) {
      for (let j = 0; j < 8 - i; j++) {
        if (circles[i][j].color !== color) {
          allIsThisColor = false
          break
        }
      }
      if (!allIsThisColor) {
        break
      }
    }
    return allIsThisColor
  }
  
  /**
   * 判断 北边10子 是否都是给定的颜色
   * @param color : 给定的颜色
   * @param circles : 当前布局
   * @returns {boolean}
   */
  northTenAreTheSameGivenColor (color, circles) {
    let allIsThisColor = true // 假设这10个点都是给定的颜色
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < circles[i].length; j++) {
        if (circles[i][j].color !== color) {
          allIsThisColor = false
          break
        }
      }
      if (!allIsThisColor) {
        break
      }
    }
    return allIsThisColor
  }
  
  /**
   * 判断 东北边10子 是否都是给定的颜色
   * @param color : 给定的颜色
   * @param circles : 当前布局
   * @returns {boolean}
   */
  eastNorthTenAreTheSameGivenColor (color, circles) {
    let allIsThisColor = true // 假设这10个点都是给定的颜色
    for (let i = 4; i < 8; i++) {
      for (let j = 9; j < 17 - i; j++) {
        if (circles[i][j].color !== color) {
          allIsThisColor = false
          break
        }
      }
      if (!allIsThisColor) {
        break
      }
    }
    return allIsThisColor
  }
  
  /**
   * 判断 东南边10子 是否都是给定的颜色
   * @param color : 给定的颜色
   * @param circles : 当前布局
   * @returns {boolean}
   */
  eastSouthTenAreTheSameGivenColor (color, circles) {
    let allIsThisColor = true // 假设这10个点都是给定的颜色
    for (let i = 9; i < 13; i++) {
      for (let j = 9; j < i + 1; j++) {
        if (circles[i][j].color !== color) {
          allIsThisColor = false
          break
        }
      }
      if (!allIsThisColor) {
        break
      }
    }
    return allIsThisColor
  }
  
  /**
   * 根据当前排名 和 当前棋子布局，返回新的 排名
   * @param circles : 当前棋子布局
   * @param ranking : 当前排名(ranking中只存已经赢了的颜色名，先赢的放前面)
   */
  updateRanking (circles, ranking) {
    let choosedColors = getChoosedColorArr(this.state.availableColors)  // 选择的所有颜色
    let cashRanking = ranking.slice()  // 已经完成的
    
    // 当前有 2 个玩家
    if (choosedColors.length === 2) {
      if (!cashRanking.includes(choosedColors[0])) { // 如果第 1 个颜色没有完成
        if (this.northTenAreTheSameGivenColor(choosedColors[0], circles)) {
          cashRanking.push(choosedColors[0])
        }
      }
      if (!cashRanking.includes(choosedColors[1])) { // 如果第 2 个颜色没有完成
        if (this.southTenAreTheSameGivenColor(choosedColors[1], circles)) {
          cashRanking.push(choosedColors[1])
        }
      }
    }
    // 当前有 3 个玩家
    else if (choosedColors.length === 3) {
      if (!cashRanking.includes(choosedColors[0])) { // 如果第 1 个颜色没有完成
        if (this.northTenAreTheSameGivenColor(choosedColors[0], circles)) {
          cashRanking.push(choosedColors[0])
        }
      }
      if (!cashRanking.includes(choosedColors[1])) { // 如果第 2 个颜色没有完成
        if (this.eastSouthTenAreTheSameGivenColor(choosedColors[1], circles)) {
          cashRanking.push(choosedColors[1])
        }
      }
      if (!cashRanking.includes(choosedColors[2])) { // 如果第 3 个颜色没有完成
        if (this.westSouthTenAreTheSameGivenColor(choosedColors[2], circles)) {
          cashRanking.push(choosedColors[2])
        }
      }
    }
    // 当前有 4 个玩家
    else if (choosedColors.length === 4) {
      if (!cashRanking.includes(choosedColors[0])) { // 如果第 1 个颜色没有完成
        if (this.northTenAreTheSameGivenColor(choosedColors[0], circles)) {
          cashRanking.push(choosedColors[0])
        }
      }
      if (!cashRanking.includes(choosedColors[1])) { // 如果第 2 个颜色没有完成
        if (this.eastNorthTenAreTheSameGivenColor(choosedColors[1], circles)) {
          cashRanking.push(choosedColors[1])
        }
      }
      if (!cashRanking.includes(choosedColors[2])) { // 如果第 3 个颜色没有完成
        if (this.southTenAreTheSameGivenColor(choosedColors[2], circles)) {
          cashRanking.push(choosedColors[2])
        }
      }
      if (!cashRanking.includes(choosedColors[3])) { // 如果第 4 个颜色没有完成
        if (this.westSouthTenAreTheSameGivenColor(choosedColors[3], circles)) {
          cashRanking.push(choosedColors[3])
        }
      }
    }
    // 当前有 5 个玩家
    else if (choosedColors.length === 5) {
      if (!cashRanking.includes(choosedColors[0])) { // 如果第 1 个颜色没有完成
        if (this.northTenAreTheSameGivenColor(choosedColors[0], circles)) {
          cashRanking.push(choosedColors[0])
        }
      }
      if (!cashRanking.includes(choosedColors[1])) { // 如果第 2 个颜色没有完成
        if (this.eastNorthTenAreTheSameGivenColor(choosedColors[1], circles)) {
          cashRanking.push(choosedColors[1])
        }
      }
      if (!cashRanking.includes(choosedColors[2])) { // 如果第 3 个颜色没有完成
        if (this.eastSouthTenAreTheSameGivenColor(choosedColors[2], circles)) {
          cashRanking.push(choosedColors[2])
        }
      }
      if (!cashRanking.includes(choosedColors[3])) { // 如果第 4 个颜色没有完成
        if (this.southTenAreTheSameGivenColor(choosedColors[3], circles)) {
          cashRanking.push(choosedColors[3])
        }
      }
      if (!cashRanking.includes(choosedColors[4])) { // 如果第 5 个颜色没有完成
        if (this.westSouthTenAreTheSameGivenColor(choosedColors[4], circles)) {
          cashRanking.push(choosedColors[4])
        }
      }
    }
    // 当前有 6 个玩家
    else if (choosedColors.length === 6) {
      if (!cashRanking.includes(choosedColors[0])) { // 如果第 1 个颜色没有完成
        if (this.northTenAreTheSameGivenColor(choosedColors[0], circles)) {
          cashRanking.push(choosedColors[0])
        }
      }
      if (!cashRanking.includes(choosedColors[1])) { // 如果第 2 个颜色没有完成
        if (this.eastNorthTenAreTheSameGivenColor(choosedColors[1], circles)) {
          cashRanking.push(choosedColors[1])
        }
      }
      if (!cashRanking.includes(choosedColors[2])) { // 如果第 3 个颜色没有完成
        if (this.eastSouthTenAreTheSameGivenColor(choosedColors[2], circles)) {
          cashRanking.push(choosedColors[2])
        }
      }
      if (!cashRanking.includes(choosedColors[3])) { // 如果第 4 个颜色没有完成
        if (this.southTenAreTheSameGivenColor(choosedColors[3], circles)) {
          cashRanking.push(choosedColors[3])
        }
      }
      if (!cashRanking.includes(choosedColors[4])) { // 如果第 5 个颜色没有完成
        if (this.westSouthTenAreTheSameGivenColor(choosedColors[4], circles)) {
          cashRanking.push(choosedColors[4])
        }
      }
      if (!cashRanking.includes(choosedColors[5])) { // 如果第 6 个颜色没有完成
        if (this.westNorthTenAreTheSameGivenColor(choosedColors[5], circles)) {
          cashRanking.push(choosedColors[5])
        }
      }
    }
    
    return cashRanking
  }
  
  /**
   * 找到还没有完成比赛的颜色。返回一个数组 ['red','orange']
   * @param choosedColors : 当前选择的所有棋子颜色（数组：['red','orange'...]），顺序按颜色面板中的顺序来排
   * @param ranking : 已经完成比赛的颜色（数组：['red','orange']），先赢的排前面
   */
  getNotCompleteColors (choosedColors, ranking) {
    let notCompleteColors = []
    for (let i = 0; i < choosedColors.length; i++) {
      if (!ranking.includes(choosedColors[i])) {
        notCompleteColors.push(choosedColors[i])
      }
    }
    
    return notCompleteColors
  }
  
  /**
   * 找到新的 下一步玩家颜色 ，返回
   * @param oldRanking : 老的已完成游戏的颜色
   * @param newRanking : 新的已完成游戏的颜色
   * @param oldCurrentPlayingColor ： 老的当前玩家颜色
   */
  getNewCurrentPlayingColor (oldRanking, newRanking, oldCurrentPlayingColor) {
    let newCurrentPlayingColor = ''
    let choosedColors = getChoosedColorArr(this.state.availableColors) // 已经选择的颜色
    
    // 如果没有新的颜色完成游戏
    if (oldRanking.length === newRanking.length) {
      let notCompleteColors = this.getNotCompleteColors(choosedColors, oldRanking)  // 没有完成游戏的颜色
      // 找到老的当前玩家颜色所在的索引
      let oldCurrentPlayingColorIndex = 0;
      for (let i = 0; i < notCompleteColors.length; i++) {
        if (notCompleteColors[i] === oldCurrentPlayingColor) {
          oldCurrentPlayingColorIndex = i
          break
        }
      }
      let newCurrentPlayingColorIndex = (oldCurrentPlayingColorIndex + 1) % notCompleteColors.length
      newCurrentPlayingColor = notCompleteColors[newCurrentPlayingColorIndex]
    }
    // 如果有新的颜色完成游戏
    else if (oldRanking.length < newRanking.length) {
      let newCompleteColor = newRanking[newRanking.length - 1] // 新完成游戏的颜色
      let oldNotCompleteColors = this.getNotCompleteColors(choosedColors, oldRanking)  // 老的还没有完成游戏的颜色
      // 找到 新完成游戏的颜色 在老的还没有完成游戏的颜色数组 中 的索引
      let newCompleteColorIndexInOldNotComplete = 0;
      for (let i = 0; i < oldNotCompleteColors.length; i++) {
        if (oldNotCompleteColors[i] === newCompleteColor) {
          newCompleteColorIndexInOldNotComplete = i
          break
        }
      }
      if (oldNotCompleteColors.length === 1) { // 最后一个未完成的也完成了
        newCurrentPlayingColor = ''
      } else if (oldNotCompleteColors.length > 1) {
        let newCurrentPlayingColorIndex = (newCompleteColorIndexInOldNotComplete + 1) % oldNotCompleteColors.length
        newCurrentPlayingColor = oldNotCompleteColors[newCurrentPlayingColorIndex]
      }
    }
    
    return newCurrentPlayingColor
  }
}

export default Game