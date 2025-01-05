# casbin-authorization

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install CasbinAuthorizationComponent using `npm`;

```sh
$ [npm install | yarn add] casbin-authorization
```

## Basic Use

Configure and load CasbinAuthorizationComponent in the application constructor
as shown below.

```ts
import {CasbinAuthorizationComponent, CasbinAuthorizationComponentOptions, DEFAULT_CASBIN_AUTHORIZATION_OPTIONS} from 'casbin-authorization';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: CasbinAuthorizationComponentOptions = DEFAULT_CASBIN_AUTHORIZATION_OPTIONS;
    this.configure(CasbinAuthorizationComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(CasbinAuthorizationComponent);
    // ...
  }
  // ...
}
```
