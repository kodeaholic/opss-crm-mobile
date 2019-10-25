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
  {
    name: 'Opportunity',
    classIcon: 'fa fa-file-text-o',
    path: '/opportunity'
  },
  {
    name: 'Ticket',
    classIcon: 'fa fa-comment-o',
    path: '/ticket'
  }
]

const functionMenu = ['customer-details', '222']

const menuCustomerList = [
  {
    name: 'Sửa',
    classIcon: 'fa fa-list-alt',
    path: '/edit'
  },
  {
    name: 'Convert',
    classIcon: 'fa fa-user-o',
    path: '/convert'
  },
  {
    name: '+ Ticket',
    classIcon: 'fa fa-comment-o',
    path: '/ticket'
  },
  {
    name: '+ Công việc',
    classIcon: 'fa fa-tasks',
    path: '/working'
  },
  {
    name: '+ Cuộc hẹn',
    classIcon: 'fa fa-history',
    path: '/meeting'
  }
]

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.renderItemMenu = this.renderItemMenu.bind(this)
  }

  renderItemMenu(item, key) {
    return (
      <div className="wrapper-item-footer" key={key + item.name}>
        <Link to={item.path} className="wrapper-circle-icon">
          <i
            className={item.classIcon}
            aria-hidden="true"
            style={{
              fontSize: 18,
              color: '#ffffff',
              paddingTop: 2
            }}></i>
        </Link>
        <label className="label-menu">{item.name}</label>
      </div>
    )
  }

  render() {
    const pathName = _.get(this.props, 'location.pathname').substring(1)
    var res = pathName.split('/')[0]
    const isFunction = !!functionMenu.find(e => e === res)
    return (
      <div className="wrapper-footer">
        {_.map(isFunction ? menuCustomerList : menuList, (item, key) =>
          this.renderItemMenu(item, key)
        )}
      </div>
    )
  }
}

export default withRouter(Footer)
