import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import _ from 'lodash'
import './index.css'

const menuList = [
  {
    name: 'Dashboard',
    classIcon: 'fa fa-columns',
    path: '/dashboard'
  },

  {
    name: 'Lead',
    classIcon: 'fa fa-users',
    path: '/lead'
  },
  {
    name: 'Contact',
    classIcon: 'fa fa-address-book-o',
    path: '/contact'
  },
  {
    name: 'Opportunity',
    classIcon: 'fa fa-handshake-o', //fa-sticky-note-o
    path: '/opportunity'
  },
  {
    name: 'More',
    classIcon: 'fa fa-cog', //fa-sticky-note-o
    path: '/more'
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
    path: '/lead-edit'
  },
  {
    name: 'Convert',
    classIcon: 'fa fa-user-o',
    path: '/lead-convert'
  }
]

const menuContactFunction = [
  {
    name: 'Sửa',
    classIcon: 'fa fa-list-alt',
    path: '/contact-edit'
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
    let styleColor = checkActive ? {color: '#006cad'} : {}
    let basePath = this.props.location.pathname
    basePath = basePath.substring(basePath.indexOf('/') + 1)
    let pathBack = basePath + this.props.location.search
    return (
      <div className="wrapper-item-footer" key={key + item.name}>
        {id ? (
          <Link to={item.path + '/' + id + "?pathBack=" + pathBack} className="wrapper-circle-icon">
            <i
              className={item.classIcon + " footer-icon " + active}
              style={styleColor}
              aria-hidden="true"/>
          </Link>
        ) : (<Link to={item.path} className="wrapper-circle-icon"
                   onClick={item.path === currentPath ? this.clickToReloadPage : () => {
                     return true
                   }}>
          <i
            className={item.classIcon + " footer-icon " + active}
            aria-hidden="true"
            style={styleColor}/>
        </Link>)}
        <label className={"label-menu " + active}>{item.name}</label>
      </div>
    )
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
    return (
      <div className="wrapper-footer">
        {_.map(menuToBeRendered, (item, key) =>
          this.renderItemMenu(item, key, itemId)
        )}
      </div>
    )
  }
}

export default withRouter(Footer)
