import React, { Component } from 'react'
import './a2hs.css'
class AddToHomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
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
      console.log('a2hs installed');
    })
  }

  renderAppleDeviceGuide = () => {
    return (
      <div className="guide">

      </div>
    )
  }

  renderAndroidGuide = () => {
    return (
      <div className="guide">

      </div>
    )
  }

  render() {
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    let android = !!navigator.userAgent && /Android/.test(navigator.userAgent)
    return (
      <div className="add-to-home-screen-container">
        <p className="promotion">
          Team OPSS xin cảm ơn bạn đã sử dụng CRM Mobile. Ứng dụng hoạt động tốt nhất trên Chrome/Android và Safari/iOS
        </p>
        <button className="btn-add-to-home-screen glow" id="button-install" style={{display: 'none'}}>
          Thêm vào màn hình chính
        </button>
        {iOS && this.renderAppleDeviceGuide()}
        {android && this.renderAndroidGuide()}
      </div>
    )
  }

}

export default AddToHomeScreen
