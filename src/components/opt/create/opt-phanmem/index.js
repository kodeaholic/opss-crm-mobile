import React, { Component } from 'react'
import withLayout from '../../../withLayout'
import compose from 'recompose/compose'
import ExpandableFormComponent from '../expandable-form'

import './index.css'
import Select from 'react-select'

class OptPhanMemComponent extends Component {
  focusParentDateInput = (e) => {
    let input = e.target.previousSibling
    if (input) {
      input.click() /* For mobile users */
      input.focus() /* For pc users */
    }
  }
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
              isSearchable={false}
              value={{ 'label': 'Chờ xác nhận', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Tình trạng <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              value={{ 'label': 'Bán hàng', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
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
              isSearchable={false}
              value={{ 'label': 'Thời trang', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Tên gian hàng </label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập tên gian hàng"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Loại khách <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              value={{ 'label': 'Cá nhân', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label className="expandable-form-label-field">Ngày sinh </label>
            <div className="expandable-form-input-date-wrapper">
              <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
              <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput} style={{color: '#1492E6'}}/>
            </div>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Giới tính
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              placeholder="Lựa chọn giới tính"
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Số CMT/MST </label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập CMT/MST"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label className="expandable-form-label-field">Ngày cấp </label>
            <div className="expandable-form-input-date-wrapper">
              <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
              <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput}/>
            </div>
          </div>
          <div className="expandable-form-wrapper-field" id="description-wrapper">
            <label className="expandable-form-label-field">Mô tả chung về khách hàng </label>
            <textarea name="description" className="expandable-form-input-field" rows="5" placeholder="Nhập mô tả chung về khách hàng"/>
          </div>
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Thông tin liên hệ">
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Số điện thoại <span className="require-field"> *</span></label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập số điện thoại"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Địa chỉ chi tiết <span className="require-field"> *</span></label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập địa chỉ chi tiết"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Primary Email <span className="require-field"> *</span></label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập địa chỉ email"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Thàng phố/ Tỉnh <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              value={{ 'label': 'Hồ Chí Minh', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Quận/ Huyện <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              value={{ 'label': 'Quận 1', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Khu vực <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              value={{ 'label': 'Sài Gòn', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Nguồn khách hàng <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              value={{ 'label': 'Hotline', 'value': 'Chờ xác nhận' }}
              onChange={() => { return false}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="description-wrapper">
            <label className="expandable-form-label-field">Mô tả nguồn khách hàng </label>
            <textarea name="description" className="expandable-form-input-field" rows="5" placeholder="Nhập mô tả nguồn khách hàng"/>
          </div>
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Thông tin hợp đồng">
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Số hợp đồng</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập số hợp đồng"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Mã khuyến mãi</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập mã khuyến mãi"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Người đại diện</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập người đại diện"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Gói hợp đồng
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              placeholder="Lựa chọn gói"
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Thời hạn (số tháng)</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập thời hạn"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Khuyến mãi (số tháng)</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập khuyến mãi"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Hình thức thanh toán
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              placeholder="Lựa chọn hình thức thanh toán"
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Thanh toán</label>
            <span className="input-vnd-unit">
              <input name="cf_contact_website" type="text" className="expandable-form-input-field" placeholder="Nhập số tiền thanh toán" defaultValue="0"/>
            </span>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label className="expandable-form-label-field">Ngày kí hợp đồng </label>
            <div className="expandable-form-input-date-wrapper">
              <input name="cf_contact_website" type="date" className="expandable-form-input-field"/>
              <i className="fa fa-calendar float-right" aria-hidden="true" onClick={this.focusParentDateInput}/>
            </div>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Số lượng cửa hàng</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập số lượng cửa hàng"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Địa chỉ</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập địa chỉ"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Địa chỉ chi nhánh</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"
                   placeholder="Nhập địa chỉ chi nhánh"/>
          </div>
          <div className="expandable-form-wrapper-field" id="description-wrapper">
            <label className="expandable-form-label-field">Ghi chú </label>
            <textarea name="description" className="expandable-form-input-field" rows="5" placeholder="Nhập ghi chú"/>
          </div>
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Thông tin CSKH">
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Người xử lý <span className="require-field"> *</span>
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              placeholder="Chọn người xử lý"
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Gọi CSKH
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              defaultValue={{label: 'Chưa gọi', value: 'Chưa gọi'}}
            />
          </div>
          <div className="expandable-form-wrapper-field" id="cf_pot_status-wrapper">
            <label className="expandable-form-label-field">
              Đánh giá
            </label>
            <Select
              classNamePrefix="expandable-form-react-select"
              isSearchable={false}
              placeholder="Chọn đánh giá"
            />
          </div>
          <div className="expandable-form-wrapper-field" id="description-wrapper">
            <label className="expandable-form-label-field">Phản hồi CSKH </label>
            <textarea name="description" className="expandable-form-input-field" rows="5" placeholder="Nhập phản hồi CSKH"/>
          </div>
        </ExpandableFormComponent>
        <ExpandableFormComponent title="Câu hỏi thường gặp">
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Tình hình kinh doanh hiện nay của khách hàng ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Hình thức công cụ quản lý hiện nay ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Tính năng của Kiot Việt là yếu tố quyết định ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Điểm yếu nào của Kiot Việt khiến khách hàng cân nhắc ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Khó khăn khách hàng đang gặp phải ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Tính chủ động của khách hàng ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Yếu tố nào ngăn cản khách hàng quyết định ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
          <div className="expandable-form-wrapper-field" id="cf_contact_website-wrapper">
            <label
              className="expandable-form-label-field">Đối thủ nào đã tiếp cận khách hàng ?</label>
            <input name="cf_contact_website" type="text"
                   className="expandable-form-input-field"/>
          </div>
        </ExpandableFormComponent>
        <button className="create-opt-button">Tạo</button>
      </div>
    )
  }
}

export default compose(
  withLayout()
)(OptPhanMemComponent)
