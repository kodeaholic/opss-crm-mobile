import React from 'react'
import './index.css'
const ExpandableFormComponent = (props) => {
  let show = (el) => {
    let content = el.nextSibling
    if (content) {
      content.classList.remove("hidden")
      content.classList.add("visible")
    }
    let caret = null
    try {
      caret = el.childNodes[2].childNodes[0]
    } catch (e) {
      console.log(e.message)
    }
    if (caret) {
      caret.classList.remove("fa-caret-down")
      caret.classList.add("fa-caret-up")
    }
  }
  let hide = (el) => {
    let content = el.nextSibling
    if (content) {
      content.classList.remove("visible")
      content.classList.add("hidden")
    }
    let caret = null
    try {
      caret = el.childNodes[2].childNodes[0]
    } catch (e) {
      console.log(e.message)
    }
    if (caret) {
      caret.classList.remove("fa-caret-up")
      caret.classList.add("fa-caret-down")
    }
  }
  let clickToToggle = (e) => {
    if (e.target.tagName.toLocaleLowerCase() === 'span' || e.target.tagName.toLocaleLowerCase() === 'i') {
      e.stopPropagation()
      e.target.parentElement.click()
    }
    else {
      let heading = e.target
      if (heading.parentElement.classList.contains("expanded")) {
        hide(e.target)
        heading.parentElement.classList.remove("expanded")
      }
      else {
        show(e.target)
        heading.parentElement.classList.add("expanded")
      }
    }
  }
  const caretClass = props.expanded !== undefined ? "fa fa-caret-up" : "fa fa-caret-down"
  const formClass = props.expanded !== undefined ? "expandable-form expanded" : "expandable-form"
  let contentClass = props.expanded !== undefined ? "expandable-form-content visible" : "expandable-form-content hidden"
  contentClass = props.noMarginBottom !== undefined ? contentClass + " no-margin-bottom" : contentClass
  return (
    <div className={formClass}>
      <div className="expandable-form-heading" onClick={clickToToggle}>
        {props.title} <span className="float-right-caret-icon"><i className={caretClass}/></span>
      </div>
      { props.children ? (<div className={contentClass}>
        {props.children}
      </div>) : null}
    </div>
  )
}

export default ExpandableFormComponent
