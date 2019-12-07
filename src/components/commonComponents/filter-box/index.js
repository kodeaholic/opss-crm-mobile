import React, { Component } from 'react'
import './index.css'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
class ComboFilterSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  _handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value && e.target.value != '' && e.target.value.length >= 3) {
        this.props.history.push('/search/' + e.target.value)
      } else {
        toast.error('Vui lòng nhập nhập 3 kí tự trở lên')
        return false
      }
    }
  }
  render() {
    let defaultValue = this.props.defaultValue
    let filters = this.props.filters
    let onChange = this.props.onChange
    let placeHolder = this.props.placeholder
    let label = this.props.label
    return (
      <div>
        <div className="under-wrapper-header">
          &nbsp;
        </div>
        <div className="wrapper-filter-search">
          <div className="wrapper-search">
            <label className="search-label">&nbsp;</label>
            <div className="search">
              {/*<i className="fa fa-search search-icon" aria-hidden="true"/>*/}
              <form action="#" id="search-form" onSubmit={e => {
                e.preventDefault()
              }} autoComplete="off">
                <input type="search" className="input-search-filter-box"
                       placeholder="&#xF002; Nhập tìm kiếm nhanh"
                       defaultValue={this.props.match.params.keyword}
                       onKeyPress={this._handleSearchEnter}
                       name="search" id="search"/>
              </form>
            </div>
          </div>
          <div className="wrapper-filter">
            <label className="filter-label">{label}</label>
            <div className="filter">
              <Select
                classNamePrefix="react-select"
                value={defaultValue}
                options={filters}
                placeholder={placeHolder}
                onChange={onChange}
                isSearchable={this.props.isSearchable}
                components={{
                  IndicatorSeparator: () => null
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ComboFilterSearch)