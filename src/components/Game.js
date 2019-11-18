import React from 'react'
import Board from './Board'
import '../index.scss'
import { circlesDefault, COLORS, GREEN, RED } from '../utils'
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
      availableColors: this.initAvailableColors(COLORS)
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
            <button onClick={() => this.choosePlayerNum(1)}>1人玩</button>
            <button onClick={() => this.choosePlayerNum(2)}>2人玩</button>
            <button onClick={() => this.choosePlayerNum(3)}>3人玩</button>
            <button onClick={() => this.choosePlayerNum(4)}>4人玩</button>
            <button onClick={() => this.choosePlayerNum(5)}>5人玩</button>
            <button onClick={() => this.choosePlayerNum(6)}>6人玩</button>
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
                        disabled={colorItem.disabled}
                      />
                      <button
                        style={{
                          opacity: colorItem.disabled ? 0.4 : 1,
                          backgroundImage: `radial-gradient(at 80px 80px, rgba(0,0,0,0), ${colorItem.colorValue})`
                        }}
                        onClick={() => this.chooseCircleColor(colorItem.colorValue)}
                        disabled={colorItem.disabled}
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
  
  // 初始化 this.state.availableColors
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
  
  // 选择玩家数
  choosePlayerNum (playerNum) {
    if (this.state.playing) return // 游戏还没开始，才可以选择玩家数量
    
    this.setState({
      playerNum: playerNum
    })
    // 1个玩家
    if (playerNum === 1) {
      // 更新 颜色面板 checked 状态
      this.updateCirclesColorCheckedStatus(RED)
      // 更新 颜色面板 disabled 状态
      this.updateCirclesColorDisabledStatus()
      // 更新 棋盘中棋子的颜色
      this.updateCirclesColorInBoard()
    }
    // 2个玩家
    else if (playerNum === 2) {
      let circles = circlesDefault.slice()
      for (let i = circles.length - 4; i < circles.length; i++) {
        for (let j = 0; j < circles[i].length; j++) {
          circles[i][j].color = RED
        }
      }
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < circles[i].length; j++) {
          circles[i][j].color = GREEN
        }
      }
      this.setState({
        history: [
          {
            circles: circles
          }
        ]
      })
    }
    
    
  }
  
  handleClickCircle () {
    let audioEle = document.getElementById('click-audio')
    audioEle.play()
  }
  
  
  // 设置棋子半径r
  setCircleRadius (e) {
    let r = Number(e.target.value.trim())
    if (e.keyCode === 13 && !isNaN(r)) {
      this.setState({
        r: r
      })
    }
  }
  
  // 设置相邻棋子之间的距离
  setCirclesDistance (e) {
    let a = Number(e.target.value.trim())
    if (e.keyCode === 13 && !isNaN(a)) {
      this.setState({
        a: a
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
  
  // 选择棋子颜色
  chooseCircleColor (color) {
    // 先要选择玩家数
    if (this.state.playerNum === 0) {
      alert('请先选择玩家数')
      return
    }
    
    // 更新 颜色面板 checked 状态
    this.updateCirclesColorCheckedStatus(color)
    // 更新 颜色面板 disabled 状态
    this.updateCirclesColorDisabledStatus()
    // 更新 棋盘中棋子的颜色
    this.updateCirclesColorInBoard()
  }
  
  // 更新已经选择的颜色在选择面板的 checked 状态
  updateCirclesColorCheckedStatus (color) {
    // console.log('this.state.availableColors:', this.state.availableColors)
    // let availableColors = _.cloneDeep(this.state.availableColors)
    let availableColors = this.state.availableColors.slice()
    
    for (let colorItem of availableColors) {
      if (colorItem.colorValue === color) {
        colorItem.checked = !colorItem.checked
        break
      }
    }
    this.setState({
      availableColors: availableColors
    })
    
  }
  
  // 根据当前选择的玩家数，更新该颜色是否可选的状态 disabled
  updateCirclesColorDisabledStatus () {
    let availableColors = this.state.availableColors.slice()
    
    let canAddColor; // 是否可以继续追加颜色
    let checkedNum = 0;  // 已经勾选的颜色数量
    for (let colorItem of availableColors) {
      if (colorItem.checked) {
        checkedNum++
      }
    }
    
    canAddColor = !(checkedNum >= this.state.playerNum)
    
    // 如果不能再追加勾选颜色了，把其他没选上的都设置为 disabled=true
    if (!canAddColor) {
      for (let colorItem of availableColors) {
        if (!colorItem.checked) {
          colorItem.disabled = true
        }
      }
      
      this.setState({
        availableColors
      })
    }
    // 还能再追加颜色，让所有颜色的 disabled 都为 false
    else {
      for (let colorItem of availableColors) {
        colorItem.disabled = false
      }
      
      this.setState({
        availableColors
      })
    }
  }
  
  // 根据当前颜色面板中选择的颜色，更新棋盘中棋子的颜色。游戏开始后就不能更改棋盘中棋子的颜色了
  updateCirclesColorInBoard () {
    if (this.state.playing) return
    
    // 先找出 现在颜色面板 选择了 哪几种颜色
    let choosedColors = []
    for (let colorItem of this.state.availableColors) {
      if (colorItem.checked) {
        choosedColors.push(colorItem.colorValue)
      }
    }
    
    // 当前没有颜色被选中，所有棋子重置为 默认状态
    if (choosedColors.length === 0) {
      this.setInitialHistoryState(circlesDefault)
    }
    // 当前选择了 1 种颜色，更新 南边 棋子的颜色为这个颜色
    else if (choosedColors.length === 1) {
      this.setSouthCirclesColor(choosedColors[0])
    }
    // 当前
  }
  
  // 更新 history 的初始状态
  setInitialHistoryState (circles) {
    this.setState({
      history: [
        {
          circles: circles
        }
      ]
    })
  }
  
  // 设置棋盘 南边 10颗棋子 的颜色
  setSouthCirclesColor (color) {
    let history = this.state.history
    // 如果history里有两条及以上记录，说明游戏已经开始，游戏开始后不能再更改棋子颜色
    if (history.length > 1) return
    
    let circles = _.cloneDeep(history[0].circles)
    
    for (let i = circles.length - 4; i < circles.length; i++) {
      for (let j = 0; j < circles[i].length; j++) {
        circles[i][j].color = color
      }
    }
    
    this.setInitialHistoryState(circles)
  }
}

export default Game