import React, { Component } from 'react'
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component'
import _ from 'lodash'

export default class ListCard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let data = this.props.data
    let renderItemList = this.props.functionRenderItem
    let name = this.props.name
    let setBorderBottomCardTitle = data.length === 0
    let clickToExpand = () => {
      let div = document.getElementById('scrollableDiv-' + name)
      let title = document.getElementById('card-title-' + name)
      if (div.style.display !== "block" && div.style.display) {
        if (data.length > 0) div.style.display = "block";
        if (data.length > 0) {
          title.style.borderBottomLeftRadius = '0'
          title.style.borderBottomRightRadius = '0'
        }
      } else {
        div.style.display = "none";
        title.style.borderBottomLeftRadius = '5px'
        title.style.borderBottomRightRadius = '5px'
      }
    }
    return (
      <div className="card-wrapper">
        <div className="card-title" id={"card-title-" + name} onClick={clickToExpand} style={{overflow: 'hidden', borderBottomLeftRadius: setBorderBottomCardTitle ? '5px' : '0', borderBottomRightRadius: setBorderBottomCardTitle ? '5px' : '0'}}>
          {name} <span>{data.length}</span>
        </div>
        <div
          className="card-body"
          id={"scrollableDiv-" + name} style={{display: data.length > 0 ? '' : 'none'}}
        >
          <InfiniteScroll
            dataLength={data.length}
            hasMore={false}
            scrollableTarget={"scrollableDiv-" + name}
          >
            {data
              ? _.map(data, (item, key) => {
                return renderItemList(item, key)
              })
              : null}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}
