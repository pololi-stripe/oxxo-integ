import React from "react";
import { Form, Input, Button, Alert } from 'antd';
import { useStripe } from '@stripe/react-stripe-js';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function OxxoForm(props) {
  const { client_secret } = props;
  const stripe = useStripe();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    if (!stripe || !client_secret) {
      return;
    }

    const result = await stripe.confirmOxxoPayment(
      client_secret,
      {
        payment_method: {
          billing_details: {
            name, email
          },
        },
      }, { handleActions: false },
    );

    if (result.error) {
      setError(result.error.message);
    } else {
      const { amount, currency } = result.paymentIntent;
      const { number, expires_after } = result.paymentIntent.next_action.display_oxxo_details;

      props.OnReceiveOxxoDetails({ amount, currency, number, expires_after });
    }
  }

  return (
    <Form
      {...layout}
      name="oxxo"
      onFinish={handleSubmit}
    >
      {error && <Alert message={error} type="error" />}
      <Form.Item
        label="name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
          },
        ]}
      >
        <Input onChange={event => setName(event.target.value)} value={name} />
      </Form.Item>

      <Form.Item
        label="email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input onChange={event => setEmail(event.target.value)} value={email} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}