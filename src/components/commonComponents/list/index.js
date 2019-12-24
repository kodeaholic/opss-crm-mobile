import React, { Component } from 'react'
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component'
import _ from 'lodash'

export default class List extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
  }

  handleChange = event => {
  }

  componentDidMount() {
    let div = document.getElementsByClassName('infinite-scroll-component')[0]
    div.style.scrollBehavior = 'smooth'

    /* Update position of btn scrollToTop and addNew */
    let list = document.getElementById('scrollableDiv')
    let scrollToTopBtn = document.getElementById('scrollToTopBtn')
    let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (list.offsetHeight < (vh - 235)) {
      /*  index.css | max-height: calc(100vh - 235px) */
      scrollToTopBtn.style.display = 'none'
      let addNewBtn = document.getElementById('addNewBtn')
      if (addNewBtn) addNewBtn.style.bottom = '75px'
    }
  }

  render() {
    let data = this.props.data
    let fetchMoreData = this.props.fetchMoreData
    let refreshData = this.props.refreshData
    let hasMoreData = this.props.hasMoreData
    let isLoading = this.props.isLoading
    let renderItemList = this.props.renderItemList
    return (
      <div
        className="wrapper-list"
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={data.length} //This is important field to render the next data
          next={fetchMoreData}
          hasMore={hasMoreData && !isLoading}
          loader={<div className="list-spinner"/>}
          // loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
          refreshFunction={refreshData}
          pullDownToRefresh
          pullDownToRefreshContent={
            <h4 style={{ textAlign: 'center' }}>&#8595; Pull down & release to refresh</h4>
          }
          releaseToRefreshContent={
            <h4 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h4>
          }
        >
          {data
            ? _.map(data, (item, key) => {
              return renderItemList(item, key)
            })
            : null}
        </InfiniteScroll>
      </div>
    )
  }
}
