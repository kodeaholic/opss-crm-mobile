import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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

const menuContactFunction = [
  {
    name: 'Sửa',
    classIcon: 'fa fa-list-alt',
    path: '/contact-edit',
    icon: 'edit.png'
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
    let hideFooter = this.props.location.pathname.indexOf('edit') !== -1 || this.props.location.pathname.indexOf('convert') !== -1 || this.props.location.pathname.indexOf('create') !== -1 || this.props.location.pathname.indexOf('search/') !== -1
    return (
      <div className="wrapper-footer" style={{display: hideFooter ? 'none' : ''}} id="wrapper-footer">
        {_.map(menuToBeRendered, (item, key) =>
          this.renderItemMenu(item, key, itemId)
        )}
      </div>
    )
  }
}

export default withRouter(Footer)
