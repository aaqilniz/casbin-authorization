// import {
//     AuthorizationDecision,
//     AuthorizationContext,
//     AuthorizationMetadata,
// } from '@loopback/authorization';
// import { Context } from '@loopback/core';
// import { securityId } from '@loopback/security';
// import * as casbin from 'casbin';
// import { CasbinAuthorizationProvider } from '../../index';
// import { expect } from '@loopback/testlab';

// // Define a Casbin model as a string
// const casbinModel = `
//   [request_definition]
//   r = sub, obj, act
  
//   [policy_definition]
//   p = sub, obj, act
  
//   [role_definition]
//   g = _, _
  
//   [policy_effect]
//   e = some(where (p.eft == allow))
  
//   [matchers]
//   m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
//   `;

// describe('CasbinAuthorizationProvider', () => {
//     let context: Context;

//     beforeEach(() => {
//         context = new Context();
//     });

//     function createAuthorizationContext(
//         principals: Array<{ id: number }>,
//         resource?: string,
//         args?: unknown[],
//     ): AuthorizationContext {
//         context.bind('args').to(args ?? []);
//         return {
//             principals: principals.map(p => ({
//                 [securityId]: `u${p.id}`,
//                 id: p.id
//             })),
//             invocationContext: {
//                 get: context.get.bind(context),
//                 bind: context.bind.bind(context),
//             } as Partial<Context> as Context,
//             resource,
//         } as unknown as Partial<AuthorizationContext> as AuthorizationContext;
//     }

//     async function createEnforcerWithPolicy(policies: string[][]): Promise<casbin.Enforcer> {
//         const model = casbin.newModelFromString(casbinModel); // `newModelFromString` returns a Model, not a Promise
//         const enforcer = await casbin.newEnforcer(model); // Pass the model to `newEnforcer`
//         for (const policy of policies) {
//             await enforcer.addPolicy(...policy);
//         }
//         return enforcer;
//     }

//     it('should deny access when no allowedRoles are provided', async () => {
//         const enforcerFactory = async () => createEnforcerWithPolicy([]);
//         const provider = new CasbinAuthorizationProvider(enforcerFactory);
//         const authorizer = provider.value();

//         const authorizationCtx = createAuthorizationContext([{ id: 1 }]);
//         const metadata: AuthorizationMetadata = {};

//         const decision = await authorizer(authorizationCtx, metadata);
//         expect(decision).to.equal(AuthorizationDecision.DENY);
//     });

//     it('should allow access when enforcer returns true for at least one role', async () => {
//         const enforcerFactory = async () =>
//             createEnforcerWithPolicy([['u1', 'resource1', 'execute']]);
//         const provider = new CasbinAuthorizationProvider(enforcerFactory);
//         const authorizer = provider.value();

//         const authorizationCtx = createAuthorizationContext([{ id: 1 }], 'resource1');
//         const metadata: AuthorizationMetadata = { allowedRoles: ['role1'] };
//         const decision = await authorizer(authorizationCtx, metadata);
//         expect(decision).to.equal(AuthorizationDecision.ALLOW);
//     });

//     it('should deny access when enforcer returns false for all roles', async () => {
//         const enforcerFactory = async () => createEnforcerWithPolicy([]);
//         const provider = new CasbinAuthorizationProvider(enforcerFactory);
//         const authorizer = provider.value();

//         const authorizationCtx = createAuthorizationContext([{ id: 1 }], 'resource1');
//         const metadata: AuthorizationMetadata = { allowedRoles: ['role1'] };

//         const decision = await authorizer(authorizationCtx, metadata);
//         expect(decision).to.equal(AuthorizationDecision.DENY);
//     });
// });
