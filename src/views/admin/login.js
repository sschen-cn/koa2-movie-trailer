import React, { Component } from 'react'
import { request } from '../../lib'
import { Link } from 'react-router-dom'
import { 
  Form,
  Icon,
  Input,
  Button
} from 'antd'
import '../../assets/common.sass'

const FormItem = Form.Item

@Form.create()
export default class Detail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  _toggleLoading = (status = false) => {
    this.setState({
      logding: status
    })
  }

  _handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        request(this._toggleLoading)({
          method: 'post',
          url: '/admin/login',
          data: {
            ...values
          }
        })
          .then(res => {
            this.props.history.replace('/admin/list')
          })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form onSubmit={this._handleSubmit} className='login-form'>
          <h3 style={{textAlign: 'center'}}>预告片管理后台</h3>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                required: true,
                message: '请填入邮箱'
              }]
            })(
              <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='Email' />
            )}
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('password', {
              rules: [{
                required: true,
                message: '请填入密码'
              }]
            })(
              <Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />} type='password' placeholder='Password' />
            )}
          </FormItem>
          <FormItem>
            <Button style={{ width: '100%' }} htmlType='submit' loading={this.state.loading}>
              Log in
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}