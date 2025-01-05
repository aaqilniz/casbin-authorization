import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
  AuthorizationTags
} from '@loopback/authorization';
import { inject, Provider } from '@loopback/core';
import * as casbin from 'casbin';
import { POLICY_REPO, RESOURCE } from '../keys';
const debug = require('debug')('loopback:extension:casbin');
const DEFAULT_SCOPE = 'execute';

// Class level authorizer
export class CasbinAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @inject('casbin.enforcer.factory')
    private enforcerFactory: (policies: string[][], rolesPolicies: string[][]) => Promise<casbin.Enforcer>,
    @inject(POLICY_REPO)
    public policyRepo: any,
  ) { }

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }
  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {

    const subject = this.getUserName(authorizationCtx.principals[0].id);
    const resourceId = await authorizationCtx.invocationContext.get(
      RESOURCE,
      { optional: true },
    );
    const object = resourceId ?? metadata.resource ?? authorizationCtx.resource;
    const action = metadata.scopes?.[0] ?? DEFAULT_SCOPE;

    let allow = false;
    let restrictedProperties: string[] = [];
    const policiesFromDB = await this.policyRepo.find({ where: { object } });

    const groupPolicy = 'g';
    const rolesPoliciesFromDB = await this.policyRepo.find({ where: { policyType: groupPolicy } })
    const policies: any[][] = [];
    const rolesPolicies: any[][] = [];

    policiesFromDB.forEach((policy: any) => {
      restrictedProperties = policy.restrictedFields.split(',').map((item: string) => item.trim());
      authorizationCtx.invocationContext.bind(AuthorizationTags.RESTRICTED_FIELDS).to(restrictedProperties);
      let tempArray = []
      if (policy.role) tempArray.push(policy.role);
      if (policy.object) tempArray.push(policy.object);
      if (policy.action) tempArray.push(policy.action);
      policies.push(tempArray);
    });

    rolesPoliciesFromDB.forEach((policy: any) => {
      let tempArray = []
      if (policy.role) tempArray.push(policy.role);
      if (policy.object) tempArray.push(policy.object);
      rolesPolicies.push(tempArray);
    });

    const enforcer = await this.enforcerFactory(policies, rolesPolicies);
    const allowedByRole = await enforcer.enforce(subject, object, action);
    if (allowedByRole) {
      allow = true;
    }

    debug('final result: ', allow);

    if (allow) return AuthorizationDecision.ALLOW;
    if (!allow) return AuthorizationDecision.DENY;
    return AuthorizationDecision.ABSTAIN;
  }

  // Generate the user name according to the naming convention
  // in casbin policy
  // A user's name would be `u${id}`
  getUserName(id: number): string { return `u${id}` }
}
