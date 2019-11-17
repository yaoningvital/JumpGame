import React from 'react'
import Board from './Board'
import '../index.scss'
import { circlesDefault, RED } from '../utils'
import clickAudio from '../assets/audio/click02.wav'

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
      boardRotateDirection: '+', // 棋盘旋转的方向（顺时针+ ，逆时针-）
      boardRotateDegNum: 0, // 棋盘旋转的角度
    }
  }
  
  render () {
    let currentCircles;
    
    currentCircles = this.state.history[this.state.currentStep].circles
    
    return (
      <div className="game">
        {/*<img src={tiaoQi} alt=""/>*/}
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
            <button onClick={() => this.choosePlayerNum(1)}>1人玩</button>
            <button onClick={() => this.choosePlayerNum(2)}>2人玩</button>
            <button onClick={() => this.choosePlayerNum(3)}>3人玩</button>
            <button onClick={() => this.choosePlayerNum(4)}>4人玩</button>
            <button onClick={() => this.choosePlayerNum(5)}>5人玩</button>
            <button onClick={() => this.choosePlayerNum(6)}>6人玩</button>
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
  
  
  // 选择玩家数
  choosePlayerNum (playerNum) {
    if (this.state.playing) return // 游戏还没开始，才可以选择玩家数量
    // 1个玩家
    if (playerNum === 1) {
      let circles = circlesDefault.slice()
      for (let i = circles.length - 4; i < circles.length; i++) {
        for (let j = 0; j < circles[i].length; j++) {
          circles[i][j].color = RED
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
    console.log('e:', e)
    console.log('e.target.value:', e.target.value)
    this.setState({
      boardRotateDirection: e.target.value
    })
  }
  
  setRotateDegNum (e) {
    let deg = Number(e.target.value.trim())
    if (e.keyCode === 13 && !isNaN(deg)) {
      this.setState({
        boardRotateDegNum: deg
      })
    }
  }
}

export default Game