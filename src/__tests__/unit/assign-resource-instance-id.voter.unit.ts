import {expect} from '@loopback/testlab';
import {Context} from '@loopback/core';
import {AuthorizationContext, AuthorizationMetadata, AuthorizationDecision} from '@loopback/authorization';
import {assignResourceInstanceId} from '../../services/assign-resource-instance-id.voter';
import {RESOURCE} from '../../keys';

describe('assignResourceInstanceId', () => {
  let invocationContext: Context;

  beforeEach(() => {
    // Reset the context for every test
    invocationContext = new Context();
  });

  /**
   * Mock AuthorizationContext with the required invocationContext and args
   * @param args - Array of arguments to set in the invocationContext
   * @param resource - Resource name for the AuthorizationContext
   * @returns Mocked AuthorizationContext
   */
  function createAuthorizationContext(args: number[] = [], resource?: string): AuthorizationContext {
    invocationContext.bind('args').to(args);
    return {
      invocationContext: {
        args,
        bind: invocationContext.bind.bind(invocationContext), // Bind function for RESOURCE
        get: invocationContext.get.bind(invocationContext), // Get function for RESOURCE
      } as Partial<Context> as Context,
      resource,
    } as Partial<AuthorizationContext> as AuthorizationContext;
  }

  it('should bind the correct resource name to RESOURCE', async () => {
    const args = [1];
    const authorizationCtx = createAuthorizationContext(args);
    const metadata: AuthorizationMetadata = {resource: 'product'};

    const decision = await assignResourceInstanceId(authorizationCtx, metadata);

    const boundResourceId = await invocationContext.get(RESOURCE);
    expect(boundResourceId).to.equal('product1');
    expect(decision).to.equal(AuthorizationDecision.ABSTAIN);
  });

  it('should use metadata.resource when authorizationCtx.resource is undefined', async () => {
    const args = [2];
    const authorizationCtx = createAuthorizationContext(args);
    const metadata: AuthorizationMetadata = {resource: 'custom-resource'};

    const decision = await assignResourceInstanceId(authorizationCtx, metadata);

    const boundResourceId = await invocationContext.get(RESOURCE);
    expect(boundResourceId).to.equal('custom-resource2');
    expect(decision).to.equal(AuthorizationDecision.ABSTAIN);
  });

  it('should use authorizationCtx.resource when metadata.resource is not present', async () => {
    const args = [3];
    const authorizationCtx = createAuthorizationContext(args, 'default-resource');
    const metadata: AuthorizationMetadata = {resource: undefined};

    const decision = await assignResourceInstanceId(authorizationCtx, metadata);

    const boundResourceId = await invocationContext.get(RESOURCE);
    expect(boundResourceId).to.equal('default-resource3');
    expect(decision).to.equal(AuthorizationDecision.ABSTAIN);
  });

  it('should bind a wildcard resource name when ID is not present', async () => {
    const authorizationCtx = createAuthorizationContext();
    const metadata: AuthorizationMetadata = {resource: 'wildcard-resource'};

    const decision = await assignResourceInstanceId(authorizationCtx, metadata);

    const boundResourceId = await invocationContext.get(RESOURCE);
    expect(boundResourceId).to.equal('wildcard-resource*');
    expect(decision).to.equal(AuthorizationDecision.ABSTAIN);
  });
});
