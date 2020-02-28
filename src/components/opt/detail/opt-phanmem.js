import React, { Component } from 'react'
import ExpandableFormComponent from '../create/expandable-form'
import './index.css'
class OptPhanMemViewComponent extends Component {

  render() {
      let potentialData = this.props.potentialData
      return (
        <div className="form-detail-opt-wrapper">
          <ExpandableFormComponent title="Thông tin cơ bản" expanded={true}>
            <div className="expandable-form-wrapper-field" id="potentialname-wrapper">
              <label className="expandable-form-label-field">Cơ hội </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.potentialname} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="approval_status-wrapper">
              <label className="expandable-form-label-field">
                Kế toán/ Admin xác nhận
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.approval_status} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="sales_stage-wrapper">
              <label className="expandable-form-label-field">
                Tình trạng
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.sales_stage.label} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="lastname-wrapper">
              <label className="expandable-form-label-field">Họ tên khách hàng</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.contact_id.label} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_nganh_hang-wrapper">
              <label className="expandable-form-label-field">
                Ngành hàng
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_nganh_hang.label} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_website-wrapper">
              <label
                className="expandable-form-label-field">Tên gian hàng </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_website} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="customer_type-wrapper">
              <label className="expandable-form-label-field">
                Loại khách
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.customer_type} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_birthday-wrapper">
              <label className="expandable-form-label-field">Ngày sinh </label>
              <div className="expandable-form-input-date-wrapper">
                <input type="text" className="expandable-form-input-field"
                       defaultValue={potentialData.cf_birthday} disabled/>
              </div>
            </div>
            {potentialData.customer_type === 'Cá nhân' && (<div className="expandable-form-wrapper-field" id="cf_gender-wrapper">
              <label className="expandable-form-label-field">
                Giới tính
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_gender} disabled/>
            </div>)}
            <div className="expandable-form-wrapper-field" id="cf_passport-wrapper">
              <label
                className="expandable-form-label-field">Số CMT/MST </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_passport} disabled/>
            </div>
            {potentialData.customer_type === 'Cá nhân' && (<div className="expandable-form-wrapper-field" id="cf_passport_date-wrapper">
              <label className="expandable-form-label-field">Ngày cấp </label>
              <div className="expandable-form-input-date-wrapper">
                <input type="text" className="expandable-form-input-field"
                       defaultValue={potentialData.cf_passport_date} disabled/>
              </div>
            </div>)}
            {potentialData.customer_type === 'Cá nhân' && ( <div className="expandable-form-wrapper-field" id="cf_passport_location-wrapper">
              <label className="expandable-form-label-field">Nơi cấp </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_passport_location} disabled/>
            </div>)}
            {potentialData.customer_type !== 'Cá nhân' && ( <div className="expandable-form-wrapper-field" id="company_name-wrapper">
              <label className="expandable-form-label-field">Tên công ty </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.company_name} disabled/>
            </div>)}
            { potentialData.isSaleKhuVuc ? (<div className="expandable-form-wrapper-field" id="company_source-wrapper">
              <label className="expandable-form-label-field">Khách do công ty cung cấp </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.company_source ? 'Yes' : 'No'} disabled/>
            </div>) : ''}
            <div className="expandable-form-wrapper-field" id="cf_pot_motachung-wrapper">
              <label className="expandable-form-label-field">Mô tả chung về khách hàng </label>
              <textarea name="cf_pot_motachung" className="expandable-form-input-field" rows="5"
                        placeholder="" defaultValue={potentialData.cf_pot_motachung} disabled/>
            </div>
          </ExpandableFormComponent>
          <ExpandableFormComponent title="Thông tin liên hệ">
            <div className="expandable-form-wrapper-field" id="cf_mobile-wrapper">
              <label
                className="expandable-form-label-field">Số điện thoại </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_mobile} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_contact_street-wrapper">
              <label
                className="expandable-form-label-field">Địa chỉ chi tiết </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_contact_street} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_email-wrapper">
              <label
                className="expandable-form-label-field">Primary Email </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_email} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_city-wrapper">
              <label className="expandable-form-label-field">
                Thàng phố/ Tỉnh
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_city} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_state-wrapper">
              <label className="expandable-form-label-field">
                Quận/ Huyện
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_state} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_khu_vuc-wrapper">
              <label className="expandable-form-label-field">
                Khu vực
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_khu_vuc.label} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="leadsource-wrapper">
              <label className="expandable-form-label-field">
                Nguồn khách hàng
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.leadsource.label} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_lead_source_des-wrapper">
              <label className="expandable-form-label-field">Mô tả nguồn khách hàng </label>
              <textarea name="cf_pot_lead_source_des" className="expandable-form-input-field" rows="5"
                        placeholder="" defaultValue={potentialData.cf_pot_lead_source_des} />
            </div>
          </ExpandableFormComponent>
          <ExpandableFormComponent title="Thông tin hợp đồng">
            <div className="expandable-form-wrapper-field" id="cf_pot_contractid-wrapper">
              <label
                className="expandable-form-label-field">Số hợp đồng</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_contractid} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="represent-wrapper">
              <label
                className="expandable-form-label-field">Người đại diện</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.represent} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_goihd-wrapper">
              <label className="expandable-form-label-field">
                Gói hợp đồng
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_goihd} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_thoihan-wrapper">
              <label
                className="expandable-form-label-field">Thời hạn (SỐ tháng)</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_thoihan} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_khuyenmai-wrapper">
              <label
                className="expandable-form-label-field">Khuyến mại (SỐ tháng)</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_khuyenmai} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="closedwon_date-wrapper">
              <label className="expandable-form-label-field">Ngày ký hợp đồng </label>
              <div className="expandable-form-input-date-wrapper">
                <input type="text" className="expandable-form-input-field"
                       defaultValue={potentialData.closedwon_date} disabled/>
              </div>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_ma_voucer-wrapper">
              <label
                className="expandable-form-label-field">Mã KM</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_ma_voucer} disabled/>
            </div>
            <div className="row-col-2">
              <div className="expandable-form-wrapper-field" id="cf_pot_startdate-wrapper" style={{width: '100%', marginRight: '10px'}}>
                <label className="expandable-form-label-field">Ngày bắt đầu </label>
                <div className="expandable-form-input-date-wrapper">
                  <input type="text" className="expandable-form-input-field"
                         defaultValue={potentialData.cf_pot_startdate} disabled/>
                </div>
              </div>
              <div className="expandable-form-wrapper-field" id="cf_pot_enddate-wrapper" style={{width: '100%', marginLeft: '10px'}}>
                <label className="expandable-form-label-field">Ngày kết thúc </label>
                <div className="expandable-form-input-date-wrapper">
                  <input type="text" className="expandable-form-input-field"
                         defaultValue={potentialData.cf_pot_enddate} disabled/>
                </div>
              </div>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_hinhthuctt-wrapper">
              <label className="expandable-form-label-field">
                Hình thức thanh toán
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_hinhthuctt} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="amount-wrapper">
              <label
                className="expandable-form-label-field">Thành tiền</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={new Intl.NumberFormat('vi-VN', {
                       style: 'currency',
                       currency: 'VND',
                     }).format(potentialData.amount)} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_sochinhanh-wrapper">
              <label
                className="expandable-form-label-field">Số cửa hàng (Số)</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_sochinhanh} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_diachich-wrapper">
              <label
                className="expandable-form-label-field">Địa chỉ</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_diachich} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_branch_address-wrapper">
              <label
                className="expandable-form-label-field">Địa chỉ chi nhánh</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_branch_address} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_note-wrapper">
              <label className="expandable-form-label-field">Ghi chú </label>
              <textarea name="cf_pot_note" className="expandable-form-input-field" rows="5"
                        placeholder="" defaultValue={potentialData.cf_pot_note} disabled/>
            </div>
          </ExpandableFormComponent>
          <ExpandableFormComponent title="Thông tin CSKH">
            <div className="expandable-form-wrapper-field" id="assigned_user_id-wrapper">
              <label className="expandable-form-label-field">
                Người xử lý
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.assigned_user_id.label} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_869-wrapper">
              <label className="expandable-form-label-field">
                Gọi CSKH
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_869} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_967-wrapper">
              <label className="expandable-form-label-field">
                Đánh giá
              </label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_967} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_871-wrapper">
              <label className="expandable-form-label-field">Phản hồi CSKH </label>
              <textarea name="cf_871" className="expandable-form-input-field" rows="5"
                        placeholder="" defaultValue={potentialData.cf_871} disabled/>
            </div>
          </ExpandableFormComponent>
          <ExpandableFormComponent title="Câu hỏi thường gặp">
            <div className="expandable-form-wrapper-field" id="cf_pot_tinhhinhkinhdoanh-wrapper">
              <label
                className="expandable-form-label-field">Tình hình kinh doanh hiện nay của khách hàng?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_tinhhinhkinhdoanh} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_hinhthuccongcu-wrapper">
              <label
                className="expandable-form-label-field">Hình thức công cụ quản lý hiện nay?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_hinhthuccongcu} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_tinhnang-wrapper">
              <label
                className="expandable-form-label-field">Tính năng của Kiot Việt là yếu tố quyết định?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_tinhnang} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_diemyeu-wrapper">
              <label
                className="expandable-form-label-field">Điểm yếu nào của Kiot Việt khiến khách hàng cân nhắc?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_diemyeu} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_khokhan-wrapper">
              <label
                className="expandable-form-label-field">Khó khăn khách hàng đang gặp phải?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_khokhan} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_tinhchudong-wrapper">
              <label
                className="expandable-form-label-field">Tính chủ động của khách hàng?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_tinhchudong} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_ngancankh-wrapper">
              <label
                className="expandable-form-label-field">Yếu tố nào ngăn cản khách hàng quyết định?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_ngancankh} disabled/>
            </div>
            <div className="expandable-form-wrapper-field" id="cf_pot_doithunao-wrapper">
              <label
                className="expandable-form-label-field">Đối thủ nào đã tiếp cận khách hàng?</label>
              <input type="text" className="expandable-form-input-field"
                     defaultValue={potentialData.cf_pot_doithunao} disabled/>
            </div>
          </ExpandableFormComponent>
        </div>
      )
    }
}

export default OptPhanMemViewComponent
