import React from 'react'
import Board from './Board'
import '../index.scss'
import { circlesDefault, RED } from '../utils'
import clickAudio from '../assets/audio/click02.wav'

// console.log('clickAudio:', clickAudio)
// console.log('tiaoQi:', tiaoQi)


class Game extends React.Component {
  constructor (props) {
    super(props)
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
          />
        </div>
        
        <div className="btns">
          <div className="player-num">
            <h4>请选择玩家数</h4>
            <button onClick={() => this.choosePlayerNum(1)}>1人玩</button>
            <button onClick={() => this.choosePlayerNum(2)}>2人玩</button>
            <button onClick={() => this.choosePlayerNum(3)}>3人玩</button>
            <button onClick={() => this.choosePlayerNum(4)}>4人玩</button>
            <button onClick={() => this.choosePlayerNum(5)}>5人玩</button>
            <button onClick={() => this.choosePlayerNum(6)}>6人玩</button>
          </div>
          <audio src={clickAudio} id="click-audio">
            您的浏览器不支持 audio 标签。
          </audio>
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
}

export default Game