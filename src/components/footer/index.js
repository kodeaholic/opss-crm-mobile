import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import _ from 'lodash'
import './index.css'

const menuList = [
  {
    name: 'Dashboard',
    classIcon: 'fa fa-columns',
    path: '/dashboard',
    icon: 'dashboard.png'
  },

  {
    name: 'Lead',
    classIcon: 'fa fa-users',
    path: '/lead',
    icon: 'lead.png'
  },
  {
    name: 'Contact',
    classIcon: 'fa fa-address-book-o',
    path: '/contact',
    icon: 'contact.png'
  },
  {
    name: 'Opportunity',
    classIcon: 'fa fa-handshake-o', //fa-sticky-note-o
    path: '/opportunity',
    icon: 'opp.png'
  },
  {
    name: 'More',
    classIcon: 'fa fa-cog', //fa-sticky-note-o
    path: '/more',
    icon: 'more.png'
  }
  // {
  //   name: 'Opportunity',
  //   classIcon: 'fa fa-file-text-o',
  //   path: '/opportunity'
  // },
  // {
  //   name: 'Ticket',
  //   classIcon: 'fa fa-comment-o',
  //   path: '/ticket'
  // }
]

const functionMenu = ['lead-view', 'contact-view']

const menuLeadFunction = [
  {
    name: 'Sửa',
    classIcon: 'fa fa-list-alt',
    path: '/lead-edit',
    icon: 'edit.png'
  },
  {
    name: 'Convert',
    classIcon: 'fa fa-user-o',
    path: '/lead-convert',
    icon: 'convert.png'
  }
]

const renderOptSelection = () => {
  let onClickOuter = () => {
    let popup = document.getElementById('optSelectionPopup')
    popup.style.visibility = 'hidden'
  }
  let onClickInner = (e) => {
    e.stopPropagation()
  }
  let showRightAngle = (e) => {
    e.preventDefault()
    let id = e.target.id
    e.target.childNodes[1].style.visibility = 'visible'
    /* Disable all links */
    let links = document.getElementsByClassName('opt-selection-row-content')
    Array.prototype.forEach.call(links, function(el) {
      el.removeAttribute("href")
    })
    e.target.style.color = "#006CAD"
    let pathName = window.location.pathname
    let recordId = pathName.split('/')[2] // contact-id
    let href = window.location.href
    let basePath = window.location.pathname
    basePath = basePath.substring(basePath.indexOf('/') + 1)
    let pathBack = basePath + window.location.search
    let goTo = e.target.getAttribute("path")
    if (goTo) href = href.replace(pathName, goTo + "/" + recordId + "?pathBack=" + pathBack)
    else {
      alert(goTo)
      href = href.replace(pathName, '/contact-view/' + recordId + "?pathBack=" + pathBack)
    }
    setTimeout(() => {
      window.location.href = href
    }, 50)
  }
  return (
    <div className="opt-selection-popup" id="optSelectionPopup" onClick={onClickOuter}>
      <div className="opt-selection-container" onClick={onClickInner}>
        <div className="opt-selection-popup-header">
          Loại hợp đồng
        </div>
        <div className="opt-selection-wrapper">
          <div className="opt-selection-row">
            <Link to={"#"} id="optPhanMem" className="opt-selection-row-content" href="#" onClick={showRightAngle} path="/opt-phan-mem">Hợp đồng phần mềm <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng phần cứng <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng tái ký KPI <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng nâng gói KPI <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng thêm CN KPI <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng tái ký <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng nâng gói <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng thêm chi nhánh <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng giao vận <span className="right-angle">&#8250;</span></Link>
          </div>
          <div className="opt-selection-row">
            <Link to={"#"} className="opt-selection-row-content" href="#" onClick={showRightAngle}>Hợp đồng dịch vụ gia tăng <span className="right-angle">&#8250;</span></Link>
          </div>
        </div>

      </div>
    </div>
  )
}

const openOptSelection = () => {
  let optSelectionPopUp = document.getElementById('optSelectionPopup')
  optSelectionPopUp.style.visibility = 'visible'
}

