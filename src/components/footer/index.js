import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import _ from 'lodash'
import './index.css'

const menuList = [
  {
    name: 'Lead',
    classIcon: 'fa fa-list-alt',
    path: '/lead'
  },
  {
    name: 'Contact',
    classIcon: 'fa fa-user-o',
    path: '/contact'
  },
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

const functionMenu = ['lead-view']

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
  },
  // {
  //   name: '+ Ticket',
  //   classIcon: 'fa fa-comment-o',
  //   path: '/ticket'
  // },
  // {
  //   name: '+ Công việc',
  //   classIcon: 'fa fa-tasks',
  //   path: '/working'
  // },
  // {
  //   name: '+ Cuộc hẹn',
  //   classIcon: 'fa fa-history',
  //   path: '/meeting'
  // }
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

    return (
      <div className="wrapper-item-footer" key={key + item.name}>
        { id ? (
          <Link to={item.path + '/' + id} className="wrapper-circle-icon">
            <i
              className={item.classIcon}
              aria-hidden="true"
              style={{
                fontSize: 18,
                color: '#ffffff',
                paddingTop: 2
              }}/>
          </Link>
        ) : (<Link to={item.path} className="wrapper-circle-icon" onClick={item.path === currentPath ? this.clickToReloadPage : () => {return true}}>
          <i
            className={item.classIcon}
            aria-hidden="true"
            style={{
              fontSize: 18,
              color: '#ffffff',
              paddingTop: 2
            }}/>
        </Link>)}
        <label className="label-menu">{item.name}</label>
      </div>
    )
  }

  render() {
    const pathName = _.get(this.props, 'location.pathname').substring(1)
    let res = pathName.split('/')
    const isFunction = !!functionMenu.find(e => e === res[0])
    let itemId = undefined
    if(res.length >= 2 && isFunction) itemId = res[1]
    return (
      <div className="wrapper-footer">
        {_.map(isFunction ? menuLeadFunction : menuList, (item, key) =>
          this.renderItemMenu(item, key, itemId)
        )}
      </div>
    )
  }
}

export default withRouter(Footer)
