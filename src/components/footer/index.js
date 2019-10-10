import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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

export default class Footer extends Component {
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
              color: '#444444',
              paddingTop: 2
            }}></i>
        </Link>
        <label>{item.name}</label>
      </div>
    )
  }

  render() {
    return (
      <div className="wrapper-footer">
        {_.map(menuList, (item, key) => this.renderItemMenu(item, key))}
      </div>
    )
  }
}
