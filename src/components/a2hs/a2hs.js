import React, { Component } from 'react'
import './a2hs.css'
class AddToHomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    let deferredPrompt
    const addBtn = document.getElementById('button-install')
    addBtn.style.display = 'none'
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      deferredPrompt = e
      // Update UI to notify the user they can add to home screen
      addBtn.style.display = 'block'

      addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none'
        // Show the prompt
        deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt')
          } else {
            console.log('User dismissed the A2HS prompt')
          }
          deferredPrompt = null
        })
      })
    })
    window.addEventListener('appinstalled', (evt) => {
      console.log('a2hs installed')
    })
  }

  renderAppleDeviceGuide = () => {
    return (
      <div className="guide" id="img-guideline-slider">
        <img src={require('../../static/images/ios-guide-01.png')} alt="iOS guide to add to home screen"
             id="img-guide-1" className="active-image"/>
        <img src={require('../../static/images/ios-guide-02.png')} alt="iOS guide to add to home screen"
             id="img-guide-2"/>
        <img src={require('../../static/images/ios-guide-03.png')} alt="iOS guide to add to home screen"
             id="img-guide-3"/>
        <button className="button-slider left-button" onClick={this.goPrev} style={{ display: 'none' }} id="left-btn-slider">
          <i className="fa fa-angle-left fa-3x" aria-hidden="true"/>
        </button>
        <button className="button-slider right-button" onClick={this.goNext} id="right-btn-slider">
          <i className="fa fa-angle-right fa-3x" aria-hidden="true"/>
        </button>
      </div>
    )
  }

  renderAndroidGuide = () => {
    return (
      <div className="guide" id="img-guideline-slider">
        <img src={require('../../static/images/android-guide-01.png')} alt="Android guide to add to home screen"
             id="img-guide-1" className="active-image"/>
        <img src={require('../../static/images/android-guide-02.png')} alt="Android guide to add to home screen"
             id="img-guide-2"/>
        <img src={require('../../static/images/android-guide-03.png')} alt="Android guide to add to home screen"
             id="img-guide-3"/>
        <button className="button-slider left-button" onClick={this.goPrev} style={{ display: 'none' }} id="left-btn-slider">
          <i className="fa fa-angle-left fa-3x" aria-hidden="true"/>
        </button>
        <button className="button-slider right-button" onClick={this.goNext} id="right-btn-slider">
          <i className="fa fa-angle-right fa-3x" aria-hidden="true"/>
        </button>
      </div>
    )
  }

  displayBtn = (type = 'left') => {
    let btn = document.getElementById(type + '-btn-slider')
    btn.style.display = 'block'
  }
  hideBtn = (type = 'left') => {
    let btn = document.getElementById(type + '-btn-slider')
    btn.style.display = 'none'
  }

  goNext = (e) => {
    e.preventDefault()
    let img = document.getElementsByClassName('active-image')[0]
    let imgId = img.id
    let index = imgId.split('-')[2]
    switch (index) {
      case '1':
        document.getElementById('img-guide-' + 2).classList.add('active-image')
        document.getElementById('img-guide-' + index).classList.remove('active-image')
        document.getElementById('img-guide-' + 3).classList.remove('active-image')
        this.displayBtn('left')
        this.displayBtn('right')
        break
      case '2':
        this.hideBtn('right')
        this.displayBtn('left')
        document.getElementById('img-guide-' + 3).classList.add('active-image')
        document.getElementById('img-guide-' + index).classList.remove('active-image')
        document.getElementById('img-guide-' + 1).classList.remove('active-image')
        break
      case '3':
        this.hideBtn('left')
        this.displayBtn('right')
        document.getElementById('img-guide-' + 1).classList.add('active-image')
        document.getElementById('img-guide-' + index).classList.remove('active-image')
        document.getElementById('img-guide-' + 2).classList.remove('active-image')
        break
    }
  }

  goPrev = (e) => {
    e.preventDefault()
    let img = document.getElementsByClassName('active-image')[0]
    let imgId = img.id
    let index = imgId.split('-')[2]
    switch (index) {
      case '1':
        document.getElementById('img-guide-' + 3).classList.add('active-image')
        document.getElementById('img-guide-' + index).classList.remove('active-image')
        document.getElementById('img-guide-' + 2).classList.remove('active-image')
        this.displayBtn('left')
        this.hideBtn('right')
        break
      case '2':
        this.hideBtn('left')
        this.displayBtn('right')
        document.getElementById('img-guide-' + 1).classList.add('active-image')
        document.getElementById('img-guide-' + index).classList.remove('active-image')
        document.getElementById('img-guide-' + 3).classList.remove('active-image')
        break
      case '3':
        this.displayBtn('left')
        this.displayBtn('right')
        document.getElementById('img-guide-' + 2).classList.add('active-image')
        document.getElementById('img-guide-' + index).classList.remove('active-image')
        document.getElementById('img-guide-' + 3).classList.remove('active-image')
        break
    }
  }

  renderGuideLineTitle = () => {
    return (
      <div className="guideline-text">
        Hướng dẫn thêm app vào màn hình chính để sử dụng
      </div>
    )
  }

  render() {
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    let android = !!navigator.userAgent && /Android/.test(navigator.userAgent)
    let buttonInstall = document.getElementById('button-install')
    let buttonInstallDisplayed = buttonInstall ? buttonInstall.style.display !== 'none' : false
    return (
      <div className="add-to-home-screen-container">
        <p className="promotion">
          Team OPSS xin cảm ơn bạn đã sử dụng CRM Mobile. Ứng dụng hoạt động tốt nhất trên Chrome/Android và Safari/iOS
        </p>
        <button className="btn-add-to-home-screen glow" id="button-install" style={{ display: 'none' }}>
          Thêm vào màn hình chính
        </button>
        {iOS && !buttonInstallDisplayed && this.renderAppleDeviceGuide()}
        {android && !buttonInstallDisplayed && this.renderAndroidGuide()}
        {!buttonInstallDisplayed && this.renderGuideLineTitle()}
      </div>
    )
  }

}

export default AddToHomeScreen
