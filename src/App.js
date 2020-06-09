import React from 'react';
import './App.css';
import { Layout, Button } from 'antd';
import OxxoForm from "./OxxoForm";
import Voucher from "./Voucher";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import keyMirror from "keymirror";

const stripePromise = loadStripe(
  'pk_test_0123456',
  { betas: ['oxxo_pm_beta_1'], apiVersion: '2020-03-02; oxxo_beta=v2' }
);
const STEPS = keyMirror({
  CREATE_PAYMENT_INTENT: null,
  FILL_FORM: null,
  DISPLAY_VOUCHER: null
})

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { client_secret: null, oxxo_detail: {}, step: STEPS.CREATE_PAYMENT_INTENT }
  }

  createPaymentIntent = () => {
    const option = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    };

    fetch('/payment-intent', option)
      .then(res => res.json())
      .then(data => this.setState({ client_secret: data.client_secret, step: STEPS.FILL_FORM }))
  }

  OnReceiveOxxoDetails = details => this.setState({ oxxo_detail: details, step: STEPS.DISPLAY_VOUCHER })

  renderBody = () => {
    const { step, client_secret } = this.state;

    switch (step) {
      case STEPS.CREATE_PAYMENT_INTENT:
        return (
          <Button type="primary" onClick={this.createPaymentIntent}>
            Demo a OXXO Payment
          </Button>
        );
      case STEPS.FILL_FORM:
        return (
          <Elements stripe={stripePromise}>
            <OxxoForm client_secret={client_secret} OnReceiveOxxoDetails={this.OnReceiveOxxoDetails} />
          </Elements>
        );
      case STEPS.DISPLAY_VOUCHER:
        return (
          <Voucher {...this.state.oxxo_detail} />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="App">
        <Layout.Header>
          <h1 className="header">OXXO Integration Dogfooding</h1>
        </Layout.Header>
        <Layout.Content>
          <div className="make-oxxo">
            {this.renderBody()}
          </div>
        </Layout.Content>
      </div>
    );
  }
}

export default App;
