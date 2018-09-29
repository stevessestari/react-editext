import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

export default class EdiText extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      valid: true,
      value: props.value || '',
      savedValue: ''
    }
  }

  _onInputChange = e => {
    this.setState({
      valid: true,
      value: e.target.value
    })
  }

  _onCancel = () => {
    this.setState(
      {
        valid: true,
        editing: false,
        value: this.state.savedValue || this.props.value
      }, () => this.props.onCancel(this.state.value)
    )
  }

  _activateEditMode = () => {
    this.setState({
      editing: true
    })
  }

  _onSave = () => {
    const { onSave, validation, onValidationFail } = this.props
    const isValid = validation(this.state.value)
    if (!isValid) {
      return this.setState({ valid: false }, () => {
        onValidationFail && onValidationFail(this.state.value)
      })
    }
    this.setState(
      {
        editing: false,
        savedValue: this.state.value
      }, () => onSave(this.state.savedValue)
    )
  }

  _onKeyPress = event => {
    if (event.key === 'Enter' ||
      event.charCode === 13 ||
      event.key === 'Enter') {
      this._onSave()
    }
  }
  _renderInput() {
    if (this.props.type === 'textarea') {
      return (
        <textarea
          className={styles['editext-input']}
          value={this.state.value}
          onChange={this._onInputChange}
          autoFocus={this.state.editing}
          onKeyDown={this._onKeyPress}
          {...this.props.inputProps}
        />
      )
    } else {
      return (
        <input
          type={this.props.type}
          className={styles['editext-input']}
          value={this.state.value}
          onChange={this._onInputChange}
          autoFocus={this.state.editing}
          onKeyDown={this._onKeyPress}
          {...this.props.inputProps}
        />
      )
    }
  }
  _renderEditingMode = () => {
    const {
      containerClassName,
      saveButtonClassName,
      saveButtonText,
      cancelButtonClassName,
      cancelButtonText,
      onValidationFail,
      validationMessage
    } = this.props
    const inputElem = this._renderInput()
    return (
      <div className={styles['editext-main-container']}>
        <div className={containerClassName}>
          {inputElem}
          <div className={styles['action-buttons-container']}>
            <button
              type='button'
              className={saveButtonClassName}
              onClick={this._onSave}
            >
              {saveButtonText}
            </button>
            <button
              type='button'
              className={cancelButtonClassName}
              onClick={this._onCancel}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
        {!this.state.valid && !onValidationFail &&
          <div className={styles['editext-validation-message']}>
            {validationMessage}
          </div>
        }
      </div>
    )
  }
  _renderViewMode = () => {
    const {
      containerClassName,
      viewProps,
      editButtonClassName,
      editButtonText
    } = this.props
    return (
      <div className={containerClassName}>
        <div {...viewProps}>{this.state.value}</div>
        <div className={styles['action-buttons-container']}>
          <button
            type='button'
            className={editButtonClassName}
            onClick={this._activateEditMode}
          >
            {editButtonText}
          </button>
        </div>
      </div>
    )
  }
  render() {
    return this.state.editing ? this._renderEditingMode() : this._renderViewMode()
  }
}

EdiText.defaultProps = {
  value: '',
  type: 'text',
  validationMessage: 'Invalid Value',
  validation: value => true,
  onCancel: () => { },
  cancelButtonText: '',
  saveButtonText: '',
  editButtonText: '',
  // Enzyme does not work propery with dynamic styles. This is temp. workaround.
  saveButtonClassName: styles['editext-save-button'] || 'editext-save-button',
  cancelButtonClassName: styles['editext-cancel-button'] || 'editext-cancel-button',
  editButtonClassName: styles['editext-edit-button'] || 'editext-edit-button',
  containerClassName: styles['editext-editing-container'] || 'editext-editing-container'
}

EdiText.propTypes = {
  inputProps: PropTypes.object,
  viewProps: PropTypes.object,
  value: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  validation: PropTypes.func,
  onValidationFail: PropTypes.func,
  type: PropTypes.oneOf(
    ['text', 'textarea', 'email', 'number']
  ).isRequired,
  // Events
  onCancel: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  // classNames
  containerClassName: PropTypes.string,
  saveButtonClassName: PropTypes.string,
  editButtonClassName: PropTypes.string,
  cancelButtonClassName: PropTypes.string,
  // Custom Button Texts
  cancelButtonText: PropTypes.string,
  saveButtonText: PropTypes.string,
  editButtonText: PropTypes.string
}
