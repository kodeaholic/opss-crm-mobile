import React, { Component } from 'react'
import withLayout from '../../../withLayout'
import compose from 'recompose/compose'
import ExpandableFormComponent from '../expandable-form'

import './index.css'
import Select from 'react-select'

class OptPhanMemComponent extends Component {
  render() {
    return (
      <div className="form-add-opt-container">
        <ExpandableFormComponent title="Thông tin cơ bản" expanded={true}>
          <div className="expandable-form-wrapper-field" id="type-wrapper">
            <label className="expandable-form-label-field">Cơ hội <span className="require-field"> *</span></label>
            <input name="type" type="text" className="expandable-form-input-field" value=" Hợp đồng phần mềm" disabled
                   style={{ border: 'none', marginBottom: '0' }}/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Kế toán/ Admin xác nhận
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              value={{ 'label': 'Chờ xác nhận', 'value': 'Chờ xác nhận' }}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Tình trạng <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              value={{ 'label': 'Bán hàng', 'value': 'Chờ xác nhận' }}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="lastname-wrapper">
            <label className="expandable-form-label-field">Họ &amp; tên khách hàng</label>
            <input name="lastname" type="text" className="expandable-form-input-field" value=" Vũ Minh Đức" disabled
                   style={{ border: 'none', marginBottom: '0' }}/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Ngành hàng <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              value={{ 'label': 'Thời trang', 'value': 'Chờ xác nhận' }}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Tên gian hàng </label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập tên gian hàng" value=""/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Loại khách <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              value={{ 'label': 'Cá nhân', 'value': 'Chờ xác nhận' }}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label className="expandable-form-label-field">Ngày sinh </label>
            <div className="expandable-form-input-date-wrapper">
              <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
              <i className="fa fa-calendar float-right" aria-hidden="true" style={{color: '#1492E6'}}/>
            </div>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Giới tính
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              placeholder="Lựa chọn giới tính"
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Số CMT/MST </label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập CMT/MST" value=""/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label className="expandable-form-label-field">Ngày cấp </label>
            <div className="expandable-form-input-date-wrapper">
              <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
              <i className="fa fa-calendar float-right" aria-hidden="true"/>
            </div>
          </div>
          <div className="expandable-form-wrapper-field" id="description-wrapper">
            <label className="expandable-form-label-field">Mô tả chung về khách hàng </label>
            <textarea name="description" className="expandable-form-input-field" rows="5" placeholder="Nhập mô tả chung về khách hàng"/>
          </div>
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Thông tin liên hệ">
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Thông tin hợp đồng">
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Thông tin CSKH">
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Câu hỏi thường">
        </ExpandableFormComponent>
      </div>
    )
  }
}

export default compose(
  withLayout()
)(OptPhanMemComponent)
