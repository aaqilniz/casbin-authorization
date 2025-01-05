import {AuthorizationTags} from '@loopback/authorization';
import {Binding, Component} from '@loopback/core';
import {CasbinAuthorizationProvider, createEnforcerWithPolicy} from './services';

export class CasbinAuthorizationComponent implements Component {
  bindings: Binding[] = [
    Binding.bind('casbin.enforcer.factory').to(createEnforcerWithPolicy),
    Binding.bind('authorizationProviders.casbin-provider')
      .toProvider(CasbinAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER),
  ];
}
