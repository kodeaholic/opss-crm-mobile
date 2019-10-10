import React, { Component } from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Wrapper = styled.div`
  min-height: 60px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  border-top: 0.5px solid #8a8a8a;
`

const Item = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ItemCircle = styled.div`
  width: 30px;
  height: 30px;
  border: 0.5px solid #d7d7d7;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const ItemName = styled.label`
  font-size: 12px;
`

const menuList = [
  {
    name: 'Lead',
    classIcon: 'fa fa-list-alt'
  },
  {
    name: 'Contact',
    classIcon: 'fa fa-user-o'
  },
  {
    name: 'Opportunity',
    classIcon: 'fa fa-file-text-o'
  },
  {
    name: 'Ticket',
    classIcon: 'fa fa-comment-o'
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
      <Item key={key + item.name}>
        <ItemCircle>
          <i
            className={item.classIcon}
            aria-hidden="true"
            style={{
              fontSize: 18,
              color: '#444444',
              paddingTop: 2
            }}></i>
        </ItemCircle>
        <ItemName>{item.name}</ItemName>
      </Item>
    )
  }

  render() {
    return (
        <Wrapper>
          {_.map(menuList, (item, key) => this.renderItemMenu(item, key))}
        </Wrapper>
    )
  }
}
