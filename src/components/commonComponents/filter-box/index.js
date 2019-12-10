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
    let defaultOptions = this.props.defaultOptions
    let availableOptions = this.props.availableOptions

    let isDisabled = false
    if (availableOptions.users.length === 2) { // Truong hop khong phai coach, SM, admin
      defaultOptions.filterUser = availableOptions.users[1]
      availableOptions.users = [availableOptions.users[1]]
      isDisabled = true
    }
    let onChange = this.props.onChange
    let label = this.props.label
    return (
      <div>
        <div className="under-wrapper-header">
          &nbsp;
        </div>
        <div className="wrapper-filter-search">
          <div className="wrapper-search">
            {/*<label className="search-label">&nbsp;</label>*/}
            <div className="search">
              {/*<i className="fa fa-search search-icon" aria-hidden="true"/>*/}
              <form action="#" id="search-form" onSubmit={e => {
                e.preventDefault()
              }} autoComplete="off">
                <input type="search" className="input-search-filter-box"
                       placeholder="&#xF002; Global search ..."
                       defaultValue={this.props.match.params.keyword}
                       onKeyPress={this._handleSearchEnter}
                       name="search" id="search"/>
              </form>
            </div>
          </div>
          <div className="wrapper-filter">
            <label className="filter-label">{label}</label>
            <div className="filter">
              <div className="filter-item with-margin-right">
                {/* Loc theo tinh trang lead, contact */}
                <Select
                  classNamePrefix="react-select"
                  value={defaultOptions.filterStatus}
                  options={availableOptions.status}
                  placeholder="Tình trạng"
                  onChange={onChange.onFilterStatusChange}
                  isSearchable={false}
                  components={{
                    IndicatorSeparator: () => null
                  }}
                />
              </div>
              <div className="filter-item with-margin-left">
                {/* Loc theo user */}
                <Select
                  classNamePrefix="react-select"
                  value={defaultOptions.filterUser}
                  options={availableOptions.users}
                  placeholder="Người xử lý"
                  onChange={onChange.onFilterUserChange}
                  isSearchable={true}
                  components={{
                    IndicatorSeparator: () => null
                  }}
                  isDisabled={isDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ComboFilterSearch)