const menuContactFunction = [
  {
    name: 'Sửa',
    classIcon: 'fa fa-list-alt',
    path: '/contact-edit',
    icon: 'edit.png'
  },
  {
    name: '+ Opportunity',
    classIcon: 'fa fa-list-alt',
    clickToOpenPopUp: openOptSelection,
    icon: 'opp.png'
  },
]

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.renderItemMenu = this.renderItemMenu.bind(this)
  }

  clickToReloadPage = (e) => {
    e.preventDefault()
    document.location.reload()
  }

  renderItemMenu(item, key, id) {
    let currentPath = this.props.location.pathname
    let checkActive = currentPath.indexOf(item.path) !== -1 || (item.name === 'More' && (currentPath.indexOf('calendar') !== -1 || currentPath.indexOf('ticket') !== -1))
    let active = checkActive ? ' active' : ''
    let activeIcon = checkActive ? ' icon-active' : ''
    let styleColor = checkActive ? {color: '#006cad'} : {}
    let basePath = this.props.location.pathname
    basePath = basePath.substring(basePath.indexOf('/') + 1)
    let pathBack = basePath + this.props.location.search
    let onClickDiv = (e) => {
      let a = e.target.childNodes[0]
      if (a && a.tagName === 'A') {
        console.log(a.tagName)
        a.click()
      }
    }
    if (id) {
      if (typeof item.clickToOpenPopUp !== 'undefined') {
        return (
          <button className={"wrapper-footer-link"} key={item.name + id} style={{border: 'none', backgroundColor: '#ffffff'}} onClick={item.clickToOpenPopUp}>
            <img
              alt={item.name}
              src={require('../../static/icons/' + item.icon)}
              className={"responsive-footer-icon" + activeIcon}
            />
            <label className={"label-menu " + active}>{item.name}</label>
          </button>
        )
      }
      return (
        <Link to={item.path + '/' + id + "?pathBack=" + pathBack} className={"wrapper-footer-link" + active} key={item.name + id}>
          {/*<i*/}
          {/*  className={item.classIcon + " footer-icon " + active}*/}
          {/*  style={styleColor}*/}
          {/*  aria-hidden="true"/>*/}
          <img
            alt={item.name}
            src={require('../../static/icons/' + item.icon)}
            className={"responsive-footer-icon" + activeIcon}
          />
          <label className={"label-menu " + active}>{item.name}</label>
        </Link>
      )
    }
    else {
      return (
        <Link to={item.path} className={"wrapper-footer-link" + active} key={item.name + id}
              onClick={item.path === currentPath ? this.clickToReloadPage : () => {
                return true
              }}>
          {/*<i*/}
          {/*  className={item.classIcon + " footer-icon " + active}*/}
          {/*  aria-hidden="true"*/}
          {/*  style={styleColor}/>*/}
          <img
            alt={item.name}
            src={require('../../static/icons/' + item.icon)}
            className={"responsive-footer-icon" + activeIcon}
          />
          <label className={"label-menu " + active}>{item.name}</label>
        </Link>
      )
    }
  }

  render() {
    const pathName = _.get(this.props, 'location.pathname').substring(1)
    let res = pathName.split('/')
    const isFunction = !!functionMenu.find(e => e === res[0])
    let itemId = undefined
    if (res.length >= 2 && isFunction) itemId = res[1]
    let menuToBeRendered = undefined
    if (isFunction && pathName.indexOf("contact") !== -1) {
      menuToBeRendered = menuContactFunction
    } else if (isFunction && pathName.indexOf("lead") !== -1) {
      menuToBeRendered = menuLeadFunction
    }
    else menuToBeRendered = menuList
    let pathNameToCheck = this.props.location.pathname
    let hideFooter = pathNameToCheck.indexOf('edit') !== -1 || pathNameToCheck.indexOf('convert') !== -1 || pathNameToCheck.indexOf('create') !== -1 || pathNameToCheck.indexOf('search/') !== -1 || pathNameToCheck.indexOf('/opt-') !== -1
    return (
      <div className="wrapper-footer" style={{display: hideFooter ? 'none' : ''}} id="wrapper-footer">
        {renderOptSelection()}
        {_.map(menuToBeRendered, (item, key) =>
          this.renderItemMenu(item, key, itemId)
        )}
      </div>
    )
  }
}

export default withRouter(Footer)
