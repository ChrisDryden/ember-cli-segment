import Ember from 'ember';
import segmentMixin from './mixin';

export function initialize(container, application) {
  var config = container.lookupFactory('config:environment');
  var segment = Ember.Object.extend(segmentMixin);

  application.register('service:segment', segment.extend({ config: config }), { singleton: true });
  application.inject('route', 'segment', 'service:segment');
  application.inject('router', 'segment', 'service:segment');
  application.inject('controller', 'segment', 'service:segment');

  var router = container.lookup('router:main');
  router.on('didTransition', function() {
    container.lookup('service:segment').trackPageView();

    var applicationRoute = container.lookup('route:application');
    if(applicationRoute && typeof applicationRoute.identifyUser === 'function') {
      applicationRoute.identifyUser();
    }
  });
}
