// experiment to handle generated JS endpoints like Google Maps and Stripe
import React from 'react';
import ReactDOM from 'react-dom';

class Consumer extends React.Component {
  constructor(props) {
    super(props);

    console.log(Stripe.version);
  }

  render() {
    return (
      <div>Consumer Node</div>
    );
  }
}

class External extends React.Component {
  constructor(props) {
    super(props);

    this.resources = props.resources;

    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    const loaded = true;
    if (this.resources) {
      Promise
        .all(this.resources.map(p => External.injectScript(p)))
        .then(() => {
          console.info('loaded');
          this.setState({loaded})
        })
        .catch(console.error.bind(console));
    } else {
      console.warn('no scripts to load');
      this.setState({loaded});
    }
  }

  static injectScript(path) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = path;
      script.onload = (e) => {
        resolve(e);
      };
      script.onerror = (e) => {
        reject(e);
      };

      const sibling = document.getElementsByTagName('script')[0];
      sibling.parentNode.insertBefore(script, sibling);

      return {script, path};
    });
  }

  render() {
    return this.state.loaded ? this.props.children : <div />;
  }
}


const entry = (
  <External resources={['https://js.stripe.com/v2/']}>
    <Consumer />
  </External>
);

ReactDOM.render(entry, document.getElementById('myAppId'));