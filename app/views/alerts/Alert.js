import $ from 'jquery';
import _ from 'underscore';
import View from '../View';
import Manager from 'app/Manager';

const template = data => `
<div class="alert-message alert-pop">
  <p>${data.message}</p>
  <div class="alert-actions">
    <button class="dismiss-alert">Ok</button>
  </div>
</div>
`

class Alert extends View {
  constructor(params) {
    super(_.extend({
      parent: '.alert-wrapper',
      template: template,
      attrs: {class: 'alert'}
    }, params));
    this.registerHandlers({
      '.dismiss-alert': function() {
        this.remove();
        if (params.onDismiss) {
          params.onDismiss();
        }
      }
    });
  }

  postRender() {
    super.postRender();
    var state = Manager.game.state.states[Manager.game.state.current];
    if (_.isFunction(state.pause)) {
      state.pause();
    }
    Alert.current = this;
    $('.alert-wrapper').show();
  }

  postRemove() {
    super.preRemove();
    var state = Manager.game.state.states[Manager.game.state.current];
    if (_.isFunction(state.resume)) {
      state.resume();
    }
    Alert.current = null;
    $('.alert-wrapper').hide();
  }
}

Alert.current = null;
export default Alert;
